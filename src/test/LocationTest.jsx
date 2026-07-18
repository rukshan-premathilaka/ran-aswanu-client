import { useState, useEffect } from "react";
import { useGeolocation } from "@/test/useGeolocation";

async function reverseGeocode(lat, lng) {
	const res = await fetch(
		`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
	);
	const data = await res.json();
	return data.display_name; // e.g. "Negombo, Western Province, Sri Lanka"
}

export default function LocationTest() {
	const { location, error, loading, getLocation } = useGeolocation();
	const [address, setAddress] = useState(null);
	const [geocoding, setGeocoding] = useState(false);

	useEffect(() => {
		if (!location) return;

		setGeocoding(true);
		reverseGeocode(location.latitude, location.longitude)
			.then(setAddress)
			.catch(() => setAddress("Could not resolve address"))
			.finally(() => setGeocoding(false));
	}, [location]);

	return (
		<div>
			<button onClick={getLocation}>Use My Location</button>
			{loading && <p>Getting location...</p>}
			{location && <p>Lat: {location.latitude}, Lng: {location.longitude}</p>}
			{geocoding && <p>Resolving address...</p>}
			{address && <p>Address: {address}</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	);
}