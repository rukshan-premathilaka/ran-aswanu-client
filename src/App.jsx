import './index.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// Your existing imports
import Login from "@/page/login.jsx";
import Welcome from "@/page/welcome.jsx";

import RegisterPage from "@/page/RegisterPage.jsx";
import {Suspense} from "react";
import ForgotPasswordPage from "@/page/ForgotPasswordPage.jsx";

const PageFallback = () => (
	<div className="flex min-h-screen w-full items-center justify-center bg-white">
		<div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-600 border-t-transparent"/>
	</div>
);

function App() {
	return (
		/* <ProductClick />*/

		<Router>
			<Suspense fallback={<PageFallback/>}>
				<Routes>
					{/* home page */}
					<Route path="/" element={<Welcome/>}/>

					{/* User */}
					<Route path="/register" element={<RegisterPage/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
					<Route path="/reset-password" element={<Login/>}/>

				</Routes>
			</Suspense>
		</Router>


	);
}

export default App;