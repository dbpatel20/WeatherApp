export default function HourlyForecast({ hourly, unit, onSelectForecast }) {
  function convert(t) {
    return unit === "f" ? t * 9 / 5 + 32 : t;
  }

  const now = Math.floor(Date.now() / 1000);
  const hours = hourly.filter(h => h.dt >= now).slice(0, 24);

  return (
    <div className="card">
      <strong>Hourly</strong>

      <div className="hourly-day full">
        {hours.map((h, i) => (
          <div
            key={i}
            className="hour-box full"
            onClick={() =>
              onSelectForecast({
                time: h.dt,
                temp: h.temp,
                feels_like: h.feels_like,
                humidity: h.humidity,
                wind: h.wind,
                weather_code: h.weather_code
              })
            }
          >
            <div className="time">
              {new Date(h.dt * 1000).getHours()}:00
            </div>
            <div className="icon">🌤️</div>
            <div className="temp">{Math.round(convert(h.temp))}°</div>
            <div className="pop">{h.pop ?? 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
