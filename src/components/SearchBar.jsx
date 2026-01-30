import { useEffect, useState } from "react";

export default function SearchBar({ addCity }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) return;

    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=6`
    )
      .then((r) => r.json())
      .then((d) => setResults(d.results || []));
  }, [query]);

  async function selectCity(c) {
    const lat = c.latitude;
    const lon = c.longitude;
    const name = `${c.name}, ${c.country}`;

    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${lat}&longitude=${lon}` +
        "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&hourly=temperature_2m,precipitation_probability,weather_code,cloud_cover" +
        "&daily=temperature_2m_max,temperature_2m_min,weather_code" +
        "&timezone=auto"
    );
    const data = await res.json();

    addCity({
      city: name,
      lat,
      lon,
      current: {
        temp: data.current.temperature_2m,
        feels_like: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        weather_code: data.current.weather_code
      },
      hourly: data.hourly.time.map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        temp: data.hourly.temperature_2m[i],
        pop: data.hourly.precipitation_probability[i],
        weather_code: data.hourly.weather_code[i]
      })),
      daily: data.daily.time.map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        temp: {
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i]
        },
        weather_code: data.daily.weather_code[i]
      }))
    });

    setQuery("");
    setResults([]);
  }

  return (
    <div className="search-container">
      <input
        value={query}
        placeholder="Add city"
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="dropdown">
          {results.map((c, i) => (
            <li key={i} onClick={() => selectCity(c)}>
              {c.name}, {c.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
