import React from 'react';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake } from 'react-icons/fa';

const Forecast = ({ Forecast, unit , loading }) => {
    // Données de prévisions
    const forecastData = [
        {
            day: 'Lundi',
            date: '15',
            temp: 24,
            condition: 'sunny',
            icon: <FaSun className="text-3xl text-yellow-400" />,
            rain: 10
        },
        {
            day: 'Mardi',
            date: '16',
            temp: 26,
            condition: 'cloudy',
            icon: <FaCloud className="text-3xl text-gray-300" />,
            rain: 30
        },
        {
            day: 'Mercredi',
            date: '17',
            temp: 21,
            condition: 'rainy',
            icon: <FaCloudRain className="text-3xl text-blue-400" />,
            rain: 80
        },
        {
            day: 'Jeudi',
            date: '18',
            temp: 23,
            condition: 'cloudy',
            icon: <FaCloud className="text-3xl text-gray-300" />,
            rain: 40
        },
        {
            day: 'Vendredi',
            date: '19',
            temp: 25,
            condition: 'sunny',
            icon: <FaSun className="text-3xl text-yellow-400" />,
            rain: 5
        },
    ];

    // Conversion température
    const convertTemp = (temp) => {
        return unit === '°F' ? Math.round((temp * 9 / 5) + 32) : temp;
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Prévisions 5 jours</h3>

            <div className="space-y-4">
                {forecastData.map((day, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-2xl p-4 transition cursor-pointer group"
                    >
                        {/* Jour et date */}
                        <div className="w-32">
                            <p className="font-bold text-white text-lg">{day.day}</p>
                            <p className="text-white/60 text-sm">{day.date} Nov</p>
                        </div>

                        {/* Icône */}
                        <div className="w-16 text-center">
                            {day.icon}
                        </div>

                        {/* Température */}
                        <div className="w-20 text-center">
                            <p className="text-2xl font-bold text-white">
                                {convertTemp(day.temp)}°
                            </p>
                        </div>

                        {/* Probabilité de pluie */}
                        <div className="w-32">
                            <div className="flex justify-between text-sm text-white/70 mb-1">
                                <span>Pluie</span>
                                <span>{day.rain}%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400 rounded-full transition-all duration-300"
                                    style={{ width: `${day.rain}%` }}
                                />
                            </div>
                        </div>

                        {/* Condition texte */}
                        <div className="w-32 text-right">
                            <p className="text-white font-medium">
                                {day.condition === 'sunny' ? 'Ensoleillé' :
                                    day.condition === 'cloudy' ? 'Nuageux' : 'Pluvieux'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Légende */}
            <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-white/20 text-sm text-white/60">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>Ensoleillé</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span>Nuageux</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Pluvieux</span>
                </div>
            </div>
        </div>
    );
};

export default Forecast;