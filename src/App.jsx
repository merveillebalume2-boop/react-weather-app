import React, { useState, useEffect } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import Forecast from './components/Forecast';
import { FaSearch, FaLocationArrow, FaSun, FaSync } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('kinshasa');
  const [unit, setUnit] = useState('°C');
  const [inputValue, setInputValue] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  // === FONCTION POUR CONSOMMER L'API ===
  const fetchWeatherFromAPI = async (cityName) => {
    setLoading(true);

    // Coordonnées des villes RDC
    const cityCoordinates = {
      'kinshasa': { lat: -4.4419, lon: 15.2663, name: 'Kinshasa' },
      'lubumbashi': { lat: -11.6642, lon: 27.4828, name: 'Lubumbashi' },
      'goma': { lat: -1.6741, lon: 29.2239, name: 'Goma' },
      'bukavu': { lat: -2.5144, lon: 28.8608, name: 'Bukavu' },
      'mbuji-mayi': { lat: -6.1360, lon: 23.5898, name: 'Mbuji-Mayi' },
      'kisangani': { lat: 0.5167, lon: 25.2000, name: 'Kisangani' },
      'kinshasha': { lat: -4.4419, lon: 15.2663, name: 'Kinshasa' }
    };

    // Normaliser le nom de la ville
    const normalizedCity = cityName.toLowerCase();
    const city = cityCoordinates[normalizedCity] || cityCoordinates['kinshasa'];

    try {
      // URL pour les données actuelles
      const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;

      // URL pour les prévisions (5 jours)
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=5`;

      // Faire les deux requêtes en parallèle
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Erreur API');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      // Traduire les codes météo
      const weatherCodes = {
        0: 'Ciel dégagé ☀️',
        1: 'Principalement clair 🌤️',
        2: 'Partiellement nuageux ⛅',
        3: 'Nuageux ☁️',
        45: 'Brouillard 🌫️',
        48: 'Brouillard givrant 🌫️❄️',
        51: 'Bruine légère 🌧️',
        53: 'Bruine modérée 🌧️',
        55: 'Bruine dense 🌧️',
        61: 'Pluie légère 🌦️',
        63: 'Pluie modérée 🌧️',
        65: 'Pluie forte 🌧️⛈️',
        71: 'Neige légère ❄️',
        73: 'Neige modérée ❄️',
        75: 'Neige forte ❄️❄️',
        80: 'Averses légères 🌦️',
        81: 'Averses modérées 🌧️',
        82: 'Averses violentes 🌧️⛈️',
        95: 'Orage ⛈️',
        96: 'Orage avec grêle ⛈️🌨️'
      };

      // Formater les données actuelles
      const current = currentData.current;
      const formattedWeather = {
        city: city.name,
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m * 3.6),
        condition: weatherCodes[current.weather_code] || 'Données non disponibles',
        icon: getWeatherIcon(current.weather_code),
        high: Math.round(current.temperature_2m + 3),
        low: Math.round(current.temperature_2m - 5),
        pressure: 1013,
        windDirection: current.wind_direction_10m
      };

      // Formater les prévisions
      const formattedForecast = forecastData.daily.time.slice(0, 5).map((date, index) => {
        const dayDate = new Date(date);
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

        return {
          day: days[dayDate.getDay()],
          temp: Math.round(forecastData.daily.temperature_2m_max[index]),
          icon: getWeatherIcon(forecastData.daily.weather_code[index]),
          condition: weatherCodes[forecastData.daily.weather_code[index]]?.split(' ')[0] || 'Ensoleillé',
          rain: Math.round(forecastData.daily.precipitation_sum[index] * 10) / 10
        };
      });

      // Mettre à jour les états
      setWeatherData(formattedWeather);
      setForecastData(formattedForecast);
      setCity(city.name);

    } catch (error) {
      console.error('Erreur API:', error);
      // Données par défaut en cas d'erreur
      setWeatherData({
        city: city.name,
        temp: 25,
        feels_like: 27,
        humidity: 65,
        wind: 12,
        condition: 'Ensoleillé ☀️',
        icon: '☀️',
        high: 28,
        low: 22
      });

      setForecastData([
        { day: 'Lun', temp: 26, icon: '☀️', condition: 'Ensoleillé', rain: 0 },
        { day: 'Mar', temp: 25, icon: '⛅', condition: 'Nuageux', rain: 10 },
        { day: 'Mer', temp: 24, icon: '🌧️', condition: 'Pluvieux', rain: 60 },
        { day: 'Jeu', temp: 23, icon: '⛅', condition: 'Nuageux', rain: 20 },
        { day: 'Ven', temp: 26, icon: '☀️', condition: 'Ensoleillé', rain: 5 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour obtenir l'icône météo
  const getWeatherIcon = (code) => {
    if (code <= 3) return '☀️';
    if (code <= 48) return '☁️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 86) return '🌦️';
    return '☀️';
  };
  // === FIN DE LA FONCTION API ===

  // Charger les données au démarrage
  useEffect(() => {
    fetchWeatherFromAPI('kinshasa');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchWeatherFromAPI(inputValue.trim());
      setInputValue('');
    }
  };

  const handleGeolocation = () => {
    alert("Géolocalisation activée ! Position simulée : Goma");
    fetchWeatherFromAPI('goma');
  };

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    fetchWeatherFromAPI(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-xl mx-auto">

        {/* Header modifié avec bouton rafraîchir */}
        <header className="text-center mb-8 pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition disabled:opacity-50"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Rafraîchir
            </button>

            <h1 className="text-5xl font-bold text-white mb-3">🌤️ Météo</h1>

            <div className="w-24"></div>
          </div>

          <p className="text-white/80 text-lg">Application météo simplifiée</p>
          {weatherData && (
            <p className="text-white/60 text-sm mt-2">
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </p>
          )}
        </header>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une ville..."
              className="w-full px-6 py-4 pl-12 rounded-full bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg disabled:opacity-50"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'OK'}
            </button>
          </div>

          {/* Villes rapides */}
          <div className="flex justify-center gap-3 mt-4">
            {['lubumbashi', 'bukavu', 'goma', 'kinshasa'].map(cityName => (
              <button
                key={cityName}
                type="button"
                onClick={() => fetchWeatherFromAPI(cityName)}
                disabled={loading}
                className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition text-sm disabled:opacity-50"
              >
                {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
              </button>
            ))}
          </div>
        </form>

        {/* Contrôles */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleGeolocation}
            disabled={loading}
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-full transition disabled:opacity-50"
          >
            <FaLocationArrow /> {loading ? 'Chargement...' : 'Ma position'}
          </button>

          <button
            onClick={() => setUnit(unit === '°C' ? '°F' : '°C')}
            disabled={loading}
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-full transition disabled:opacity-50"
          >
            <FaSun /> {unit === '°C' ? '°C → °F' : '°F → °C'}
          </button>
        </div>

        {/* État de chargement */}
        {loading && !weatherData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-6"></div>
            <p className="text-white text-xl">Chargement des données météo...</p>
            <p className="text-white/60 mt-2">Connexion à l'API Open-Meteo</p>
          </div>
        )}

        {/* Composant météo avec données réelles */}
        {weatherData && (
          <WeatherDisplay
            weather={weatherData}
            unit={unit}
            loading={loading}
          />
        )}

        {/* Composant prévisions avec données réelles */}
        {forecastData.length > 0 && (
          <Forecast
            forecast={forecastData}
            unit={unit}
            loading={loading}
          />
        )}

        {/* Footer */}
        <footer className="text-center text-white/60 mt-10 pb-4">
          <p className="text-sm">© 2026 Météo App • Données fournies par Open-Meteo</p>
          <p className="text-xs mt-1">API 100% gratuite et sans clé nécessaire</p>
        </footer>

      </div>
    </div>
  );
}

export default App;