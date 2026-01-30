import HourlyDay from "./HourlyDay";

function dayName(ts) {
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    weekday: "short"
  });
}

export default function DailyForecast({
  daily,
  hourly,
  unit,
  onSelectForecast
}) {
  function convert(t) {
    return unit === "f" ? t * 9 / 5 + 32 : t;
  }

  return (
    <div className="card">
      <strong>Next Days</strong>

      {daily.slice(1).map((d, i) => (
        <div key={i}>
          {/* DAY HEADER */}
          <div className="daily-row">
            <strong>{dayName(d.dt)}</strong>

            <div className="icon">
              {weatherIcon(d.weather_code)}
            </div>

            <div>
              {Math.round(convert(d.temp.max))}°
              <span className="low">
                {" "}
                {Math.round(convert(d.temp.min))}°
              </span>
            </div>
          </div>

          {/* ALWAYS-OPEN HOURLY */}
          <HourlyDay
            dayTimestamp={d.dt}
            hourly={hourly}
            unit={unit}
            onSelectForecast={onSelectForecast}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function weatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code >= 95) return "⛈️";
  return "❓";
}
