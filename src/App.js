import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Current weather
      const response = await fetch("https://weather-backend-r5qk.onrender.com/api/weather?city=" + city);
      const data = await response.json();
      setWeather(data);

      // Forecast
      const forecastResponse = await fetch("https://weather-backend-r5qk.onrender.com/api/weather?city=" + city);
      const forecastData = await forecastResponse.json();

      const daily = forecastData.list.filter((_, i) => i % 8 === 0); // 1/day
      setForecast(daily);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
      setForecast([]);
    }
  };

  const formatTime = (timezoneOffsetInSeconds) => {
    const now = new Date();
    const localTime = new Date(now.getTime() + timezoneOffsetInSeconds * 1000);
    return localTime.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  return (
    <div className="App" style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🌦️ Simple Weather App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter city in India"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <button type="submit">Check Weather</button>
      </form>

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p><strong>🌡️ Temp:</strong> {weather.main.temp}°C</p>
          <p><strong>💧 Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>🌬️ Wind:</strong> {weather.wind.speed} m/s</p>
          <p><strong>🕒 Local Time:</strong> {formatTime(weather.timezone)}</p>
          <p><strong>🌤️ Condition:</strong> {weather.weather[0].description}</p>

          <iframe
            title="map"
            src={`https://maps.google.com/maps?q=${weather.coord.lat},${weather.coord.lon}&z=10&output=embed`}
            width="80%"
            height="300"
            style={{ border: 0, marginTop: "10px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>📅 5-Day Forecast</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {forecast.map((item, index) => (
              <div key={index} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "10px", width: "150px" }}>
                <p><strong>{new Date(item.dt * 1000).toLocaleDateString()}</strong></p>
                <p>{item.weather[0].main}</p>
                <p>🌡️ {item.main.temp}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
