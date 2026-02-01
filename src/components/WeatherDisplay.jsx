import React from 'react';
import { FaThermometerHalf, FaTint, FaWind, FaArrowUp, FaArrowDown, FaCloud, FaEye } from 'react-icons/fa';

const WeatherDisplay = ({ city, unit }) => {
    // Données météo simulées
    const weatherData = {
        'kinshasa': {
            temp: 22,
            feels_like: 24,
            condition: '☀️ Ensoleillé',
            humidity: 65,
            wind: 12,
            high: 25,
            low: 18,
            pressure: 1013,
            visibility: 10
        },
        'lubumbashu': {
            temp: 20,
            feels_like: 22,
            condition: '⛅ Partiellement nuageux',
            humidity: 70,
            wind: 10,
            high: 23,
            low: 17,
            pressure: 1015,
            visibility: 8
        },
        'Goma': {
            temp: 26,
            feels_like: 28,
            condition: '☀️ Très ensoleillé',
            humidity: 55,
            wind: 15,
            high: 29,
            low: 22,
            pressure: 1010,
            visibility: 12
        },
        'Bukavu': {
            temp: 16,
            feels_like: 18,
            condition: '🌧️ Pluie légère',
            humidity: 85,
            wind: 18,
            high: 18,
            low: 14,
            pressure: 1005,
            visibility: 5
        }
    };

    // Conversion température
    const convertTemp = (temp) => {
        return unit === '°F' ? Math.round((temp * 9 / 5) + 32) : temp;
    };

    const data = weatherData[city] || weatherData['kinshasa'];

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-2xl border border-white/20">

            {/* En-tête */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">{city}</h2>
                <p className="text-white/80 text-lg">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                    })}
                </p>
            </div>

            {/* Température principale */}
            <div className="text-center mb-10">
                <div className="text-9xl font-bold text-white mb-4">
                    {convertTemp(data.temp)}°
                </div>
                <div className="text-3xl text-white mb-6 flex items-center justify-center gap-3">
                    <span className="text-5xl">{data.condition.split(' ')[0]}</span>
                    <span>{data.condition.split(' ').slice(1).join(' ')}</span>
                </div>
            </div>

            {/* Détails météo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Ressenti */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaThermometerHalf className="text-2xl text-red-300" />
                    </div>
                    <p className="text-sm text-white/70">Ressenti</p>
                    <p className="text-2xl font-bold text-white">{convertTemp(data.feels_like)}°</p>
                </div>

                {/* Humidité */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaTint className="text-2xl text-blue-300" />
                    </div>
                    <p className="text-sm text-white/70">Humidité</p>
                    <p className="text-2xl font-bold text-white">{data.humidity}%</p>
                </div>

                {/* Vent */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center mb-2">
                        <FaWind className="text-2xl text-gray-300" />
                    </div>
                    <p className="text-sm text-white/70">Vent</p>
                    <p className="text-2xl font-bold text-white">{data.wind} km/h</p>
                </div>

                {/* Min/Max */}
                <div className="bg-white/10 rounded-2xl p-4 text-center">
                    <div className="flex justify-center gap-2 mb-2">
                        <FaArrowUp className="text-xl text-red-300" />
                        <FaArrowDown className="text-xl text-blue-300" />
                    </div>
                    <p className="text-sm text-white/70">Min/Max</p>
                    <p className="text-2xl font-bold text-white">
                        {convertTemp(data.low)}°/{convertTemp(data.high)}°
                    </p>
                </div>

            </div>

            {/* Informations supplémentaires */}
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-between text-white bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                        <FaCloud className="text-white/70" />
                        <span className="text-sm">Pression</span>
                    </div>
                    <span className="font-bold">{data.pressure} hPa</span>
                </div>

                <div className="flex items-center justify-between text-white bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                        <FaEye className="text-white/70" />
                        <span className="text-sm">Visibilité</span>
                    </div>
                    <span className="font-bold">{data.visibility} km</span>
                </div>
            </div>

        </div>
    );
};

export default WeatherDisplay;