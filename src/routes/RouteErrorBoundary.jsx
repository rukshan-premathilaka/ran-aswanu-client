import React from "react";

/**
 * Catches render/lifecycle errors from anything rendered inside it (e.g. a
 * lazy-loaded page that throws, or a failed dynamic import) and shows a
 * fallback UI instead of letting React unmount the entire app to a blank
 * white screen. Wrap this around <Routes> in AppCopy.jsx.
 */
class RouteErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		// Still logs to console so you can see the real stack trace
		console.error("Route crashed:", error, info);
	}

	render() {
		if (this.state.error) {
			return (
				<div className="flex min-h-screen w-full items-center justify-center bg-white px-6">
					<div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
						<p className="font-semibold">This page crashed.</p>
						<p className="mt-1">{this.state.error.message}</p>
						<button
							type="button"
							onClick={() => this.setState({ error: null })}
							className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
						>
							Try again
						</button>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}

export default RouteErrorBoundary;