export default function HeroWeather({ data, unit, selectedForecast }) {
  function convert(t) {
    return unit === "f" ? t * 9 / 5 + 32 : t;
  }

  const temp =
    selectedForecast?.temp ?? data.current.temp;

  const feelsLike =
    selectedForecast?.feels_like ?? data.current.feels_like;

  const humidity =
    selectedForecast?.humidity ?? data.current.humidity;

  const wind =
    selectedForecast?.wind ?? data.current.wind;

  const weatherCode =
    selectedForecast?.weather_code ??
    data.current.weather_code;

  const timeLabel = selectedForecast
    ? new Date(selectedForecast.time * 1000).toLocaleString(undefined, {
        weekday: "short",
        hour: "numeric"
      })
    : "Now";

  return (
    <div className="card hero">
      <h2>{data.city}</h2>

      <div className="hero-meta">
        Forecast for {timeLabel}
      </div>

      <div className="hero-temp">
        {Math.round(convert(temp))}°
        {unit.toUpperCase()}
      </div>

      {/* <div className="hero-desc">
        Weather code {weatherCode}
      </div> */}

      <div className="hero-meta">
        Feels {Math.round(convert(feelsLike))}° ·
        Humidity {humidity}% ·
        Wind {wind} km/h
      </div>
    </div>
  );
}
