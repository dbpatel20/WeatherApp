import { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import WeatherMap from "./components/WeatherMap";

const STORAGE = "cities";

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState([]);
  const [unit, setUnit] = useState("C");

  /* =========================
     LOAD SAVED CITIES
  ========================== */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    saved.forEach((c) => fetchCityByQuery(c.query, false));
  }, []);

  /* =========================
     AUTOCOMPLETE SEARCH
  ========================== */
  async function fetchSuggestions(value) {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        value
      )}&count=5`
    );

    const data = await res.json();
    setSuggestions(data.results || []);
  }

  /* =========================
     MANUAL ADD (RE-GEOCODE)
  ========================== */
  async function fetchCityByQuery(searchText, save = true) {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchText
      )}&count=1`
    ).then((r) => r.json());

    if (!geo.results) return;

    await fetchCityFromSuggestion(geo.results[0], save);
  }

  /* =========================
     AUTOCOMPLETE ADD
  ========================== */
  async function fetchCityFromSuggestion(suggestion, save = true) {
    const { latitude, longitude, name, admin1, country } = suggestion;

    const id = `${latitude},${longitude}`;

    const data = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current_weather=true` +
        `&hourly=temperature_2m,weathercode` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto`
    ).then((r) => r.json());

    const cityObj = {
      id,
      query: `${name}${admin1 ? ", " + admin1 : ""}, ${country}`,
      name,
      admin1,
      country,
      data,
    };

    setCities((prev) => {
      if (prev.some((c) => c.id === id)) return prev;
      return [...prev, cityObj];
    });

    if (save) saveCity(cityObj);
  }

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================== */
  function saveCity(city) {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    if (!saved.some((c) => c.id === city.id)) {
      localStorage.setItem(
        STORAGE,
        JSON.stringify([...saved, { id: city.id, query: city.query }])
      );
    }
  }

  /* =========================
     REMOVE CITY
  ========================== */
  function removeCity(id) {
    setCities((prev) => prev.filter((c) => c.id !== id));

    const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    localStorage.setItem(
      STORAGE,
      JSON.stringify(saved.filter((c) => c.id !== id))
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="container">
      <h2>🌍 Darshil's Weather App</h2>

      {/* UNIT TOGGLE */}
      <button
        onClick={() => setUnit(unit === "C" ? "F" : "C")}
        style={{ marginBottom: "10px" }}
      >
        Toggle °C / °F
      </button>

      {/* SEARCH */}
      <div className="search-container">
        <input
          value={query}
          placeholder="City, State, Country"
          onChange={(e) => {
            setQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />

        <button
          onClick={() => {
            fetchCityByQuery(query);
            setQuery("");
            setSuggestions([]);
          }}
        >
          Add City
        </button>

        {suggestions.length > 0 && (
          <ul className="dropdown">
            {suggestions.map((s, i) => {
              const label = `${s.name}${
                s.admin1 ? ", " + s.admin1 : ""
              }, ${s.country}`;

              return (
                <li
                  key={i}
                  onClick={() => {
                    fetchCityFromSuggestion(s);
                    setQuery("");
                    setSuggestions([]);
                  }}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* MAP */}
      <WeatherMap cities={cities} unit={unit} />

      {/* WEATHER CARDS */}
      {cities.map((c) => (
        <WeatherCard
          key={c.id}
          city={c}
          unit={unit}
          onRemove={() => removeCity(c.id)}
        />
      ))}
    </div>
  );
}
