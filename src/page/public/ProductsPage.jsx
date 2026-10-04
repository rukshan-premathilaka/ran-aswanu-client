import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Menu, Search, User, X } from "lucide-react";
import { useProducts } from "@/api/fetchProducts.js";
import ProductTile from "@/component/ProductTile.jsx";
import ProductDetailView from "@/component/ProductDetailView.jsx";
import logoImg from "@/assets/farmerImg/logo.png";

// Sidebar menu. Change the paths here if your routes are named differently.
const MENU_ITEMS = [
    { label: "Home", path: "/home" },
    { label: "Products", path: "/products" },
    { label: "Chat", path: "/chat" },
    { label: "Delivery Request", path: "/DeliveryRequest" },
    { label: "Farmer Home", path: "/farmer/home" },
    { label: "Buyer Profile", path: "/buyer-profile" },
];

const SORT_TABS = [
    { id: "all", label: "All" },
    { id: "az", label: "A to Z" },
    { id: "za", label: "Z to A" },
];

const getName = (p) => p.productName ?? "Product";

// Sidebar: hidden until the menu (three lines) button is clicked, like on Home
function Sidebar({ open, onClose, onBack }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const go = (path) => {
        onClose();
        // Opened from Home with "See more": Home goes back to the home view, Products stays here
        if (onBack && path === "/home") return onBack();
        if (onBack && path === "/products") return;
        navigate(path);
    };

    const item = ({ label, path }) => {
        const active = onBack ? path === "/products" : pathname === path;
        return (
            <button
                key={path}
                onClick={() => go(path)}
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
            {/* Dark overlay, small screens only */}
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
                    <Link to="/home" className="flex items-center gap-3">
                        <img src={logoImg} alt="Ran Aswanu logo" className="w-9 h-9 object-contain" />
                        <span className="text-2xl font-bold text-green-600 leading-tight">
							Ran<br />Aswanna
						</span>
                    </Link>
                    <button onClick={onClose} aria-label="Close menu" className="p-1 rounded-lg hover:bg-gray-100 self-start">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="px-4 flex-1 space-y-1 overflow-y-auto">{MENU_ITEMS.map(item)}</nav>			</aside>
        </>
    );
}

export function ProductsPage({ onBack } = {}) {
    const navigate = useNavigate();
    const { products, isLoading, errorText } = useProducts();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("keyword") ?? ""); // /products?keyword=tomato from the Navbar search
    const [sort, setSort] = useState("all");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selected, setSelected] = useState(null); // product whose detail page is open

    // Close the small-screen sidebar with Escape
    useEffect(() => {
        if (!sidebarOpen) return;
        const onKey = (e) => e.key === "Escape" && setSidebarOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [sidebarOpen]);

    const shown = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = q ? products.filter((p) => getName(p).toLowerCase().includes(q)) : [...products];
        if (sort === "az") list.sort((a, b) => getName(a).localeCompare(getName(b)));
        if (sort === "za") list.sort((a, b) => getName(b).localeCompare(getName(a)));
        return list;
    }, [products, search, sort]);

    if (selected) return <ProductDetailView product={selected} onBack={() => setSelected(null)} />;

    return (
        <div className="min-h-screen bg-stone-50">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onBack={onBack} />

            <div>
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur flex flex-wrap items-center gap-4 px-6 md:px-10 py-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                        className="p-2 rounded-lg hover:bg-stone-100"
                    >
                        <Menu className="w-5 h-5 text-stone-700" />
                    </button>
                    <button
                        onClick={() => (onBack ? onBack() : navigate(-1))}
                        aria-label="Go back"
                        className="p-2 rounded-full hover:bg-stone-100 text-stone-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center bg-white border border-stone-200 rounded-full px-4 py-2.5 gap-3 w-full sm:w-72">
                        <Search className="w-4 h-4 text-stone-400 shrink-0" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search produce"
                            className="bg-transparent text-sm outline-none w-full placeholder:text-stone-400"
                        />
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {SORT_TABS.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSort(t.id)}
                                className={sort === t.id ? "text-green-700" : "text-stone-500 hover:text-stone-900 transition-colors"}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    <Link
                        to="/login"
                        aria-label="Account"
                        className="ml-auto w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                    >
                        <User className="w-5 h-5" />
                    </Link>
                </header>

                {/* Product grid */}
                <main className="px-6 md:px-10 pb-16 pt-4">
                    <h1 className="text-2xl font-bold text-stone-900">All Products</h1>
                    <p className="text-sm text-stone-500 mt-1 mb-6">
                        Listings from farmers across Sri Lanka.
                    </p>

                    {errorText && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-3">{errorText}</p>
                    )}
                    {isLoading && <p className="text-sm text-stone-500">Loading...</p>}
                    {!isLoading && !errorText && shown.length === 0 && (
                        <p className="text-sm text-stone-500">
                            {search.trim() ? `No produce matches "${search}".` : "No produce listed yet. Check back soon."}
                        </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                        {shown.map((p, i) => (
                            <ProductTile key={p.listId ?? p.id ?? i} product={p} tall onClick={() => setSelected(p)} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProductsPage;