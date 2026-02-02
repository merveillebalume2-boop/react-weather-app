import React from 'react';
import { FaThermometerHalf, FaTint, FaWind, FaArrowUp, FaArrowDown, FaCloud, FaEye, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const WeatherDisplay = ({ weather, unit, loading }) => {
    // Fonction de conversion température
    const convertTemp = (temp) => {
        return unit === '°F' ? Math.round((temp * 9 / 5) + 32) : temp;
    };

    // Formatage de la date
    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!weather) return null;

    return (
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-2xl border border-white/20 transition-opacity ${loading ? 'opacity-70' : 'opacity-100'}`}>

            {/* En-tête avec ville et date */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <FaMapMarkerAlt className="text-white/70 text-xl" />
                    <h2 className="text-4xl font-bold text-white">{weather.city}</h2>
                    <span className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {weather.country}
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-white/80 text-lg">
                    <FaClock />
                    <span>{formatDate()}</span>
                </div>
            </div>

            {/* Conditions principales */}
            <div className="text-center mb-10">
                <div className="text-9xl font-bold text-white mb-4">
                    {convertTemp(weather.temp)}°
                </div>

                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="text-5xl">
                        {weather.condition}
                    </div>
                    <p className="text-xl text-white/80">
                        Ressenti: {convertTemp(weather.feels_like)}°
                    </p>
                </div>
            </div>

            {/* Détails météo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Humidité */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaTint className="text-2xl text-blue-300" />
                    </div>
                    <p className="text-sm text-white/70">Humidité</p>
                    <p className="text-2xl font-bold text-white">{weather.humidity}%</p>
                </div>

                {/* Vent */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaWind className="text-2xl text-gray-300" />
                    </div>
                    <p className="text-sm text-white/70">Vent</p>
                    <p className="text-2xl font-bold text-white">{weather.wind} km/h</p>
                </div>

                {/* Pression */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaCloud className="text-2xl text-white/70" />
                    </div>
                    <p className="text-sm text-white/70">Pression</p>
                    <p className="text-2xl font-bold text-white">{weather.pressure} hPa</p>
                </div>

                {/* Min/Max */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center gap-2 mb-2">
                        <FaArrowUp className="text-xl text-red-300" />
                        <FaArrowDown className="text-xl text-blue-300" />
                    </div>
                    <p className="text-sm text-white/70">Min/Max</p>
                    <p className="text-2xl font-bold text-white">
                        {convertTemp(weather.low)}°/{convertTemp(weather.high)}°
                    </p>
                </div>

            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-between text-white bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                        <FaThermometerHalf className="text-white/70" />
                        <span className="text-sm">Code météo</span>
                    </div>
                    <span className="font-bold">{weather.weatherCode}</span>
                </div>

                <div className="flex items-center justify-between text-white bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                        <FaEye className="text-white/70" />
                        <span className="text-sm">Direction vent</span>
                    </div>
                    <span className="font-bold">{weather.windDirection}°</span>
                </div>
            </div>

        </div>
    );
};

export default WeatherDisplay;