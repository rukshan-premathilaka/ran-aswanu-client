import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Leaf, Menu, Sprout, Truck, X } from "lucide-react";
import { useProducts } from "@/api/fetchProducts.js";
import ProductTile from "@/component/ProductTile.jsx";
import ProductsPage from "./ProductsPage.jsx";
import ProductDetailView from "@/component/ProductDetailView.jsx";

// Short explanations shown in a pop-up when a feature is clicked
const FEATURES = [
	{
		icon: Sprout,
		label: "Farmers",
		text: "Direct from the field",
		details:
			"Farmers list their harvest directly on Ran Aswanu and set their own prices. With no middlemen, they earn a fairer share and you know exactly who grew your food.",
	},
	{
		icon: Leaf,
		label: "Fresh Picked",
		text: "Harvested same day",
		details:
			"Produce is harvested on the day it is listed, so what reaches your table is as fresh as it can be, straight from the farm.",
	},
	{
		icon: Truck,
		label: "Fast Delivery",
		text: "Tracked, door to door",
		details:
			"Trusted transport partners pick up your order and deliver it door to door. You can follow every step of the trip until it arrives.",
	},
];

// Side panel menu. Change the paths here if your routes are named differently.
// "Products" opens the products page right here on Home (no route needed).
const MENU_ITEMS = [
	{ label: "Home", path: "/" },
	{ label: "Products", path: "/products", action: "products" },
	{ label: "Chat", path: "/chat" },
	{ label: "Delivery ", path: "/MatchineDeliveries" },
	{ label: "Farmer Home", path: "/farmer/home" },
	{ label: "Buyer Profile", path: "/buyer-profile" },
];

