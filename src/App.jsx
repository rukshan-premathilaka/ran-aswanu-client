// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/page/login.jsx";
import RegisterPage from "@/page/RegisterPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
		</Routes>
	);
}

export default App;