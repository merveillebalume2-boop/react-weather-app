import React from 'react';

const Forecast = ({ forecast, unit, loading }) => {
    // Conversion température
    const convertTemp = (temp) => {
        return unit === '°F' ? Math.round((temp * 9 / 5) + 32) : temp;
    };

    return (
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 ${loading ? 'opacity-70' : ''}`}>
            <h3 className="text-2xl font-bold text-white mb-6">Prévisions 5 jours</h3>

            {forecast && forecast.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                    {forecast.map((day, index) => (
                        <div key={index} className="text-center text-white">
                            <p className="font-bold text-sm mb-1">{day.day}</p>
                            <p className="text-2xl my-2">{day.icon}</p>
                            <p className="font-bold text-lg">{convertTemp(day.temp)}°</p>
                            <p className="text-xs text-white/60 mt-1">{day.condition}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white text-center py-8">Chargement des prévisions...</p>
            )}
        </div>
    );
};

export default Forecast;