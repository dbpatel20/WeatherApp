import { useState } from "react";
import ForecastBox from "./ForecastBox";

function weatherInfo(code, isDay) {
  if (code === 0) return { t: "Clear", i: isDay ? "☀️" : "🌙" };
  if ([1,2,3].includes(code)) return { t: "Cloudy", i: "🌤️" };
  if (code >= 61 && code <= 67) return { t: "Rain", i: "🌧️" };
  if (code >= 71 && code <= 77) return { t: "Snow", i: "❄️" };
  if (code === 95) return { t: "Storm", i: "⛈️" };
  return { t: "Fog", i: "🌫️" };
}

export default function WeatherCard({ city, unit, onRemove }) {
  const [selectedDay, setSelectedDay] = useState(null);

  const current = city.data.current_weather;
  const info = weatherInfo(current.weathercode, current.is_day);

  const temp =
    unit === "C"
      ? current.temperature
      : (current.temperature * 9/5 + 32).toFixed(1);

  // group hourly data by date
  const hourlyByDate = city.data.hourly?.time.reduce((acc, time, i) => {
    const date = time.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push({
      time,
      temp: city.data.hourly.temperature_2m[i],
      code: city.data.hourly.weathercode[i]
    });
    return acc;
  }, {}) || {};

  return (
    <div className="card">
      <div className="remove" onClick={onRemove}>❌</div>

      <strong>
        {city.name}
        {city.admin1 ? `, ${city.admin1}` : ""}, {city.country}
      </strong><br />

      {info.i} {info.t}<br />
      🌡️ {temp}°{unit}<br />
      💨 Wind {current.windspeed} km/h<br />

      {/* DAILY FORECAST */}
      <div className="forecast">
        {city.data.daily.time.map((d, i) => (
          <ForecastBox
            key={d}
            day={d}
            code={city.data.daily.weathercode[i]}
            max={city.data.daily.temperature_2m_max[i]}
            min={city.data.daily.temperature_2m_min[i]}
            unit={unit}
            onClick={() =>
              setSelectedDay(selectedDay === d ? null : d)
            }
          />
        ))}
      </div>

      {/* HOURLY FORECAST */}
      {selectedDay && hourlyByDate[selectedDay] && (
        <div className="hourly">
          <h4>Hourly Forecast</h4>
          <div className="hourly-grid">
            {hourlyByDate[selectedDay].map((h, i) => (
              <div key={i} className="hour-box">
                {new Date(h.time).getHours()}:00<br />
                {weatherInfo(h.code, true).i}<br />
                {unit === "C"
                  ? h.temp
                  : (h.temp * 9/5 + 32).toFixed(0)}°
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
