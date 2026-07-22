import { useState } from 'react';
import {
    Menu, X, Search, Bell, User, ChevronRight, Leaf, Truck,
    ShoppingBasket, MapPin, Check, Sprout, Package, MessageCircle,
    Home as HomeIcon, Info, Phone, Mail, ArrowLeft, LogIn
} from 'lucide-react';
import ChatPage from "@/page/ChatPage.jsx";
import Login from "@/page/login.jsx";
import LoginPage from "@/page/login.jsx";

const PRODUCTS = [
    { id: 1, emoji: '🥕', name: 'Carrots', farmer: 'Sunil Perera', location: 'Nuwara Eliya', price: 180 },
    { id: 2, emoji: '🍅', name: 'Tomatoes', farmer: 'Kamala Silva', location: 'Dambulla', price: 140 },
    { id: 3, emoji: '🌽', name: 'Corn', farmer: 'Ranjith Kumara', location: 'Anuradhapura', price: 90 },
    { id: 4, emoji: '🥬', name: 'Cabbage', farmer: 'Nimal Bandara', location: 'Bandarawela', price: 120 },
    { id: 5, emoji: '🍆', name: 'Brinjals', farmer: 'Priyanka Fernando', location: 'Matale', price: 160 },
    { id: 6, emoji: '🥔', name: 'Potatoes', farmer: 'Chaminda Rathnayake', location: 'Welimada', price: 200 },
];

const CHATS = [
    { id: 1, name: 'Sunil Perera', role: 'Farmer · Nuwara Eliya', preview: 'Carrots 50kg tomorrow ready, delivery eka fix karamu', time: '9:42 AM', unread: 2 },
    { id: 2, name: 'Fresh Basket Colombo', role: 'Buyer · Colombo 05', preview: 'Order eka godak thanks! Next week ithuru weida?', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Ruwan Transport', role: 'Transport · Kandy', preview: 'Truck eka 7am start karanawa, location share karanna', time: 'Mon', unread: 1 },
];

const FEATURES = [
    { icon: Sprout, label: 'Farmers', text: 'Direct from the field' },
    { icon: Leaf, label: 'Fresh Picked', text: 'Harvested same day' },
    { icon: Truck, label: 'Fast Delivery', text: 'Tracked, door to door' },
];

function HarvestPhoto() {
    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-lime-300/50 rounded-[2rem] blur-2xl" aria-hidden="true" />
            <img
                src="https://images.unsplash.com/photo-1648090229186-6188eaefcc6a?q=80&w=1200&auto=format&fit=crop"
                alt="Basket of freshly harvested vegetables"
                className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl ring-1 ring-white/70"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-lime-700" />
                <span className="text-xs font-semibold text-stone-700">Harvested today</span>
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-lime-50 flex items-center justify-center text-3xl">
                {product.emoji}
            </div>
            <div>
                <p className="font-semibold text-stone-900">{product.name}</p>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {product.farmer}, {product.location}
                </p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2">
        <span className="font-bold text-lime-700">
          Rs. {product.price}<span className="text-xs font-normal text-stone-500">/kg</span>
        </span>
                <button className="w-9 h-9 rounded-full bg-lime-600 text-white flex items-center justify-center hover:bg-lime-700 transition-colors">
                    <ShoppingBasket className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function Navbar({ onMenuClick, view, setView, isLoggedIn, searchQuery, setSearchQuery, notifOpen, setNotifOpen }) {
    return (
        <header className="flex items-center justify-between gap-4 px-6 md:px-10 pt-6 pb-4 relative z-30">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} aria-label="Open menu" className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <Menu className="w-5 h-5 text-stone-700" />
                </button>
                <button onClick={() => setView('home')} className="font-display text-xl font-bold tracking-tight">
                    <span className="text-lime-600">Ran</span>{' '}
                    <span className="text-lime-900">Aswanu</span>
                </button>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                <button onClick={() => setView('home')} className={view === 'home' ? 'text-lime-700' : 'hover:text-stone-900 transition-colors'}>Home</button>
                <button onClick={() => setView('products')} className={view === 'products' ? 'text-lime-700' : 'hover:text-stone-900 transition-colors'}>Products</button>
                <button onClick={() => setView('about')} className={view === 'about' ? 'text-lime-700' : 'hover:text-stone-900 transition-colors'}>About</button>
                <button onClick={() => setView('about')} className="hover:text-stone-900 transition-colors">Contact</button>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden sm:flex items-center bg-stone-100 rounded-full px-3 py-2 gap-2 w-40 md:w-52">
                    <Search className="w-4 h-4 text-stone-400 shrink-0" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setView('products')}
                        placeholder="Search produce..."
                        className="bg-transparent text-sm outline-none w-full placeholder:text-stone-400"
                    />
                </div>

                {isLoggedIn && (
                    <div className="relative">
                        <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors">
                            <Bell className="w-5 h-5 text-stone-700" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime-500 rounded-full" />
                        </button>
                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-30">
                                <p className="text-xs font-semibold text-stone-400 px-2 py-1">Notifications</p>
                                <div className="px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-700">Your order #1042 has been shipped</div>
                                <div className="px-2 py-2 rounded-lg hover:bg-stone-50 text-sm text-stone-700">New message from Sunil (Farmer)</div>
                            </div>
                        )}
                    </div>
                )}

                <button onClick={() => setView('login')} className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
                    <User className="w-5 h-5 text-stone-700" />
                </button>
            </div>
        </header>
    );
}

