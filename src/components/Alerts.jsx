import { useState } from "react";

export default function Alerts({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div>
      {alerts.map((alert, i) => (
        <AlertItem key={i} alert={alert} />
      ))}
    </div>
  );
}

function AlertItem({ alert }) {
  const [open, setOpen] = useState(false);

  const severity = getSeverity(alert.event);
  const expires = alert.expires
    ? new Date(alert.expires).toLocaleString()
    : null;

  return (
    <div
      className={`alert ${severity}`}
      onClick={() => setOpen(!open)}
    >
      ⚠️ <strong>{alert.event}</strong>

      {alert.headline && (
        <div className="alert-headline">
          {alert.headline}
        </div>
      )}

      {expires && (
        <div className="alert-expiry">
          Valid until {expires}
        </div>
      )}

      {open && alert.description && (
        <div className="alert-body">
          {alert.description}
        </div>
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function getSeverity(event = "") {
  const e = event.toLowerCase();
  if (e.includes("warning")) return "alert-warning";
  if (e.includes("watch")) return "alert-watch";
  return "alert-advisory";
}
