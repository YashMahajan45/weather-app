import React, { useState } from 'react';
import { DateTime } from "luxon";

import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const getWeather = async () => {
    if (!city) return;

    try {
      const response = await fetch(`http://localhost:8080/weather?city=${city}`);
      if (!response.ok) {
        setError('City not found or error occurred.');
        setWeather(null);
        return;
      }
      const data = await response.json();
      setWeather(data);
      setError('');
    } catch (err) {
      setError('Something went wrong.');
      setWeather(null);
    }
  };

  return (
    <div className="App">
      <h1>🌤️ Indian City Weather</h1>
      <input
        type="text"
        placeholder="Enter city name like Delhi"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <img
  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
  alt="Weather Icon"
/>

          <p>Temperature: {weather.main.temp} °C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>
  Local Time:{" "}
  {DateTime.utc()
    .plus({ seconds: weather.timezone })
    .setLocale("en-IN")
    .toFormat("hh:mm a")}
</p>

{/* Google Map */}
          <div style={{ marginTop: "1rem" }}>
            <iframe
              title="Google Map"
              width="100%"
              height="300"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Forecast Display */}
      {forecast.length > 0 && (
        <div>
          <h3 style={{ marginTop: "2rem" }}>🔁 5-Day Forecast:</h3>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {forecast.map((day, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  width: "120px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>
                  {new Date(day.dt * 1000).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </strong>
                <br />
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                  style={{ width: "50px" }}
                />
                <div>{Math.round(day.main.temp)}°C</div>
                <small>{day.weather[0].main}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;