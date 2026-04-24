// ============================================
// API Route: Pusher Event Trigger
// Receives form updates and broadcasts via Pusher
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getPusherServer } from "@/lib/pusher-server";
import { PATIENT_FORM_CHANNEL } from "@/lib/pusher-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    const pusher = getPusherServer();

    // Trigger the event on the patient-form channel
    await pusher.trigger(PATIENT_FORM_CHANNEL, event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher trigger error:", error);
    return NextResponse.json(
      { error: "Failed to trigger event" },
      { status: 500 }
    );
  }
}