// Side panel (slides in from the left)
function SidePanel({ open, onClose, onProducts }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	const go = ({ path, action }) => {
		onClose();
		if (action === "products") return onProducts();
		navigate(path);
	};

	const item = (menuItem) => {
		const { label, path } = menuItem;
		const active = pathname === path;
		return (
			<button
				key={path}
				onClick={() => go(menuItem)}
				className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-colors ${
					active ? "bg-green-50 text-green-900 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
				}`}
			>
				{label}
			</button>
		);
	};

	return (
		<>
			<div
				onClick={onClose}
				className={`fixed inset-0 bg-stone-900/40 z-40 transition-opacity duration-300 ${
					open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
			/>
			<aside
				className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
					open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between px-6 pt-8 pb-6">
					<div className="flex items-center gap-3">
						<Leaf className="w-9 h-9 text-green-600" />
						<span className="text-2xl font-bold text-green-600 leading-tight">
							Ran<br />Aswanna
						</span>
					</div>
					<button onClick={onClose} aria-label="Close menu" className="p-1 rounded-lg hover:bg-gray-100 self-start">
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<nav className="px-4 flex-1 space-y-1 overflow-y-auto">{MENU_ITEMS.map(item)}</nav>
			</aside>
		</>
	);
}

// Small pop-up with a short explanation
function FeaturePopup({ feature, onClose }) {
	useEffect(() => {
		if (!feature) return;
		const onKey = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [feature, onClose]);

	if (!feature) return null;
	const Icon = feature.icon;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40" onClick={onClose}>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative"
				role="dialog"
				aria-label={feature.label}
			>
				<button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 p-1 rounded-lg hover:bg-stone-100">
					<X className="w-4 h-4 text-stone-500" />
				</button>
				<div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-4">
					<Icon className="w-5 h-5 text-green-700" />
				</div>
				<h3 className="text-lg font-bold text-stone-900">{feature.label}</h3>
				<p className="text-sm text-stone-600 leading-relaxed mt-2">{feature.details}</p>
			</div>
		</div>
	);
}

export function Home() {
	const [panelOpen, setPanelOpen] = useState(false);
	const [activeFeature, setActiveFeature] = useState(null);
	// "See more" opens the full products page right here (no router route needed)
	const [showAll, setShowAll] = useState(false);
	// Product whose detail page is open (clicked from Fresh Picks)
	const [selected, setSelected] = useState(null);
	const cameFromDetail = useRef(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [showAll]);

	useEffect(() => {
		if (selected) {
			cameFromDetail.current = true;
		} else if (cameFromDetail.current) {
			cameFromDetail.current = false;
			setTimeout(() => document.getElementById("fresh-picks")?.scrollIntoView({ block: "start" }), 0);
		}
	}, [selected]);

	// Live product list (refreshes by itself). Home shows only the first 4.
	const { products, isLoading, isDemo, errorText } = useProducts();
	// Fresh Picks shows 4 products at a time and rotates through the whole list every few seconds
	const PICKS_PER_PAGE = 4;
	const ROTATE_MS = 5000;
	const [pickPage, setPickPage] = useState(0);
	const [pausePicks, setPausePicks] = useState(false); // paused while the mouse is over the cards
	const pageCount = Math.max(1, Math.ceil(products.length / PICKS_PER_PAGE));
	const currentPage = pickPage % pageCount;

	useEffect(() => {
		if (pageCount <= 1 || pausePicks) return;
		const timer = setInterval(() => setPickPage((p) => (p + 1) % pageCount), ROTATE_MS);
		return () => clearInterval(timer);
	}, [pageCount, pausePicks]);

	// Wraps around, so the last page is always full (when there are at least 4 products)
	const picks = Array.from({ length: Math.min(PICKS_PER_PAGE, products.length) }, (_, i) =>
		products[(currentPage * PICKS_PER_PAGE + i) % products.length]
	);

	// "Discover" scrolls down to the Fresh Picks section
	const scrollToPicks = () =>
		document.getElementById("fresh-picks")?.scrollIntoView({ behavior: "smooth", block: "start" });

	if (showAll) return <ProductsPage onBack={() => setShowAll(false)} />;
	if (selected) return <ProductDetailView product={selected} onBack={() => setSelected(null)} />;

	return (
		<div className="min-h-screen bg-stone-50">
			<SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} onProducts={() => setShowAll(true)} />
			<FeaturePopup feature={activeFeature} onClose={() => setActiveFeature(null)} />

			<header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur flex items-center justify-between px-6 md:px-10 py-4">
				<div className="flex items-center gap-3">
					<button
						onClick={() => setPanelOpen(true)}
						aria-label="Open menu"
						className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
					>
						<Menu className="w-5 h-5 text-stone-700" />
					</button>
					<Link to="/" className="flex items-center gap-2 font-extrabold text-stone-900">
						<Leaf className="w-5 h-5 text-green-700" /> RAN ASWANU
					</Link>
				</div>
				<nav className="flex items-center gap-6 text-sm font-medium text-stone-600">
					<button onClick={() => setShowAll(true)} className="hover:text-green-700">Products</button>
					<Link to="/login" className="hover:text-green-700">Login</Link>
				</nav>
			</header>

			<div className="px-6 md:px-10 pb-12">
				{/* Hero */}
				<div className="grid lg:grid-cols-2 gap-10 items-center pt-4">
					<div>
						<p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-green-700 uppercase mb-4">
							<span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Farm to table, direct from Sri Lanka
						</p>
						<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-none">
							RAN ASWANU
						</h1>
						<p className="text-stone-500 mt-5 max-w-md leading-relaxed">
							The marketplace that connects farmers, buyers and trusted transport partners — fresher
							harvests, fairer prices, and delivery you can actually track.
						</p>
						<button
							onClick={scrollToPicks}
							className="mt-8 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-green-700 transition-colors"
						>
							Discover <ChevronDown className="w-4 h-4" />
						</button>

						<div className="flex flex-wrap gap-8 mt-10">
							{FEATURES.map((f) => {
								const Icon = f.icon;
								return (
									<button
										key={f.label}
										onClick={() => setActiveFeature(f)}
										className="flex items-start gap-3 text-left rounded-xl p-2 -m-2 hover:bg-white hover:shadow-sm transition"
									>
										<Icon className="w-5 h-5 text-green-700 mt-0.5" />
										<div>
											<p className="text-sm font-semibold text-stone-900">{f.label}</p>
											<p className="text-xs text-stone-500">{f.text}</p>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					<div className="relative h-72 md:h-96">
						<div className="absolute inset-0 bg-green-300/50 rounded-[2rem] blur-2xl" aria-hidden="true" />
						<img
							src="https://images.unsplash.com/photo-1648090229186-6188eaefcc6a?q=80&w=1200&auto=format&fit=crop"
							alt="Basket of freshly harvested vegetables"
							className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl ring-1 ring-white/70"
						/>
						<div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
							<Leaf className="w-4 h-4 text-green-700" />
							<span className="text-xs font-semibold text-stone-700">Harvested today</span>
						</div>
					</div>
				</div>

				{/* Fresh Picks: 4 products at a time, rotates by itself */}
				<section id="fresh-picks" className="mt-24 scroll-mt-20">
					<div className="flex items-center justify-between mb-5">
						<div>
							<h2 className="text-2xl font-bold text-stone-900">Fresh Picks</h2>
							<p className="text-sm text-stone-500">
								Listings from farmers across Sri Lanka.
								{isDemo && <span className="text-stone-400"> Showing sample products for now.</span>}
							</p>
						</div>
						<button onClick={() => setShowAll(true)} className="text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1">
							See more <ChevronRight className="w-4 h-4" />
						</button>
					</div>

					{errorText && (
						<p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-3">{errorText}</p>
					)}
					{isLoading && <p className="text-sm text-stone-500">Loading...</p>}
					{!isLoading && !errorText && picks.length === 0 && (
						<p className="text-sm text-stone-500">No produce listed yet. Check back soon.</p>
					)}

					<style>{`
						@keyframes picksFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
						.picks-fade { animation: picksFade 0.6s ease; }
					`}</style>
					<div onMouseEnter={() => setPausePicks(true)} onMouseLeave={() => setPausePicks(false)}>
						<div key={currentPage} className="picks-fade grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{picks.map((p, i) => (
								<ProductTile key={p.listId ?? p.id ?? i} product={p} onClick={() => setSelected(p)} />
							))}
						</div>
					</div>

					{pageCount > 1 && (
						<div className="flex justify-center gap-2 mt-5">
							{Array.from({ length: pageCount }, (_, i) => (
								<button
									key={i}
									onClick={() => setPickPage(i)}
									aria-label={`Show picks ${i + 1}`}
									className={`h-2 rounded-full transition-all ${
										i === currentPage ? "w-6 bg-green-600" : "w-2 bg-stone-300 hover:bg-stone-400"
									}`}
								/>
							))}
						</div>
					)}

					{products.length > 4 && (
						<div className="mt-6 text-center">
							<button
								onClick={() => setShowAll(true)}
								className="inline-flex items-center gap-2 border border-green-600 text-green-700 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors"
							>
								See more <ChevronRight className="w-4 h-4" />
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

// Both exports, so lazy(() => import(...)) works whichever way the router imports it
export default Home;