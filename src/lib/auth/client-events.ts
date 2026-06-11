/** Client-side auth state change notification (login / logout). */
export const AUTH_CHANGED_EVENT = "hp-auth-changed";

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
