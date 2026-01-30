function convert(temp, unit) {
  return unit === "f" ? temp * 9 / 5 + 32 : temp;
}

export default function ForecastBox({ day, unit, isOpen, onClick }) {
  return (
    <div
      className={`daily-row clickable ${isOpen ? "open" : ""}`}
      onClick={onClick}
    >
      <span>
        {new Date(day.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short"
        })}
      </span>

      <span>{Math.round(convert(day.temp.max, unit))}°</span>
      <span className="low">
        {Math.round(convert(day.temp.min, unit))}°
      </span>

      <span className="arrow">{isOpen ? "▲" : "▼"}</span>
    </div>
  );
}
