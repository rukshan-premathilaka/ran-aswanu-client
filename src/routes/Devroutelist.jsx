import React from "react";
import { Link } from "react-router-dom";
import routes from "@/routes/routes.config.js";

/**
 * Dev-only index page: lists every route in routes.config.js as a clickable
 * link, grouped by section, so you can jump straight to any page while
 * building instead of typing URLs by hand.
 *
 * Only ever mounted when running in dev (see AppCopy.jsx), so it never
 * ships in a production build.
 */
function DevRouteList() {
	const grouped = routes.reduce((acc, route) => {
		acc[route.group] = acc[route.group] || [];
		acc[route.group].push(route);
		return acc;
	}, {});

	return (
		<div className="min-h-screen w-full bg-white px-6 py-10 sm:px-10">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-2xl font-semibold text-neutral-900">
					Dev route list
				</h1>
				<p className="mt-1.5 text-sm text-neutral-500">
					Visible only in development. Click any page to navigate there.
				</p>

				<div className="mt-8 space-y-8">
					{Object.entries(grouped).map(([group, groupRoutes]) => (
						<div key={group}>
							<h2 className="text-xs font-semibold uppercase tracking-wide text-lime-700">
								{group}
							</h2>
							<ul className="mt-3 divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200">
								{groupRoutes.map((route) => (
									<li key={route.path}>
										<Link
											to={route.path}
											className="flex items-center justify-between px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-lime-50 hover:text-lime-800"
										>
											<span className="font-medium">{route.label}</span>
											<span className="text-neutral-400">{route.path}</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default DevRouteList;