
// En haut de ton App.jsx, ajoute :
console.log('🌤️ Weather App v2.0 - International API');
console.log('Deploy date:', new Date().toISOString());

// Et dans le render, ajoute un badge
<div className="fixed top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
  v2.0 • {(new Date()).toLocaleDateString('fr-FR')}
</div>


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

  // === FONCTION POUR CONSOMMER L'API INTERNATIONALE (SANS CLÉ) ===
  const fetchWeatherFromAPI = async (cityName) => {
    setLoading(true);

    try {
      // ÉTAPE 1: Trouver les coordonnées de la ville (géocodage)
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`;
      const geoResponse = await fetch(geocodeUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Ville "${cityName}" non trouvée`);
      }

      const { latitude, longitude, name, country, admin1 } = geoData.results[0];
      const locationName = `${name}${admin1 ? ', ' + admin1 : ''}, ${country}`;

      // ÉTAPE 2: Récupérer la météo actuelle
      const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&timezone=auto`;

      // ÉTAPE 3: Récupérer les prévisions (5 jours)
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=5`;

      // Faire les deux requêtes en parallèle
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Erreur API météo');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      // Dictionnaire des conditions météo
      const weatherCodes = {
        0: { fr: 'Ciel dégagé ☀️', icon: '☀️' },
        1: { fr: 'Principalement clair 🌤️', icon: '🌤️' },
        2: { fr: 'Partiellement nuageux ⛅', icon: '⛅' },
        3: { fr: 'Nuageux ☁️', icon: '☁️' },
        45: { fr: 'Brouillard 🌫️', icon: '🌫️' },
        48: { fr: 'Brouillard givrant 🌫️❄️', icon: '🌫️' },
        51: { fr: 'Bruine légère 🌧️', icon: '🌦️' },
        53: { fr: 'Bruine modérée 🌧️', icon: '🌧️' },
        55: { fr: 'Bruine dense 🌧️', icon: '🌧️' },
        56: { fr: 'Bruine verglaçante 🌧️❄️', icon: '🌧️' },
        57: { fr: 'Bruine verglaçante dense 🌧️❄️', icon: '🌧️' },
        61: { fr: 'Pluie légère 🌦️', icon: '🌦️' },
        63: { fr: 'Pluie modérée 🌧️', icon: '🌧️' },
        65: { fr: 'Pluie forte 🌧️⛈️', icon: '⛈️' },
        66: { fr: 'Pluie verglaçante 🌧️❄️', icon: '🌧️' },
        67: { fr: 'Pluie verglaçante forte 🌧️❄️', icon: '🌧️' },
        71: { fr: 'Neige légère ❄️', icon: '❄️' },
        73: { fr: 'Neige modérée ❄️', icon: '❄️❄️' },
        75: { fr: 'Neige forte ❄️', icon: '❄️❄️❄️' },
        77: { fr: 'Grains de neige ❄️', icon: '❄️' },
        80: { fr: 'Averses légères 🌦️', icon: '🌦️' },
        81: { fr: 'Averses modérées 🌧️', icon: '🌧️' },
        82: { fr: 'Averses violentes 🌧️⛈️', icon: '⛈️' },
        85: { fr: 'Averses de neige légères ❄️', icon: '❄️' },
        86: { fr: 'Averses de neige fortes ❄️', icon: '❄️❄️' },
        95: { fr: 'Orage ⛈️', icon: '⛈️' },
        96: { fr: 'Orage avec grêle légère ⛈️🌨️', icon: '⛈️' },
        99: { fr: 'Orage avec grêle forte ⛈️🌨️', icon: '⛈️' }
      };

      // Formater les données actuelles
      const current = currentData.current;
      const weatherInfo = weatherCodes[current.weather_code] || { fr: 'Données non disponibles', icon: '☀️' };

      const formattedWeather = {
        city: locationName,
        country: country,
        temp: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m * 3.6), // Convertir en km/h
        condition: weatherInfo.fr,
        icon: weatherInfo.icon,
        high: Math.round(forecastData.daily.temperature_2m_max[0]),
        low: Math.round(forecastData.daily.temperature_2m_min[0]),
        pressure: Math.round(current.pressure_msl),
        windDirection: getWindDirection(current.wind_direction_10m),
        latitude: latitude,
        longitude: longitude
      };

      // Formater les prévisions sur 5 jours
      const formattedForecast = forecastData.daily.time.slice(0, 5).map((date, index) => {
        const dayDate = new Date(date);
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const weatherInfo = weatherCodes[forecastData.daily.weather_code[index]] || { fr: 'Ensoleillé', icon: '☀️' };

        return {
          day: days[dayDate.getDay()],
          date: date,
          temp: Math.round(forecastData.daily.temperature_2m_max[index]),
          icon: weatherInfo.icon,
          condition: weatherInfo.fr.split(' ')[0],
          rain: forecastData.daily.precipitation_sum[index],
          rainProbability: forecastData.daily.precipitation_probability_max[index],
          temp_min: Math.round(forecastData.daily.temperature_2m_min[index])
        };
      });

      // Mettre à jour les états
      setWeatherData(formattedWeather);
      setForecastData(formattedForecast);
      setCity(locationName);

    } catch (error) {
      console.error('Erreur API:', error);

      // Données simulées pour démo en cas d'erreur
      const demoCities = {
        'paris': { temp: 15, condition: 'Nuageux ☁️', icon: '☁️' },
        'london': { temp: 12, condition: 'Pluie légère 🌦️', icon: '🌦️' },
        'new york': { temp: 20, condition: 'Ensoleillé ☀️', icon: '☀️' },
        'tokyo': { temp: 18, condition: 'Partiellement nuageux ⛅', icon: '⛅' },
        'kinshasa': { temp: 28, condition: 'Ciel dégagé ☀️', icon: '☀️' },
        'dubai': { temp: 35, condition: 'Ciel dégagé ☀️', icon: '☀️' },
        'sydney': { temp: 22, condition: 'Ensoleillé ☀️', icon: '☀️' }
      };

      const cityKey = cityName.toLowerCase();
      const demoData = demoCities[cityKey] || demoCities['paris'];

      setWeatherData({
        city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        country: 'Demo',
        temp: demoData.temp,
        feels_like: demoData.temp + 2,
        humidity: 65,
        wind: 15,
        condition: demoData.condition,
        icon: demoData.icon,
        high: demoData.temp + 5,
        low: demoData.temp - 5,
        pressure: 1013,
        windDirection: 'NE'
      });

      setForecastData([
        { day: 'Lun', temp: demoData.temp, icon: demoData.icon, condition: demoData.condition.split(' ')[0], rain: 0 },
        { day: 'Mar', temp: demoData.temp - 1, icon: '⛅', condition: 'Nuageux', rain: 10 },
        { day: 'Mer', temp: demoData.temp - 2, icon: '🌧️', condition: 'Pluvieux', rain: 60 },
        { day: 'Jeu', temp: demoData.temp, icon: '⛅', condition: 'Nuageux', rain: 20 },
        { day: 'Ven', temp: demoData.temp + 2, icon: '☀️', condition: 'Ensoleillé', rain: 5 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir la direction du vent
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((degrees % 360) / 45) % 8;
    return directions[index];
  };

  // Fonction utilitaire pour obtenir l'icône météo
  const getWeatherIcon = (code) => {
    if (code <= 3) return '☀️';
    if (code <= 48) return '☁️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 86) return '🌦️';
    if (code <= 99) return '⛈️';
    return '☀️';
  };

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Utiliser les coordonnées pour trouver la ville la plus proche
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          alert("Géolocalisation non disponible. Utilisation de Paris par défaut.");
          fetchWeatherFromAPI('paris');
        }
      );
    } else {
      alert("Géolocalisation non supportée par votre navigateur.");
      fetchWeatherFromAPI('paris');
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      // Trouver la ville à partir des coordonnées
      const reverseGeocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=fr`;
      const response = await fetch(reverseGeocodeUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const cityName = data.results[0].name;
        fetchWeatherFromAPI(cityName);
      } else {
        fetchWeatherFromAPI('paris');
      }
    } catch (error) {
      console.error('Erreur reverse geocoding:', error);
      fetchWeatherFromAPI('paris');
    }
  };

  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    if (weatherData && weatherData.city) {
      // Extraire le nom principal de la ville (avant la première virgule)
      const cityName = weatherData.city.split(',')[0].trim();
      fetchWeatherFromAPI(cityName);
    } else {
      fetchWeatherFromAPI('paris');
    }
  };

  // Fonction pour convertir les températures
  const convertTemp = (tempCelsius) => {
    if (unit === '°F') {
      return Math.round((tempCelsius * 9 / 5) + 32);
    }
    return tempCelsius;
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

            <h1 className="text-5xl font-bold text-white mb-3">🌤️ Météo Monde</h1>

            <div className="w-24"></div>
          </div>

          <p className="text-white/80 text-lg">Application météo internationale</p>
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
              placeholder="Rechercher une ville (ex: Paris, Tokyo, New York)..."
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

          {/* Villes rapides INTERNATIONALES */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              'Paris', 'London', 'New York', 'Tokyo',
              'Dubai', 'Sydney', 'Moscow', 'Berlin',
              'Madrid', 'Rome', 'Beijing', 'Mumbai',
              'Cairo', 'Johannesburg', 'Rio de Janeiro', 'Mexico'
            ].map(cityName => (
              <button
                key={cityName}
                type="button"
                onClick={() => fetchWeatherFromAPI(cityName)}
                disabled={loading}
                className="px-3 py-1.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition text-xs sm:text-sm disabled:opacity-50 whitespace-nowrap"
              >
                {cityName}
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
            <p className="text-white/40 text-sm mt-2">Ville: {inputValue || city}</p>
          </div>
        )}

        {/* Message d'erreur */}
        {!loading && !weatherData && (
          <div className="bg-red-500/20 backdrop-blur-lg rounded-3xl p-8 text-center mb-6">
            <p className="text-white text-xl">❌ Erreur de chargement</p>
            <p className="text-white/80 mt-2">Vérifiez votre connexion internet</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Composant météo avec données réelles */}
        {weatherData && (
          <WeatherDisplay
            weather={weatherData}
            unit={unit}
            loading={loading}
            convertTemp={convertTemp}
          />
        )}

        {/* Composant prévisions avec données réelles */}
        {forecastData.length > 0 && (
          <Forecast
            forecast={forecastData}
            unit={unit}
            loading={loading}
            convertTemp={convertTemp}
          />
        )}

        {/* Informations API */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8">
          <h3 className="text-white text-lg font-semibold mb-2">ℹ️ Informations</h3>
          <p className="text-white/80 text-sm">
            Données météo en temps réel fournies par <strong>Open-Meteo API</strong>
          </p>
          <p className="text-white/60 text-xs mt-2">
            • Couverture mondiale • Mise à jour toutes les heures • Sans clé API nécessaire
          </p>
          <p className="text-white/40 text-xs mt-1">
            Géolocalisation: {navigator.geolocation ? 'Disponible' : 'Non disponible'}
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/60 mt-6 pb-4">
          <p className="text-sm">© 2024 Météo App • Données fournies par Open-Meteo</p>
          <p className="text-xs mt-1">API 100% gratuite • Toutes les villes du monde</p>
        </footer>

      </div>
    </div>
  );
}

export default App;   
 