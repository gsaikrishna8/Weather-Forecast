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
  });
  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
      );
      console.log("response", response);
      if (response.status === 404) {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setError(true);
        setWeatherData(null);
      }
      const responseData = await response.json();
      console.log("responseData", responseData);
      setWeatherData(responseData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
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
  console.log("weatherDta", weatherData);
  console.log("errorMessage", errorMessage);
  return (
    <div className="App">
      <Card className="card" style={{ backgroundImage: `url(${skyImage})` }}>
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
            {weatherData && (
              <div style={{ padding: "20px" }}>
                <div className="container">
                  <p className="label">City:{city}</p>
                  <p className="label"> {currentTime}</p>
                </div>
                <div className="container">
                  <p className="label">Day:{moment().format("dddd")}</p>
                  <p className="temp" style={{ marginTop: "30px" }}>
                    {moment().format("LL")}
                  </p>
                </div>
                <div className="container">
                  <p className="temp">Temparature:{weatherData.main.temp}</p>
                  <p className="temp">Humidity:{weatherData.main.humidity}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    margin: "10px",
                  }}
                >
                  <Button variant="outlined" onClick={handleClear}>
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