function weatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code >= 95) return "⛈️";
  return "❓";
}

export default function HourlyDay({
  dayTimestamp,
  hourly,
  unit,
  onSelectForecast
}) {
  function convert(t) {
    return unit === "f" ? t * 9 / 5 + 32 : t;
  }

  const start = dayTimestamp;
  const end = dayTimestamp + 24 * 60 * 60;

  // ✅ FULL 24 HOURS
  const hours = hourly.filter(
    (h) => h.dt >= start && h.dt < end
  );

  return (
    <div className="hourly-day full">
      {hours.map((h, i) => (
        <div
          key={i}
          className="hour-box full"
          onClick={() =>
            onSelectForecast({
              time: h.dt,
              weather_code: h.weather_code
            })
          }
        >
          <div className="time">
            {new Date(h.dt * 1000).getHours()}:00
          </div>

          <div className="icon">
            {weatherIcon(h.weather_code)}
          </div>

          <div className="temp">
            {Math.round(convert(h.temp))}°
          </div>

          <div className="pop">
            {h.pop ?? 0}%
          </div>
        </div>
      ))}
    </div>
  );
}
