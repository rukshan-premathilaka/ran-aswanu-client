// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/page/login.jsx";
import RegisterPage from "@/page/RegisterPage";

import Homepage from './page/Homepage';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/Homepage" element={<Homepage />}/>

		</Routes>
	);
}

export default App;