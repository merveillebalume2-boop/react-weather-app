import React, { useState } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import Forecast from './components/Forecast';
import { FaSearch, FaLocationArrow, FaSun } from 'react-icons/fa';

function App() {
  const [city, setCity] = useState('kinshasa');
  const [unit, setUnit] = useState('°C');
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue.trim());
      setInputValue('');
    }
  };

  const handleGeolocation = () => {
    alert("Géolocalisation activée ! Position simulée : Goma");
    setCity('Goma');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <header className="text-center mb-8 pt-4">
          <h1 className="text-5xl font-bold text-white mb-3">🌤️ Météo</h1>
          <p className="text-white/80 text-lg">Application météo simplifiée</p>
        </header>

        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une ville..."
              className="w-full px-6 py-4 pl-12 rounded-full bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full hover:opacity-90 transition"
            >
              OK
            </button>
          </div>

          {/* Villes rapides */}
          <div className="flex justify-center gap-3 mt-4">
            {['lubumbashi', 'bukavu', 'Goma', 'kinshasha'].map(cityName => (
              <button
                key={cityName}
                type="button"
                onClick={() => setCity(cityName)}
                className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition text-sm"
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
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-full transition"
          >
            <FaLocationArrow /> Ma position
          </button>

          <button
            onClick={() => setUnit(unit === '°C' ? '°F' : '°C')}
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-full transition"
          >
            <FaSun /> {unit === '°C' ? '°C → °F' : '°F → °C'}
          </button>
        </div>

        {/* Composant météo */}
        <WeatherDisplay city={city} unit={unit} />

        {/* Composant prévisions */}
        <Forecast unit={unit} />

        {/* Footer */}
        <footer className="text-center text-white/60 mt-10 pb-4">
          <p className="text-sm">© 2026 Météo App • Données démonstration</p>
        </footer>

      </div>
    </div>
  );
}

export default App;