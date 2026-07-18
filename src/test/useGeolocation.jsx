// hooks/useGeolocation.js
import { useState } from "react";

export function useGeolocation() {
	const [location, setLocation] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const getLocation = () => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by this browser.");
			return;
		}

		setLoading(true);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
				});
				setLoading(false);
			},
			(err) => {
				setError(err.message); // e.g. "User denied Geolocation"
				setLoading(false);
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
		);
	};

	return { location, error, loading, getLocation };
}