function Drawer({ open, onClose, setView, isLoggedIn }) {
    const items = [
        { id: 'home', label: 'Home', icon: HomeIcon },
        { id: 'products', label: 'Products', icon: Package },
        ...(isLoggedIn ? [{ id: 'chat', label: 'Chat', icon: MessageCircle }] : []),
        { id: 'about', label: 'About', icon: Info },
        { id: 'login', label: isLoggedIn ? 'Account' : 'Login / Account', icon: LogIn },
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-stone-900/40 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-6 py-6 border-b border-stone-100">
          <span className="font-display text-lg font-bold">
            <span className="text-lime-600">Ran</span> <span className="text-lime-900">Aswanu</span>
          </span>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>
                <nav className="p-4 flex flex-col gap-1">
                    {items.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setView(id); onClose(); }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-700 hover:bg-lime-50 hover:text-lime-800 transition-colors text-sm font-medium"
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-xs text-stone-400 border-t border-stone-100">
                    Connecting farmers, buyers &amp; transport across Sri Lanka.
                </div>
            </aside>
        </>
    );
}

function OnboardingView({ setView, userType, setUserType }) {
    return (
        <div className="px-6 md:px-10 pb-16 pt-6 flex flex-col items-center text-center">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-lime-700 uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-600" /> Welcome to
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-none">
                RAN ASWANU
            </h1>
            <p className="text-stone-500 mt-4 max-w-md leading-relaxed">
                Tell us who you are, so we can show you the right experience from the start.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-lg w-full text-left">
                {[
                    { id: 'farmer', label: 'Farmer', icon: Sprout, text: 'I grow and sell produce' },
                    { id: 'customer', label: 'Customer', icon: ShoppingBasket, text: 'I want to buy fresh produce' },
                ].map(({ id, label, icon: Icon, text }) => (
                    <button
                        key={id}
                        onClick={() => setUserType(id)}
                        className={`text-left border rounded-2xl p-5 transition-colors ${userType === id ? 'border-lime-600 bg-lime-50' : 'border-stone-200 hover:border-stone-300'}`}
                    >
                        <div className="flex items-center justify-between">
                            <Icon className={`w-5 h-5 ${userType === id ? 'text-lime-700' : 'text-stone-400'}`} />
                            {userType === id && <Check className="w-4 h-4 text-lime-700" />}
                        </div>
                        <p className="font-semibold text-stone-900 mt-3">{label}</p>
                        <p className="text-xs text-stone-500 mt-1">{text}</p>
                    </button>
                ))}
            </div>

            {userType && (
                <button
                    onClick={() => setView('login')}
                    className="mt-8 inline-flex items-center gap-2 bg-lime-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-lime-700 transition-colors"
                >
                    Continue as {userType} <ChevronRight className="w-4 h-4" />
                </button>
            )}

            <button onClick={() => setView('home')} className="mt-4 text-sm text-stone-400 hover:text-stone-600 transition-colors">
                Skip for now
            </button>
        </div>
    );
}

