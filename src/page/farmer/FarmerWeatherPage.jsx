import React, { useState, useEffect } from 'react';
import {
    Cloud,
    Droplets,
    Wind,
    AlertTriangle,
    CheckCircle2,
    CloudRain,
    Sun,
    Loader2,
    MapPin,
    Clock,
    Gauge,
    Search,
    RefreshCw
} from 'lucide-react';

function FarmerWeatherPage() {
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Location and search states
    const [cityInput, setCityInput] = useState('');
    const [currentCityName, setCurrentCityName] = useState('Central Province, Sri Lanka');
    const [coords, setCoords] = useState({ lat: 7.2906, lon: 80.6337 });

    // Fetch weather data whenever coordinates change
    useEffect(() => {
        fetchWeatherData();
    }, [coords]);

    const fetchWeatherData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Weather data service unavailable');
            }

            const data = await response.json();
            setWeather(data);
        } catch (err) {
            console.error('Weather fetch failed:', err);
            setError(err.message || 'Failed to fetch weather data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchCity = async (e) => {
        e.preventDefault();
        const trimmedCity = cityInput.trim();
        if (!trimmedCity) return;

        setIsLoading(true);
        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`;
            const res = await fetch(geocodeUrl);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const location = data.results[0];
                setCoords({ lat: location.latitude, lon: location.longitude });
                setCurrentCityName(`${location.name}, ${location.country || ''}`);
                setCityInput('');
            } else {
                alert('City location not found! Please verify spelling.');
            }
        } catch (err) {
            console.error('Geocoding error:', err);
            alert('Unable to find location. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };

    const getWeatherCondition = (code) => {
        if (code === 0) return 'Clear Sky';
        if (code >= 1 && code <= 3) return 'Partly Cloudy';
        if (code >= 51 && code <= 67) return 'Rainy';
        if (code >= 95) return 'Thunderstorm';
        return 'Cloudy';
    };

    // Full page loading state on initial load
    if (isLoading && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 text-green-700 animate-spin mb-3" />
                <p className="text-gray-600 font-medium text-sm">Loading field weather forecast...</p>
            </div>
        );
    }

    // Full page error state
    if (error && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
                <h2 className="text-lg font-bold text-gray-800">Unable to Load Weather</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-sm">{error}</p>
                <button
                    type="button"
                    onClick={fetchWeatherData}
                    className="mt-4 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    // Weather Metrics Extraction
    const currentTemp = Math.round(weather.current.temperature_2m);
    const humidity = weather.current.relative_humidity_2m;
    const windSpeed = Math.round(weather.current.wind_speed_10m);
    const pressure = Math.round(weather.current.surface_pressure);

    const currentHour = new Date().getHours();
    const rainChance = weather.hourly.precipitation_probability[currentHour] || 0;
    const weatherCondition = getWeatherCondition(weather.current.weather_code);

    // Farming Recommendation Logic
    let adviceText = 'Favorable weather conditions. Safe for harvesting, weeding, and standard field tasks.';
    let adviceBg = 'bg-green-50 border-green-200 text-green-800';
    let isWarning = false;

    if (rainChance > 50) {
        adviceText = 'High chance of rain detected today. Avoid applying fertilizers, pesticides, or weedicides to prevent chemical runoff.';
        adviceBg = 'bg-orange-50 border-orange-200 text-orange-800';
        isWarning = true;
    } else if (windSpeed > 20) {
        adviceText = 'High wind speeds detected across fields. Postpone chemical spray operations to prevent unwanted drift.';
        adviceBg = 'bg-red-50 border-red-200 text-red-800';
        isWarning = true;
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto p-4 sm:p-6">
            {/* Header: Title, Location & Search */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Field Weather</h1>
                    <p className="text-gray-500 mt-1.5 flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-green-700" />
                        {currentCityName}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Form with Dark Green Border */}
                    <form onSubmit={handleSearchCity} className="flex items-center w-full sm:w-auto shadow-sm">
                        <input
                            type="text"
                            placeholder="Search district / city..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="w-full sm:w-64 border border-green-700 rounded-l-xl px-4 py-2.5 text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all"
                        />
                        <button
                            type="submit"
                            title="Search Weather Location"
                            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center border border-green-700 active:scale-95"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Live System Badge */}
                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 text-xs font-semibold text-green-800 flex items-center justify-center gap-2 whitespace-nowrap">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                        </span>
                        Live Forecast Connected
                    </div>
                </div>
            </div>

            {/* Current Weather Overview Cards */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Left: Temperature Box */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-700"></div>
                    <span className="text-gray-400 font-bold mb-6 text-xs tracking-wider uppercase">Current Temperature</span>

                    {weatherCondition === 'Clear Sky' ? (
                        <Sun className="w-20 h-20 text-yellow-500 mb-4" />
                    ) : weatherCondition === 'Rainy' ? (
                        <CloudRain className="w-20 h-20 text-blue-500 mb-4" />
                    ) : (
                        <Cloud className="w-20 h-20 text-gray-400 mb-4" />
                    )}

                    <h2 className="text-6xl font-bold text-gray-800 mb-2">{currentTemp}°C</h2>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-4 py-1 rounded-full">
                        {weatherCondition}
                    </span>
                </div>

                {/* Right: Metrics & Agricultural Advice */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-2/3 flex flex-col justify-between">
                    <div>
                        <span className="text-gray-400 font-bold mb-5 block text-xs tracking-wider uppercase">Field Atmospheric Metrics</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                                <p className="text-xs text-gray-500 font-semibold uppercase">Humidity</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{humidity}%</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Wind className="w-5 h-5 text-teal-600 mb-2" />
                                <p className="text-xs text-gray-500 font-semibold uppercase">Wind Speed</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{windSpeed} km/h</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <CloudRain className="w-5 h-5 text-indigo-500 mb-2" />
                                <p className="text-xs text-gray-500 font-semibold uppercase">Rain Risk</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{rainChance}%</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Gauge className="w-5 h-5 text-purple-500 mb-2" />
                                <p className="text-xs text-gray-500 font-semibold uppercase">Pressure</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{pressure} hPa</p>
                            </div>
                        </div>
                    </div>

                    {/* Actionable Farming Advice Box */}
                    <div className={`p-4 sm:p-5 rounded-xl border flex gap-3.5 items-start ${adviceBg}`}>
                        {isWarning ? (
                            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                            <h3 className="font-bold text-sm uppercase tracking-wide">Farming Advisory</h3>
                            <p className="text-sm mt-1 leading-relaxed">{adviceText}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next 8 Hours Forecast */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Hourly Forecast (Next 8 Hours)</h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 min-w-[550px] sm:min-w-0">
                        {Array.from({ length: 8 }).map((_, index) => {
                            const hourIndex = currentHour + index;
                            const displayHour = hourIndex % 24;
                            const ampm = displayHour >= 12 ? 'PM' : 'AM';
                            const hour12 = displayHour % 12 === 0 ? 12 : displayHour % 12;
                            const timeLabel = `${hour12} ${ampm}`;

                            const temp = Math.round(weather.hourly.temperature_2m[hourIndex] || 0);
                            const rain = weather.hourly.precipitation_probability[hourIndex] || 0;

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100 hover:border-green-300 transition-colors"
                                >
                                    <Clock className="w-4 h-4 text-gray-400 mb-1.5" />
                                    <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">{timeLabel}</span>
                                    <span className="text-base font-bold text-gray-800 my-1">{temp}°C</span>
                                    <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                                        <CloudRain className="w-3.5 h-3.5" />
                                        {rain}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Next 3 Days Outlook */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">3-Day Agricultural Outlook</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((dayOffset) => {
                        const dateObj = new Date(weather.daily.time[dayOffset]);
                        const dayName = dayOffset === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                        const maxTemp = Math.round(weather.daily.temperature_2m_max[dayOffset]);
                        const minTemp = Math.round(weather.daily.temperature_2m_min[dayOffset]);
                        const condition = getWeatherCondition(weather.daily.weather_code[dayOffset]);

                        return (
                            <div
                                key={dayOffset}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:border-green-200 transition-all"
                            >
                                <p className="font-bold text-gray-800 text-base mb-3">{dayName}</p>

                                {condition === 'Clear Sky' ? (
                                    <Sun className="w-12 h-12 text-yellow-500 mb-3" />
                                ) : condition === 'Rainy' ? (
                                    <CloudRain className="w-12 h-12 text-blue-500 mb-3" />
                                ) : (
                                    <Cloud className="w-12 h-12 text-gray-400 mb-3" />
                                )}

                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-800">{maxTemp}°C</span>
                                    <span className="text-sm font-semibold text-gray-400">/ {minTemp}°C</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-500 mt-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    {condition}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FarmerWeatherPage;