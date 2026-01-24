import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/* =========================
   ICON CACHE (SAFE)
========================= */
const ICONS = {
  clear: icon("☀️"),
  cloudy: icon("🌤️"),
  rain: icon("🌧️"),
  snow: icon("❄️"),
  storm: icon("⛈️"),
  fog: icon("🌫️"),
};

function icon(emoji) {
  return L.divIcon({
    className: "weather-marker",
    html: `<div style="font-size:26px">${emoji}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function iconForCode(code) {
  if (code === 0) return ICONS.clear;
  if ([1, 2, 3].includes(code)) return ICONS.cloudy;
  if (code >= 61 && code <= 67) return ICONS.rain;
  if (code >= 71 && code <= 77) return ICONS.snow;
  if (code === 95) return ICONS.storm;
  return ICONS.fog;
}

function labelForCode(code) {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code === 95) return "Thunderstorm";
  return "Fog / Cloudy";
}

export default function WeatherMap({ cities }) {
  if (!cities.length) return null;

  const [hourOffset, setHourOffset] = useState(0);
  const MAX_HOURS = 24; // change to 48 if you want

  const [centerLat, centerLon] = cities[0].id.split(",").map(Number);

  return (
    <div style={{ marginTop: "20px" }}>
      {/* TIME SLIDER */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          ⏱️ Forecast hour: <strong>{hourOffset}h</strong>
        </label>
        <input
          type="range"
          min="0"
          max={MAX_HOURS}
          value={hourOffset}
          onChange={(e) => setHourOffset(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {/* MAP */}
      <div style={{ height: "400px" }}>
        <MapContainer
          center={[centerLat, centerLon]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {cities.map((city) => {
            const [lat, lon] = city.id.split(",").map(Number);

            const hourly = city.data.hourly;

            const code =
              hourly?.weathercode?.[hourOffset] ??
              city.data.current_weather.weathercode;

            const temp =
              hourly?.temperature_2m?.[hourOffset] ??
              city.data.current_weather.temperature;

            const time =
              hourly?.time?.[hourOffset];

            return (
              <Marker
                key={city.id}
                position={[lat, lon]}
                icon={iconForCode(code)}
              >
                <Popup>
                  <strong>
                    {city.name}
                    {city.admin1 ? `, ${city.admin1}` : ""}
                  </strong>
                  <br />
                  🌡️ {Math.round(temp)}°
                  <br />
                  🌦️ {labelForCode(code)}
                  <br />
                  🕒{" "}
                  {time
                    ? new Date(time).toLocaleString()
                    : "Now"}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