function HomeView({ setView }) {
    return (
        <div className="px-6 md:px-10 pb-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-lime-700 uppercase mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-600" /> Farm to table, direct from Sri Lanka
                    </p>
                    <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-none">
                        RAN ASWANU
                    </h1>
                    <p className="text-stone-500 mt-5 max-w-md leading-relaxed">
                        The marketplace that connects farmers, buyers and trusted transport partners —
                        fresher harvests, fairer prices, and delivery you can actually track.
                    </p>
                    <button
                        onClick={() => setView('products')}
                        className="mt-8 inline-flex items-center gap-2 bg-lime-600 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-lime-700 transition-colors"
                    >
                        Discover <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="flex flex-wrap gap-8 mt-10">
                        {FEATURES.map(({ icon: Icon, label, text }) => (
                            <div key={label} className="flex items-start gap-3">
                                <Icon className="w-5 h-5 text-lime-700 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">{label}</p>
                                    <p className="text-xs text-stone-500">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative h-72 md:h-96 overflow-hidden">
                    <HarvestPhoto />
                </div>
            </div>

            <div className="mt-14 reveal">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg font-bold text-stone-900">Today's fresh picks</h2>
                    <button onClick={() => setView('products')} className="text-xs font-semibold text-lime-700 hover:text-lime-800 transition-colors flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {PRODUCTS.slice(0, 3).map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </div>
    );
}

function AboutView({ setView, userType }) {
    return (
        <div className="px-6 md:px-10 pb-12 pt-2">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to home
            </button>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-1">About Ran Aswanu</h1>
            <p className="text-lime-700 text-sm font-medium mb-6">Ran Aswanu — "golden harvest," built for Sri Lanka's farms</p>

            <div className="max-w-2xl space-y-4 text-stone-600 leading-relaxed">
                <p>
                    Ran Aswanu is a marketplace that puts farmers, buyers and transport providers
                    on the same platform. Farmers list what they've grown, buyers order directly,
                    and verified transporters handle delivery — no middlemen, no guesswork on price.
                </p>
                <p>
                    Every listing shows the farmer's name and region, so buyers know exactly where
                    their food comes from, and farmers get paid a fairer share for their harvest.
                </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
                <div className="border border-stone-200 rounded-2xl p-4">
                    <Sprout className="w-5 h-5 text-lime-700 mb-2" />
                    <p className="font-semibold text-sm text-stone-900">For Farmers</p>
                    <p className="text-xs text-stone-500 mt-1">List produce, set your own price, get paid fast.</p>
                </div>
                <div className="border border-stone-200 rounded-2xl p-4">
                    <ShoppingBasket className="w-5 h-5 text-lime-700 mb-2" />
                    <p className="font-semibold text-sm text-stone-900">For Buyers</p>
                    <p className="text-xs text-stone-500 mt-1">Order fresh produce straight from the source.</p>
                </div>
                <div className="border border-stone-200 rounded-2xl p-4">
                    <Truck className="w-5 h-5 text-lime-700 mb-2" />
                    <p className="font-semibold text-sm text-stone-900">For Transporters</p>
                    <p className="text-xs text-stone-500 mt-1">Pick up delivery jobs and track every trip.</p>
                </div>
            </div>

            <div className="mt-10 max-w-2xl">
                <p className="font-semibold text-stone-900 mb-3">
                    {userType ? `You're set up as a ${userType}` : 'Not signed up yet?'}
                </p>
                <button
                    onClick={() => setView(userType ? 'login' : 'onboarding')}
                    className="inline-flex items-center gap-2 bg-lime-600 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-lime-700 transition-colors"
                >
                    {userType ? `Continue as ${userType}` : 'Get started'} <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-100 max-w-2xl flex flex-wrap gap-6 text-sm text-stone-500">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@ranaswanu.lk</span>
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +94 77 123 4567</span>
            </div>
        </div>
    );
}

function ProductsView({ searchQuery, setSearchQuery }) {
    const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
        <div className="px-6 md:px-10 pb-12 pt-2">
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">Products</h1>
            <p className="text-stone-500 text-sm mb-6">Fresh listings from farmers across Sri Lanka.</p>

            <div className="flex items-center bg-stone-100 rounded-full px-4 py-2.5 gap-2 max-w-sm mb-6 sm:hidden">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search produce..."
                    className="bg-transparent text-sm outline-none w-full"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                    <p className="font-medium">No produce matches "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try a different name, or clear the search.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            )}
        </div>
    );
}

function ChatView() {
    return (
       <ChatPage/>
    );
}

function LoginView({ setView, setIsLoggedIn }) {
    return (
        <LoginPage setIsLoggedIn={setIsLoggedIn} />
    );
}

export default function RanAswanuApp() {
    const [view, setView] = useState('onboarding');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [userType, setUserType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-stone-50 to-lime-100 overflow-x-hidden">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; }
        .reveal { animation: revealUp 0.5s ease forwards; }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <Navbar
                onMenuClick={() => setDrawerOpen(true)}
                view={view}
                setView={setView}
                isLoggedIn={isLoggedIn}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                notifOpen={notifOpen}
                setNotifOpen={setNotifOpen}
            />

            {view === 'onboarding' && <OnboardingView setView={setView} userType={userType} setUserType={setUserType} />}
            {view === 'home' && <HomeView setView={setView} />}
            {view === 'about' && <AboutView setView={setView} userType={userType} />}
            {view === 'products' && <ProductsView searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
            {view === 'chat' && <ChatView />}
            {view === 'login' && <LoginView setView={setView} setIsLoggedIn={setIsLoggedIn} />}

            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} setView={setView} isLoggedIn={isLoggedIn} />
        </div>
    );
}
