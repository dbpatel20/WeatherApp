export default function UnitToggle({ unit, setUnit }) {
  return (
    <div className="unit-toggle">
      <button
        className={unit === "c" ? "active" : ""}
        onClick={() => setUnit("c")}
      >
        °C
      </button>
      <button
        className={unit === "f" ? "active" : ""}
        onClick={() => setUnit("f")}
      >
        °F
      </button>
    </div>
  );
}
