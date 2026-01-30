export default function ExtraDetails({ current }) {
  return (
    <div className="card">
      <strong>Details</strong>
      <p>Humidity: {current.humidity}%</p>
      <p>Wind: {current.wind} km/h</p>
    </div>
  );
}
