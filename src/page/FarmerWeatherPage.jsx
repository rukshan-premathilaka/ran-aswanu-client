import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertTriangle, CheckCircle2, CloudRain, Sun, Loader2, MapPin, Clock, Gauge, Search } from 'lucide-react';

function FarmerWeatherPage() {
    // states for weather and location
    const [weather, setWeather] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search states
    const [cityInput, setCityInput] = useState("");
    const [currentCityName, setCurrentCityName] = useState("Central Province, Sri Lanka");
    const [coords, setCoords] = useState({ lat: 7.2906, lon: 80.6337 }); // Default coordinates

    // fetch data when page loads or when coordinates change
    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            try {
                // Get current, hourly and daily data using the coords state
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = await response.json();
                setWeather(data);
                setIsLoading(false);
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [coords]); // When 'coords' change, this useEffect runs automatically

    // Function to search city name and get coordinates
    const searchCity = async () => {
        if (cityInput.trim() === "") return;

        setIsLoading(true);
        try {
            // Geocoding API to find latitude and longitude
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const locationInfo = data.results[0];
                // Update coordinates which will trigger useEffect to fetch new weather
                setCoords({ lat: locationInfo.latitude, lon: locationInfo.longitude });
                // Update the displayed city name
                setCurrentCityName(`${locationInfo.name}, ${locationInfo.country || ''}`);
                setCityInput(""); // Clear the input box
            } else {
                alert("Location not found! Please check the spelling and try again.");
                setIsLoading(false);
            }
        } catch (err) {
            alert("Error finding location. Please try again.");
            setIsLoading(false);
        }
    };

    // simple function to find weather name
    const getWeatherCondition = (code) => {
        if (code === 0) return "Clear Sky";
        if (code === 1 || code === 2 || code === 3) return "Partly Cloudy";
        if (code >= 51 && code <= 67) return "Rainy";
        if (code >= 95) return "Thunderstorm";
        return "Unknown";
    };

    // show loading screen
    if (isLoading && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#8dc63f] animate-spin mb-4" />
                <p className="text-gray-600 font-medium text-lg">Fetching live weather data...</p>
            </div>
        );
    }

    // show error screen
    if (error && !weather) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500">
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 rounded-lg">Try Again</button>
            </div>
        );
    }

    // MAIN WEATHER VARIABLES
    let currentTemp = Math.round(weather.current.temperature_2m);
    let humidity = weather.current.relative_humidity_2m;
    let windSpeed = Math.round(weather.current.wind_speed_10m);
    let pressure = Math.round(weather.current.surface_pressure);

    // find current hour to get rain chance
    let currentHourIndex = new Date().getHours();
    let rainChance = weather.hourly.precipitation_probability[currentHourIndex] || 0;
    let weatherCondition = getWeatherCondition(weather.current.weather_code);

    // SIMPLE FARMING ADVICE LOGIC
    let adviceText = "";
    let adviceBgColor = "";
    let adviceTextColor = "";

    if (rainChance > 50) {
        adviceText = "High chance of rain today. Do not apply fertilizer or chemicals to prevent washing away.";
        adviceBgColor = "bg-orange-100 border-orange-300";
        adviceTextColor = "text-orange-800";
    } else if (windSpeed > 20) {
        adviceText = "Strong winds detected. Avoid spraying pesticides today.";
        adviceBgColor = "bg-red-100 border-red-300";
        adviceTextColor = "text-red-800";
    } else {
        adviceText = "Good weather conditions! It is safe for planting and field work today.";
        adviceBgColor = "bg-[#D2E9C4] border-green-400";
        adviceTextColor = "text-green-900";
    }

    // HOURLY DATA CALCULATION (Next 8 Hours)
    let nextHoursData = [];

    for (let i = 0; i < 8; i++) {
        let hourIndex = currentHourIndex + i;

        let displayHour = hourIndex % 24;
        let ampm = displayHour >= 12 ? 'PM' : 'AM';
        let simpleHour = displayHour % 12;
        if (simpleHour === 0) simpleHour = 12;

        let timeString = simpleHour + " " + ampm;

        let hrTemp = Math.round(weather.hourly.temperature_2m[hourIndex]);
        let hrRain = weather.hourly.precipitation_probability[hourIndex];

        nextHoursData.push(
            <div key={i} className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-gray-100 w-full hover:bg-[#D2E9C4]/30 transition-colors">
                <Clock className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-sm font-bold text-gray-700 whitespace-nowrap">{timeString}</p>
                <p className="text-lg font-bold text-gray-900 my-1">{hrTemp}°C</p>
                <div className="flex items-center gap-1 text-blue-500 text-sm font-semibold">
                    <CloudRain className="w-4 h-4" />
                    {hrRain}%
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">

            {/* Header with Location and Search */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Weather</h1>
                    <p className="text-gray-500 mt-2 flex items-center gap-2 font-medium">
                        <MapPin className="w-5 h-5 text-[#8dc63f]" />
                        {currentCityName}
                    </p>
                </div>

                {/* Search Box and Live Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Search Input */}
                    <div className="flex items-center w-full sm:w-auto relative">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') searchCity(); }}
                            className="w-full sm:w-64 border border-gray-200 rounded-l-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] focus:ring-1 focus:ring-[#8dc63f]"
                        />
                        <button
                            onClick={searchCity}
                            className="bg-[#8dc63f] hover:bg-green-600 text-white px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center border border-[#8dc63f]"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Live System Active Badge */}
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
                        {/* Humidity */}
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Droplets className="w-6 h-6 text-blue-500" />
                            <p className="text-xs text-gray-500 font-semibold uppercase">Humidity</p>
                            <p className="text-2xl font-bold text-gray-800">{humidity}%</p>
                        </div>

                        {/* Wind */}
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Wind className="w-6 h-6 text-teal-500" />
                            <p className="text-xs text-gray-500 font-semibold uppercase">Wind Speed</p>
                            <p className="text-2xl font-bold text-gray-800">{windSpeed} km/h</p>
                        </div>

                        {/* Rain */}
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <CloudRain className="w-6 h-6 text-indigo-500" />
                            <p className="text-xs text-gray-500 font-semibold uppercase">Rain Chance</p>
                            <p className="text-2xl font-bold text-gray-800">{rainChance}%</p>
                        </div>

                        {/* Pressure */}
                        <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <Gauge className="w-6 h-6 text-purple-500" />
                            <p className="text-xs text-gray-500 font-semibold uppercase">Pressure</p>
                            <p className="text-2xl font-bold text-gray-800">{pressure} hPa</p>
                        </div>
                    </div>

                    {/* Advice Box */}
                    <div className={`mt-auto p-5 rounded-xl border flex gap-4 items-start transition-colors ${adviceBgColor}`}>
                        {rainChance > 50 || windSpeed > 20 ? (
                            <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${adviceTextColor}`} />
                        ) : (
                            <CheckCircle2 className={`w-8 h-8 flex-shrink-0 ${adviceTextColor}`} />
                        )}
                        <div>
                            <h4 className={`font-bold text-lg ${adviceTextColor}`}>Actionable Advice</h4>
                            <p className={`text-base mt-1 font-medium ${adviceTextColor}`}>{adviceText}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: Hourly Rain & Temp (Next 8 Hours) */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hourly Forecast (Next 8 Hours)</h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
                {isLoading && <div className="absolute inset-0 bg-white/60 z-10 rounded-2xl"></div>}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
                    {nextHoursData}
                </div>
            </div>

            {/* Bottom Section: 3-Day Forecast */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Next 3 Days Outlook</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {isLoading && <div className="absolute inset-0 bg-white/60 z-10"></div>}

                {/* Loop for 3 days */}
                {[1, 2, 3].map((dayIndex) => {
                    const date = new Date(weather.daily.time[dayIndex]);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const maxTemp = Math.round(weather.daily.temperature_2m_max[dayIndex]);
                    const minTemp = Math.round(weather.daily.temperature_2m_min[dayIndex]);
                    const dailyCode = weather.daily.weather_code[dayIndex];
                    const dailyCondition = getWeatherCondition(dailyCode);

                    return (
                        <div key={dayIndex} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <p className="font-bold text-gray-700 text-lg mb-4">{dayIndex === 1 ? 'Tomorrow' : dayName}</p>

                            {dailyCondition === "Clear Sky" ? (
                                <Sun className="w-12 h-12 text-yellow-500 mb-4" />
                            ) : dailyCondition === "Rainy" ? (
                                <CloudRain className="w-12 h-12 text-blue-400 mb-4" />
                            ) : (
                                <Cloud className="w-12 h-12 text-gray-400 mb-4" />
                            )}

                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold text-gray-800">{maxTemp}°C</p>
                                <p className="text-lg font-bold text-gray-400">{minTemp}°C</p>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-2">{dailyCondition}</p>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default FarmerWeatherPage;