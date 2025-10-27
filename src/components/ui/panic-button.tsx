import * as React from "react";
import { AlertTriangle, Phone, CheckCircle } from "lucide-react";
import { Button } from "./button";
import { toast } from "@/components/ui/use-toast";

type PanicButtonProps = {
  /** Where to POST panic alerts. Should accept JSON { lat, lng, accuracy, timestamp } */
  endpoint?: string;
  /** Interval (ms) to send repeated location updates while alerting */
  intervalMs?: number;
  /** Optional emergency phone number to open on alert (tel:). */
  emergencyNumber?: string;
  /** Optional audit endpoint to log long-press starts/cancels for auditing */
  auditEndpoint?: string;
  /** When provided, will send a single SMS alert instead of live location updates */
  smsEndpoint?: string;
  /** One or more numbers to send the SMS alert to (string with commas or string[]) */
  smsTo?: string | string[];
  /** Message content for the SMS alert */
  smsMessage?: string;
};

export default function PanicButton({
  endpoint = "/api/panic-alert",
  intervalMs = 15000,
  emergencyNumber,
  auditEndpoint = "/api/panic-audit",
  smsEndpoint,
  smsTo ,
  smsMessage = "Emergency! I need help right now.",
}: PanicButtonProps) {
  const [alerting, setAlerting] = React.useState(false);
  const intervalRef = React.useRef<number | null>(null);
  const [notice, setNotice] = React.useState<null | { type: "success" | "warning" | "error"; text: string }>(null);

  React.useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 6000) as unknown as number;
    return () => window.clearTimeout(t);
  }, [notice]);

  React.useEffect(() => {
    return () => {
      // cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // cleanup press timers / raf
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current as number);
        rafRef.current = null;
      }
    };
  }, []);

  const authHeader = () => {
    try {
      const token = localStorage.getItem("auth_token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  };

  const sendLocation = (position: GeolocationPosition | null, extra: object = {}) => {
    if (!position) return;
    const payload = {
      type: "panic",
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      ...extra,
    };

    // Best-effort POST; errors are surfaced as toasts
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        toast({ title: "Panic alert sent", description: "Authorities and your emergency contacts notified." });
      })
      .catch((err) => {
        console.error("Failed to send panic alert:", err);
        toast({ title: "Alert failed", description: `Could not send alert: ${err.message || err}` });
      });
  };

  const sendSmsAlert = () => {
    if (!smsEndpoint) return;
    if (!smsTo) {
      toast({ title: "Missing number", description: "No SMS destination number configured." });
      return;
    }
    // Normalize into an array for clarity on the server
    const toList = Array.isArray(smsTo)
      ? smsTo
      : String(smsTo)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    if (toList.length === 0) {
      toast({ title: "Missing number", description: "No valid destination numbers found." });
      return;
    }

    // Get current location before sending SMS
    if (!("geolocation" in navigator)) {
      // If geolocation not available, send SMS without location
      sendSmsWithLocation(toList, null);
      return;
    }

    toast({ title: "Getting location", description: "Requesting your location for emergency SMS..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Send SMS with location
        sendSmsWithLocation(toList, position);
      },
      (err) => {
        console.warn("Could not get location:", err);
        // Send SMS without location if geolocation fails
        toast({ title: "Location unavailable", description: "Sending SMS without location data." });
        sendSmsWithLocation(toList, null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const sendSmsWithLocation = (toList: string[], position: GeolocationPosition | null) => {
    let messageWithLocation = smsMessage;
    
    if (position) {
      const { latitude, longitude } = position.coords;
      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      messageWithLocation = `${smsMessage}\n\nMy current location: ${googleMapsLink}`;
    }

    const payload = {
      to: toList,
      message: messageWithLocation,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      timestamp: Date.now(),
    };
    fetch(smsEndpoint!, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            // Friendlier message for unauthenticated users
            toast({ title: "Login required", description: "Please log in to send emergency SMS." });
          }
          throw new Error(`Status ${res.status}`);
        }
        return res.json().catch(() => ({} as unknown));
      })
      .then((data: unknown) => {
        const d = data as { mode?: string; results?: Array<{ ok?: boolean; to?: string; error?: string }> } | undefined;
        const results = Array.isArray(d?.results) ? d!.results! : [];
        if (results.length === 0) {
          toast({ title: "Emergency SMS sent", description: `Requested ${toList.length} recipient(s).` });
          setNotice({ type: "success", text: `SMS sent request for ${toList.length} recipient(s).` });
          return;
        }
        const ok = results.filter((r) => r.ok).map((r) => r.to);
        const fail = results.filter((r) => !r.ok).map((r) => `${r.to}${r.error ? ` (${r.error})` : ""}`);
        if (ok.length && fail.length === 0) {
          toast({ title: "Emergency SMS sent", description: `Delivered to ${ok.length} recipient(s). Provider: ${d?.mode || "unknown"}.` });
          setNotice({ type: "success", text: `SMS sent to ${ok.length} recipient(s).` });
        } else if (ok.length && fail.length) {
          toast({
            title: "Partial delivery",
            description: `Delivered: ${ok.join(", ")}. Failed: ${fail.join(", ")}. Provider: ${d?.mode || "unknown"}.`,
          });
          setNotice({ type: "warning", text: `Partial delivery. Delivered: ${ok.length}. Failed: ${fail.length}.` });
        } else {
          toast({ title: "SMS failed", description: `Failed: ${fail.join(", ") || toList.join(", ")}.` });
          setNotice({ type: "error", text: `SMS failed to deliver.` });
        }
      })
      .catch((err) => {
        console.error("Failed to send SMS alert:", err);
        toast({ title: "SMS failed", description: `Could not send SMS: ${err.message || err}` });
        setNotice({ type: "error", text: `SMS failed to send.` });
      });
  };

  const startAlert = () => {
    // If smsEndpoint provided, send a one-off SMS alert and do not start geolocation updates
    if (smsEndpoint) {
      sendSmsAlert();
      // No continuous alerting state needed for SMS mode
      return;
    }
    if (!("geolocation" in navigator)) {
      toast({ title: "Geolocation not available", description: "Your browser doesn't support geolocation." });
      return;
    }

    toast({ title: "Requesting location", description: "Grant permission to send your location to responders." });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos, { initial: true });
        setAlerting(true);

        // Start periodic updates
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (p) => sendLocation(p),
            (err) => console.warn("Geolocation periodic error", err),
            { enableHighAccuracy: true, maximumAge: 5000 }
          );
        }, intervalMs) as unknown as number;

        // Optionally open phone dialer for emergencyNumber
        if (emergencyNumber) {
          try {
            // allow user to confirm calling their emergency number
            const shouldCall = confirm(`Call ${emergencyNumber} now?`);
            if (shouldCall) window.open(`tel:${emergencyNumber}`);
          } catch (e) {
            // ignore
          }
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        toast({ title: "Location permission denied", description: "Cannot send location without permission." });
      },
      { enableHighAccuracy: true }
    );
  };

  const stopAlert = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlerting(false);
    toast({ title: "Alert stopped", description: "Stopped sending location updates." });
  };

  // Long-press settings (ms)
  const LONG_PRESS_MS = 1200;
  const pressTimerRef = React.useRef<number | null>(null);
  const [isPressing, setIsPressing] = React.useState(false);
  const pressStartRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const [pressProgress, setPressProgress] = React.useState(0);

  const startPress = (triggerFromKeyboard = false) => {
    if (isPressing) return;
    setIsPressing(true);
    // Log audit event: user started a long-press (for auditing/trace)
    sendAudit("long_press_start", { triggerFromKeyboard });
    // record start time
    pressStartRef.current = Date.now();

    // update progress via RAF
    const update = () => {
      if (pressStartRef.current == null) return;
      const elapsed = Date.now() - pressStartRef.current;
      const progress = Math.min(1, elapsed / LONG_PRESS_MS);
      setPressProgress(progress);
      if (progress >= 1) {
        // complete
        setIsPressing(false);
        setPressProgress(0);
        pressStartRef.current = null;
        // audit complete
        sendAudit("long_press_complete", { triggerFromKeyboard });
        startAlert();
        return;
      }
  rafRef.current = window.requestAnimationFrame(update);
    };
    // start RAF loop
  rafRef.current = window.requestAnimationFrame(update);
    // fallback timer to ensure completion even if RAF stalls
    pressTimerRef.current = window.setTimeout(() => {
      if (pressStartRef.current != null) {
        setIsPressing(false);
        setPressProgress(0);
        pressStartRef.current = null;
        sendAudit("long_press_complete", { triggerFromKeyboard });
        startAlert();
      }
    }, LONG_PRESS_MS) as unknown as number;
  };

  const cancelPress = () => {
    setIsPressing(false);
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      // If we cancel before the long-press completes, log for auditing
      sendAudit("long_press_cancel", {});
      // cancel RAF and reset progress
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current as number);
        rafRef.current = null;
      }
      pressStartRef.current = null;
      setPressProgress(0);
    }
  };

  // Send an audit record to auditEndpoint (best-effort)
  const sendAudit = (event: string, extra: Record<string, unknown>) => {
    try {
      const payload = {
        event,
        timestamp: Date.now(),
        page: typeof window !== "undefined" ? window.location.href : null,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        ...extra,
      };

      // fire-and-forget POST
      fetch(auditEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      }).catch((err) => {
        // don't surface to user, but log for debugging
        console.warn("Failed to send audit event", err);
      });
    } catch (e) {
      console.warn("Audit logging failed", e);
    }
  };

  return (
    // Top-right fixed emergency button - mobile optimized
    <div className="fixed right-3 sm:right-6 top-3 sm:top-6 z-50 space-y-2 safe-top safe-right">
      {notice && (
        <div
          className={
            `flex items-center gap-2 px-3 py-2 rounded-md border text-xs sm:text-sm shadow-sm transition-opacity duration-300 max-w-[280px] sm:max-w-none ` +
            (notice.type === "success"
              ? "bg-green-100 border-green-300 text-green-800"
              : notice.type === "warning"
              ? "bg-amber-100 border-amber-300 text-amber-900"
              : "bg-red-100 border-red-300 text-red-800")
          }
          role="status"
          aria-live="polite"
        >
          {notice.type === "success" ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="line-clamp-2">{notice.text}</span>
        </div>
      )}
      {alerting && !smsEndpoint ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="lg"
            variant="destructive"
            onClick={stopAlert}
            aria-label="Stop panic alert"
            title="Stop panic alert"
            className="px-3 sm:px-4 py-2.5 sm:py-3 touch-target h-12 sm:h-auto"
          >
            <Phone className="h-5 w-5 mr-1.5 sm:mr-2" />
            <span className="font-semibold text-sm sm:text-base">STOP ALERT</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* long-press handlers to avoid accidental triggers */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Emergency panic button (hold to activate)"
            title="Hold to activate emergency alert"
            onMouseDown={(e) => {
              // left button only
              if (e.button === 0) startPress();
            }}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={() => startPress()}
            onTouchEnd={cancelPress}
            onTouchCancel={cancelPress}
            onKeyDown={(e) => {
              // Support keyboard: hold Space or Enter
              if (e.key === " " || e.key === "Enter") {
                // prevent scrolling on space
                e.preventDefault();
                startPress(true);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") {
                cancelPress();
              }
            }}
            className="inline-block"
          >
            <div className="relative inline-block">
              <Button
                size="lg"
                variant="destructive"
                onClick={(e) => e.preventDefault()} // avoid immediate click
                aria-hidden={false}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 border-0 shadow-lg touch-target h-12 sm:h-auto ${isPressing ? "ring-4 ring-red-300" : "animate-pulse"}`}
              >
                <AlertTriangle className="h-5 w-5 mr-1.5 sm:mr-2" />
                <span className="uppercase tracking-widest text-xs sm:text-sm font-bold">EMERGENCY</span>
              </Button>
              {/* progress bar under the button while pressing */}
              <div className="absolute left-0 right-0 -bottom-2 h-1 bg-red-200 rounded overflow-hidden">
                <div
                  className="h-full bg-red-700 transition-none"
                  style={{ width: `${pressProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
