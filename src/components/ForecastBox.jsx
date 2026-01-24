function icon(code) {
  if (code === 0) return "☀️";
  if ([1,2,3].includes(code)) return "🌤️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code === 95) return "⛈️";
  return "🌫️";
}

export default function ForecastBox({ day, code, max, min, unit, onClick }) {
  const maxT = unit === "C" ? max : (max * 9/5 + 32).toFixed(0);
  const minT = unit === "C" ? min : (min * 9/5 + 32).toFixed(0);

  return (
    <div className="box" onClick={onClick} style={{ cursor: "pointer" }}>
      <strong>
        {new Date(day).toLocaleDateString("en", { weekday: "short" })}
      </strong><br />
      <span className="icon">{icon(code)}</span><br />
      {maxT}° / {minT}°{unit}
    </div>
  );
}
