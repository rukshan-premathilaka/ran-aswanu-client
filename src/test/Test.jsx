import { useEffect, useState } from "react";

function App() {

	const [location, setLocation] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {

		navigator.geolocation.getCurrentPosition(
			(position) => {

				const { latitude, longitude, accuracy } = position.coords;

				setLocation({ latitude, longitude, accuracy });

				if (accuracy <= 10) {
					setMessage("📍 Excellent! Your location was found using GPS.");
				} else if (accuracy <= 50) {
					setMessage("📍 Good accuracy. GPS or strong Wi-Fi was used.");
				} else if (accuracy <= 500) {
					setMessage("📍 Moderate accuracy. Your location was estimated using nearby Wi-Fi.");
				} else if (accuracy <= 5000) {
					setMessage("⚠️ Approximate location. Your browser is likely using Wi-Fi, cell towers, or your IP address.");
				} else {
					setMessage("❌ Low accuracy. Enable GPS or Location Services for a more precise location.");
				}

			},
			(error) => {
				setMessage(error.message);
			},
			{
				enableHighAccuracy: true
			}
		);

	}, []);

	return (
		<div>
			{location && (
				<>
					<h2>Location</h2>
					<p>Latitude: {location.latitude}</p>
					<p>Longitude: {location.longitude}</p>
					<p>Accuracy: {location.accuracy.toFixed(2)} m</p>

					<hr />

					<strong>{message}</strong>
				</>
			)}
		</div>
	);
}

export default App;