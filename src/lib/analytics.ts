type AnalyticsParams = Record<string, any>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const payload: AnalyticsParams =
    process.env.NODE_ENV === "production"
      ? params
      : { ...params, debug_mode: true };

  if (process.env.NODE_ENV !== "production") {
    console.log("[analytics] event", name, payload);
  }

  window.gtag("event", name, payload);
}

export function createRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}
