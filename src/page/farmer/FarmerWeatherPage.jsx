import React, { useState, useEffect } from 'react';
import { Loader2, Sun, CloudRain, Cloud } from 'lucide-react';

function FarmerWeatherPage() {

    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const [cityInput, setCityInput] = useState("");
    const [currentCityName, setCurrentCityName] = useState("Uva Province, Sri Lanka");
    const [latitude, setLatitude] = useState(7.2906);
    const [longitude, setLongitude] = useState(80.6337);

    // get weather information from API
    const fetchWeatherData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get data from Open-Meteo API
            const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Failed to fetch weather data from server");
            }

            const data = await response.json();
            setWeather(data);
            setIsLoading(false);
        } catch (err) {
            console.error("Weather error:", err);
            setError("Could not load weather data. Please try again.");
            setIsLoading(false);
        }
    };

    // Latitude or Longitude
    useEffect(() => {
        fetchWeatherData();
    }, [latitude, longitude]);

    // Latitude and Longitude
    const handleSearchCity = async () => {
        const trimmedCity = cityInput.trim();
        if (trimmedCity === "") {
            return;
        }

        setIsLoading(true);

        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${trimmedCity}&count=1&language=en&format=json`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            // check city
            if (data.results && data.results.length > 0) {
                const firstResult = data.results[0];
                setLatitude(firstResult.latitude);
                setLongitude(firstResult.longitude);
                setCurrentCityName(`${firstResult.name}, ${firstResult.country || ''}`);
                setCityInput("");
            } else {
                alert("Location not found! Please check the spelling and try again.");
                setIsLoading(false);
            }
        } catch (err) {
            alert("Error finding location. Please check your internet connection.");
            setIsLoading(false);
        }
    };

    // Give condition accordin Weather Code
    const getWeatherCondition = (code) => {
        if (code === 0) {
            return "Clear Sky";
        } else if (code === 1 || code === 2 || code === 3) {
            return "Partly Cloudy";
        } else if (code >= 51 && code <= 67) {
            return "Rainy";
        } else if (code >= 95) {
            return "Thunderstorm";
        } else {
            return "Clear Sky";
        }
    };

    // Loading UI
    if (isLoading && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#8dc63f] animate-spin mb-4" />
                <p className="text-gray-600 font-medium text-lg">Fetching live weather data...</p>
            </div>
        );
    }

    // Error UI
    if (error && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                <p>Error: {error}</p>
                <button
                    onClick={fetchWeatherData}
                    className="mt-4 px-4 py-2 bg-red-100 rounded-lg font-bold text-red-700 cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // main valu convert Variables
    const currentTemp = Math.round(weather?.current?.temperature_2m || 0);
    const humidity = weather?.current?.relative_humidity_2m || 0;
    const windSpeed = Math.round(weather?.current?.wind_speed_10m || 0);
    const pressure = Math.round(weather?.current?.surface_pressure || 0);
    const weatherCondition = getWeatherCondition(weather?.current?.weather_code || 0);

    // Rain posibility
    const currentHourIndex = new Date().getHours();
    const rainChance = weather?.hourly?.precipitation_probability?.[currentHourIndex] || 0;

    // deteermine farmer advice
    let adviceText = "Good weather conditions! It is safe for planting and field work today.";
    let adviceBgColor = "bg-[#D2E9C4] border-green-400";
    let adviceTextColor = "text-green-900";

    if (rainChance > 50) {
        adviceText = "High chance of rain today. Do not apply fertilizer or chemicals to prevent washing away.";
        adviceBgColor = "bg-orange-100 border-orange-300";
        adviceTextColor = "text-orange-800";
    } else if (windSpeed > 20) {
        adviceText = "Strong winds detected. Avoid spraying pesticides today.";
        adviceBgColor = "bg-red-100 border-red-300";
        adviceTextColor = "text-red-800";
    }

    // next 8 hour
    const nextHoursData = [];
    for (let i = 0; i < 8; i++) {
        const hourIndex = currentHourIndex + i;

        // 12 hour AM/PM format
        const displayHour = hourIndex % 24;
        const ampm = displayHour >= 12 ? 'PM' : 'AM';
        let simpleHour = displayHour % 12;
        if (simpleHour === 0) {
            simpleHour = 12;
        }

        const timeString = `${simpleHour} ${ampm}`;
        const hrTemp = Math.round(weather?.hourly?.temperature_2m?.[hourIndex] || currentTemp);
        const hrRain = weather?.hourly?.precipitation_probability?.[hourIndex] || 0;

        nextHoursData.push(
            <div
                key={i}
                className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100 w-full hover:bg-[#D2E9C4]/30 transition-colors"
            >
                <p className="text-xs font-bold text-gray-500 whitespace-nowrap mb-1">{timeString}</p>
                <p className="text-lg font-bold text-gray-900 my-1">{hrTemp}°C</p>
                <p className="text-xs text-blue-600 font-semibold">
                    Rain {hrRain}%
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">

            {/* Header with Location and Search */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Weather</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        📍 {currentCityName}
                    </p>
                </div>

                {/* Search Box and Live Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center w-full sm:w-auto relative">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchCity(); }}
                            className="w-full sm:w-64 border border-gray-200 rounded-l-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] focus:ring-1 focus:ring-[#8dc63f]"
                        />
                        <button
                            type="button"
                            onClick={handleSearchCity}
                            className="bg-[#8dc63f] hover:bg-green-600 text-white px-4 py-2.5 rounded-r-xl transition-colors font-semibold text-sm border border-[#8dc63f] cursor-pointer"
                        >
                            Search
                        </button>
                    </div>

                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 text-sm font-semibold text-green-700 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Live System Active
                    </div>
                </div>
            </div>

            {/* Top Big Section */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">

                {/* Main Temperature Box */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <Loader2 className="w-8 h-8 text-[#8dc63f] animate-spin" />
                        </div>
                    )}
                    <div className="absolute top-0 w-full h-2 bg-[#8dc63f]"></div>
                    <h3 className="text-gray-400 font-bold mb-6 text-xs tracking-widest uppercase">Current Status</h3>

                    {/* Condition Icon */}
                    {weatherCondition === "Clear Sky" ? (
                        <Sun className="w-24 h-24 text-yellow-500 mb-6" />
                    ) : weatherCondition === "Rainy" ? (
                        <CloudRain className="w-24 h-24 text-blue-500 mb-6" />
                    ) : (
                        <Cloud className="w-24 h-24 text-gray-400 mb-6" />
                    )}

                    <h2 className="text-7xl font-bold text-gray-800 mb-2">{currentTemp}°C</h2>
                    <p className="text-xl font-medium text-gray-600 bg-gray-50 px-4 py-1 rounded-full">{weatherCondition}</p>
                </div>

                {/* Details Box */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-2/3 flex flex-col relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-2xl"></div>
                    )}
                    <h3 className="text-gray-400 font-bold mb-6 text-xs tracking-widest uppercase">Field Metrics</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Humidity</p>
                            <p className="text-2xl font-bold text-gray-800">{humidity}%</p>
                        </div>

                        <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Wind Speed</p>
                            <p className="text-2xl font-bold text-gray-800">{windSpeed} km/h</p>
                        </div>

                        <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Rain Chance</p>
                            <p className="text-2xl font-bold text-gray-800">{rainChance}%</p>
                        </div>

                        <div className="flex flex-col gap-1 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Pressure</p>
                            <p className="text-2xl font-bold text-gray-800">{pressure} hPa</p>
                        </div>
                    </div>

                    {/* Advice Box */}
                    <div className={`mt-auto p-5 rounded-xl border transition-colors ${adviceBgColor}`}>
                        <h4 className={`font-bold text-lg ${adviceTextColor}`}>Actionable Advice</h4>
                        <p className={`text-base mt-1 font-medium ${adviceTextColor}`}>{adviceText}</p>
                    </div>
                </div>
            </div>

            {/* Hourly Forecast */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hourly Forecast (Next 8 Hours)</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                {isLoading && <div className="absolute inset-0 bg-white/60 z-10 rounded-2xl"></div>}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
                    {nextHoursData}
                </div>
            </div>

            {/* 3 Day Forecast */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Next 3 Days Outlook</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {isLoading && <div className="absolute inset-0 bg-white/60 z-10"></div>}

                {[1, 2, 3].map((dayIndex) => {
                    const timeString = weather?.daily?.time?.[dayIndex];
                    const date = timeString ? new Date(timeString) : new Date();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const maxTemp = Math.round(weather?.daily?.temperature_2m_max?.[dayIndex] || 0);
                    const minTemp = Math.round(weather?.daily?.temperature_2m_min?.[dayIndex] || 0);
                    const dailyCode = weather?.daily?.weather_code?.[dayIndex] || 0;
                    const dailyCondition = getWeatherCondition(dailyCode);

                    return (
                        <div key={dayIndex} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <p className="font-bold text-gray-700 text-lg mb-2">
                                {dayIndex === 1 ? 'Tomorrow' : dayName}
                            </p>
                            <div className="flex items-center gap-3 my-2">
                                <p className="text-3xl font-bold text-gray-800">{maxTemp}°C</p>
                                <p className="text-lg font-bold text-gray-400">{minTemp}°C</p>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-1">{dailyCondition}</p>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default FarmerWeatherPage;