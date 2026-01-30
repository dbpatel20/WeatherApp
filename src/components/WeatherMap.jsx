import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* 🌍 Auto-fit map to all cities */
function FitBounds({ cities }) {
  const map = useMap();

  useEffect(() => {
    if (!cities || cities.length === 0) return;

    const bounds = cities.map((c) => [c.lat, c.lon]);

    if (bounds.length === 1) {
      map.setView(bounds[0], 6);
    } else {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 6
      });
    }
  }, [cities, map]);

  return null;
}

/* 🌤️ Weather icon per city */
function weatherIcon(code, isActive) {
  let emoji = "📍";

  if (code === 0) emoji = "☀️";
  else if (code <= 2) emoji = "🌤️";
  else if (code === 3) emoji = "☁️";
  else if (code <= 67) emoji = "🌧️";
  else if (code <= 77) emoji = "❄️";
  else if (code >= 95) emoji = "⛈️";

  return L.divIcon({
    html: `<div style="
      font-size:${isActive ? "30px" : "22px"};
      filter:${isActive ? "drop-shadow(0 0 6px white)" : "none"};
    ">${emoji}</div>`,
    className: "weather-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
}

export default function WeatherMap({ cities, activeIndex }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="card">
      <MapContainer
        style={{ height: "350px", width: "100%" }}
        center={[cities[0].lat, cities[0].lon]}
        zoom={4}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔁 AUTO-FIT ALL CITIES */}
        <FitBounds cities={cities} />

        {/* 📍 CITY MARKERS */}
        {cities.map((c, i) => (
          <Marker
            key={i}
            position={[c.lat, c.lon]}
            icon={weatherIcon(
              c.current.weather_code,
              i === activeIndex
            )}
          >
            <Popup>
              <strong>{c.city}</strong>
              <br />
              {Math.round(c.current.temp)}°
              <br />
              {c.current.weather_code === 0
                ? "Clear"
                : ""}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
