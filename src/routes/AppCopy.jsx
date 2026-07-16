import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "@/routes/routes.config.js";
import DevRouteList from "@/routes/DevRouteList.jsx";
import RouteErrorBoundary from "@/routes/RouteErrorBoundary.jsx";

const PageFallback = () => (
	<div className="flex min-h-screen w-full items-center justify-center bg-white">
		<div className="h-8 w-8 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
	</div>
);

function AppCopy() {
	return (
		<Router>
			<RouteErrorBoundary>
				<Suspense fallback={<PageFallback />}>
					<Routes>
						{routes.map(({ path, element: Element }) => (
							<Route key={path} path={path} element={<Element />} />
						))}

						{import.meta.env.DEV && (
							<Route path="/dev-routes" element={<DevRouteList />} />
						)}
					</Routes>
				</Suspense>
			</RouteErrorBoundary>
		</Router>
	);
}

export default AppCopy;