import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import HeroWeather from "./components/HeroWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import ExtraDetails from "./components/ExtraDetails";
import Alerts from "./components/Alerts";
import WeatherMap from "./components/WeatherMap";
import UnitToggle from "./components/UnitToggle";

export default function App() {
  const [cities, setCities] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [unit, setUnit] = useState("c");
  const [alerts, setAlerts] = useState([]);
  const [selectedForecast, setSelectedForecast] = useState(null);

  const activeCity = cities[activeIndex];

  /* ================= LOAD USER LOCATION ================= */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const data = await fetchWeather(lat, lon);
      setCities([formatWeather("Your Location", lat, lon, data)]);
    });
  }, []);

  /* ================= RESET PREVIEW WHEN CITY CHANGES ================= */

  useEffect(() => {
    setSelectedForecast(null);
  }, [activeIndex]);

  /* ================= BACKGROUND CONTROL ================= */
  /* ❗ ONLY TODAY CAN CHANGE BACKGROUND */

  useEffect(() => {
    if (!activeCity) return;

    const now = new Date();
    const todayKey = now.toDateString();

    // Default = current weather
    let weatherCode = activeCity.current.weather_code;
    let time = Math.floor(Date.now() / 1000);

    if (selectedForecast) {
      const selectedDate = new Date(selectedForecast.time * 1000);

      // ✅ ONLY ALLOW TODAY
      if (selectedDate.toDateString() === todayKey) {
        weatherCode = selectedForecast.weather_code;
        time = selectedForecast.time;
      }
    }

    const hour = new Date(time * 1000).getHours();
    const isNight = hour < 6 || hour >= 19;
    const bg = backgroundFromWeather(weatherCode);

    document.body.className = `${bg} ${isNight ? "night" : ""}`;
  }, [activeCity, selectedForecast]);

  return (
    <div className="container">
      <SearchBar addCity={(c) => setCities((p) => [...p, c])} />

      {activeCity && (
        <>
          <UnitToggle unit={unit} setUnit={setUnit} />
          <Alerts alerts={alerts} />

          {/* CITY TABS */}
          <div className="city-tabs">
            {cities.map((c, i) => (
              <button
                key={i}
                className={i === activeIndex ? "active" : ""}
                onClick={() => setActiveIndex(i)}
              >
                {c.city}
              </button>
            ))}
          </div>

          {/* HERO = CURRENT / TODAY ONLY */}
          <HeroWeather
            data={activeCity}
            unit={unit}
            selectedForecast={
              selectedForecast &&
              new Date(selectedForecast.time * 1000).toDateString() ===
                new Date().toDateString()
                ? selectedForecast
                : null
            }
          />

          {/* TODAY HOURLY = INTERACTIVE */}
          <HourlyForecast
            hourly={activeCity.hourly}
            unit={unit}
            onSelectForecast={setSelectedForecast}
          />

          {/* FUTURE DAYS = DISPLAY ONLY */}
          <DailyForecast
            daily={activeCity.daily}
            hourly={activeCity.hourly}
            unit={unit}
            onSelectForecast={() => {}} // ❌ no interaction
          />

          <ExtraDetails current={activeCity.current} />

          <WeatherMap
            cities={cities}
            activeIndex={activeIndex}
          />
        </>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */
async function fetchWeather(lat, lon) {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${lat}&longitude=${lon}` +

      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m" +

      "&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code" +

      "&daily=temperature_2m_max,temperature_2m_min,weather_code" +

      "&timezone=auto"
  );

  return res.json();
}


function formatWeather(city, lat, lon, data) {
  return {
    city,
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
      feels_like: data.hourly.apparent_temperature[i],
      humidity: data.hourly.relative_humidity_2m[i],
      wind: data.hourly.wind_speed_10m[i],
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
  };
}

function backgroundFromWeather(code) {
  if (code >= 95) return "bg-storm";
  if (code >= 71) return "bg-snow";
  if (code >= 51) return "bg-rain";
  if (code === 3) return "bg-cloudy";
  if (code <= 2) return "bg-clear";
  return "bg-default";
}
