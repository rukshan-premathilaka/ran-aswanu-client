import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import routes from "@/routes/Routes.config.js";
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
						{routes.map((route) => {
							const Element = route.element;

							if (route.children && Array.isArray(route.children)) {
								return (
									<Route key={route.path} path={route.path} element={<Element />}>
										{route.children.map((child, idx) => {
											const ChildElement = child.element;
											if (child.index) {
												return <Route key={`idx-${idx}`} index element={<ChildElement />} />;
											}
											return (
												<Route
													key={child.path || idx}
													path={child.path}
													element={<ChildElement />}
												/>
											);
										})}
									</Route>
								);
							}

							return (
								<Route key={route.path} path={route.path} element={<Element />} />
							);
						})}

						<Route path="/farmer" element={<Navigate to="/dashboard" replace />} />
						<Route path="/farmer-dashboard" element={<Navigate to="/dashboard" replace />} />

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