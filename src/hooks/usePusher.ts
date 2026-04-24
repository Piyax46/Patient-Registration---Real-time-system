// ============================================
// usePusher Hook — Subscribes to Pusher channel
// ============================================

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getPusherClient, PATIENT_FORM_CHANNEL } from "@/lib/pusher-client";
import type { Channel } from "pusher-js";
import type {
  PatientFormData,
  PatientFormField,
  PatientStatus,
  FormUpdateEvent,
  StatusChangeEvent,
  FormSubmitEvent,
} from "@/types/form";
import { INITIAL_FORM_DATA } from "@/types/form";

interface PusherState {
  formData: PatientFormData;
  activeField: PatientFormField | null;
  status: PatientStatus;
  isConnected: boolean;
  lastUpdate: number | null;
}

export function usePusher() {
  const [state, setState] = useState<PusherState>({
    formData: { ...INITIAL_FORM_DATA },
    activeField: null,
    status: "idle",
    isConnected: false,
    lastUpdate: null,
  });

  const channelRef = useRef<Channel | null>(null);

  const resetState = useCallback(() => {
    setState({
      formData: { ...INITIAL_FORM_DATA },
      activeField: null,
      status: "idle",
      isConnected: true,
      lastUpdate: null,
    });
  }, []);

  useEffect(() => {
    const pusher = getPusherClient();

    // Subscribe to the patient-form channel
    const channel = pusher.subscribe(PATIENT_FORM_CHANNEL);
    channelRef.current = channel;

    // Connection state
    pusher.connection.bind("connected", () => {
      setState((prev) => ({ ...prev, isConnected: true }));
    });

    pusher.connection.bind("disconnected", () => {
      setState((prev) => ({ ...prev, isConnected: false }));
    });

    // Set initial connection state
    if (pusher.connection.state === "connected") {
      setState((prev) => ({ ...prev, isConnected: true }));
    }

    // Listen for form updates
    channel.bind("form-update", (data: FormUpdateEvent) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, [data.field]: data.value },
        activeField: data.activeField,
        lastUpdate: data.timestamp,
      }));
    });

    // Listen for status changes
    channel.bind("status-change", (data: StatusChangeEvent) => {
      setState((prev) => ({
        ...prev,
        status: data.status,
        activeField: data.status === "inactive" ? null : prev.activeField,
        lastUpdate: data.timestamp,
      }));
    });

    // Listen for form submission
    channel.bind("form-submitted", (data: FormSubmitEvent) => {
      setState((prev) => ({
        ...prev,
        formData: data.data,
        status: "submitted",
        activeField: null,
        lastUpdate: data.timestamp,
      }));
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(PATIENT_FORM_CHANNEL);
    };
  }, []);

  return { ...state, resetState };
}
