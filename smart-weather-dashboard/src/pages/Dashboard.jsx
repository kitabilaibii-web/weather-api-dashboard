import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🔑 Get your own FREE API key from https://openweathermap.org/api
// Sign up -> API keys tab -> copy key -> paste it below
const API_KEY =  "71e2e84fc3686546fb3988b98e1bff29";

function Dashboard() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  const username = localStorage.getItem("username") || "Student";

  // Extra safety check (double protection along with ProtectedRoute)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) return;

    setIsLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found. Please check the spelling.");
      }

      const data = await response.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });

      // Bonus: update recent searches list (avoid duplicates, keep latest 5)
      const updatedSearches = [
        searchCity,
        ...recentSearches.filter(
          (c) => c.toLowerCase() !== searchCity.toLowerCase()
        ),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>👋 Welcome, {username}!</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-body">
        <div className="weather-section">
          <h3>🔍 Search Weather</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g. Lahore)"
            />
            <button type="submit">Search</button>
          </form>

          {isLoading && <p className="loading-text">Loading...</p>}
          {error && <p className="error-text">{error}</p>}

          {weather && !isLoading && (
            <div className="weather-card">
              <h3>
                {weather.city}, {weather.country}
              </h3>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.condition}
              />
              <p className="temp">{weather.temp}°C</p>
              <p className="condition">{weather.condition}</p>
              <p className="description">{weather.description}</p>
              <div className="extra-info">
                <span>💧 Humidity: {weather.humidity}%</span>
                <span>💨 Wind: {weather.wind} m/s</span>
              </div>
            </div>
          )}
        </div>

        {/* Bonus Feature: Recent Searches */}
        <aside className="recent-searches">
          <h3>🕒 Recent Searches</h3>
          {recentSearches.length === 0 ? (
            <p className="hint">No searches yet.</p>
          ) : (
            <ul>
              {recentSearches.map((c, index) => (
                <li key={index} onClick={() => fetchWeather(c)}>
                  {c}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
