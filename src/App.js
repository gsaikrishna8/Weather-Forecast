import React, { useState, useEffect } from "react";
import { TextField, Card, Button } from "@mui/material";
import skyImage from "./assets/skyimage.jpg";
import moment from "moment";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm A"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("hh:mm A"));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
    );

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      } else {
        setErrorMessage("Unexpected error occurred");
      }
      setError(true);
      return;
    }

    const data = await response.json(); // ✅ Safe now
    setWeatherData(data);
    setError(false);

  } catch (error) {
    console.error("Fetch error:", error);
    setErrorMessage("Network error or server is down.");
    setError(true);
  }
};


  const handleSubmit = () => {
    if (!city.trim()) return;
    fetchWeatherData(city);
    setOpen(true);
  };

  const handleClear = () => {
    setOpen(false);
    setCity("");
    setError(false);
    setErrorMessage("");
    setWeatherData(null);
  };

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  return (
    <div className="App">
      <Card
        className="card"
        style={{ backgroundImage: `url(${skyImage})` }}
      >
        <div className="cardHeader">
          <p className="title">Weather Forecast</p>
        </div>

        {!open ? (
          <div className="inputContainer">
            <TextField
              label="City Name"
              value={city}
              variant="outlined"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handleSubmit()
                }
              }
            }
            />
            <div style={{ marginTop: "10px" }}>
              <Button variant="contained" onClick={handleSubmit}>
                Get Weather
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {error && (
              <div style={{ textAlign: "center" }}>
                <p className="temp">{errorMessage}</p>
                <Button variant="contained" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            )}
        {weatherData?.main && (
  <div className="weather-card">
    <div className="weather-header">
      <p className="weather-city">📍 {weatherData.name}</p>
      <p className="weather-time">{currentTime}</p>
    </div>

    <div className="weather-meta">
      <p className="weather-day">{moment().format("dddd")}</p>
      <p className="weather-date">{moment().format("LL")}</p>
    </div>

    <div className="weather-info">
  <img
    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
    alt="weather icon"
    style={{ width: "60px", height: "60px", marginRight: "10px" }}
  />
  <div>
    <p className="weather-temp">
      🌡️ Temperature: {kelvinToCelsius(weatherData.main.temp)}°C
    </p>
    <p className="weather-humidity">
      💧 Humidity: {weatherData.main.humidity}%
    </p>
  </div>
</div>


    <div className="weather-footer">
      <Button variant="contained" onClick={handleClear}>
        Clear
      </Button>
    </div>
  </div>
)}

          </div>
        )}
      </Card>
    </div>
  );
}

export default App;
