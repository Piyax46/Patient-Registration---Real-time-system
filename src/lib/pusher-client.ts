// ============================================
// Pusher Client Instance (for browser)
// ============================================

import PusherClient from "pusher-js";

// Singleton pattern to avoid creating multiple instances
let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherClientInstance) {
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    );
  }
  return pusherClientInstance;
}

// Channel name constant
export const PATIENT_FORM_CHANNEL = "patient-form";
