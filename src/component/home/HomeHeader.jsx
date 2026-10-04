import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/farmerImg/logo.png";
import { PERSONAL_PROFILE_PATH } from "@/utils/useCurrentUser.js";
import { BRAND_NAME } from "./homeConfig.js";
import { scrollToId } from "./homeUtils.js";
import { PrimaryButton, SecondaryButton } from "./Buttons.jsx";

// Main links. "Products" opens the products view on Home (same as before), the others scroll to a section.
const NAV_LINKS = [
    { label: "Home", action: "top" },
    { label: "Products", action: "products" },
    { label: "How It Works", action: "scroll", target: "how-it-works" },
    { label: "Features", action: "scroll", target: "features" },
];
// Same extra pages the old side panel had.
const MEMBER_LINKS = [
    { label: "Chat", path: "/chat" },
    { label: "Delivery", path: "/delivery/matches" },
];

function ProfileChip({ username, picture, onClick }) {
    return (
        <Link
            to={PERSONAL_PROFILE_PATH}
            onClick={onClick}
            className="flex items-center gap-2.5 rounded-full px-3 py-2 text-base font-medium text-slate-700 hover:bg-green-50 transition-colors"
        >
            {picture ? (
                <img src={picture} alt={username || "Profile"} className="w-9 h-9 rounded-full object-cover" />
            ) : (
                <span className="w-9 h-9 rounded-full bg-green-100 text-green-700 text-sm font-semibold flex items-center justify-center">
                    {(username || "?").slice(0, 2).toUpperCase()}
                </span>
            )}
            {username && <span className="max-w-[10rem] truncate">{username}</span>}
        </Link>
    );
}

export default function HomeHeader({ isLoggedIn, username, picture, onOpenProducts }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Sticky header gets smaller and gets a shadow after scrolling
    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    // Mobile menu: Escape closes it, and the page behind does not scroll while it is open
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
        window.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [menuOpen]);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    const handleNav = (link) => {
        closeMenu();
        if (link.action === "products") return onOpenProducts();
        if (link.action === "top") return window.scrollTo({ top: 0, behavior: "smooth" });
        if (link.action === "scroll") return scrollToId(link.target);
        return undefined;
    };

    const goTo = (path) => {
        closeMenu();
        navigate(path);
    };

    return (
        <>
            <header
                className={`stage sticky top-0 z-40 bg-white/90 backdrop-blur border-b transition-all duration-300 ${
                    scrolled ? "shadow-md border-slate-200" : "border-transparent"
                }`}
                style={{ "--d": "0ms" }}
            >
                <div
                    className={`mx-auto max-w-[1240px] px-5 sm:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
                        scrolled ? "py-2" : "py-4"
                    }`}
                >
                    <Link to="/home" className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold text-green-600 tracking-tight">
                        <img
                            src={logoImg}
                            alt={`${BRAND_NAME} logo`}
                            className={`object-contain transition-all duration-300 ${scrolled ? "w-8 h-8" : "w-10 h-10"}`}
                        />
                        {BRAND_NAME}
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
                        {NAV_LINKS.map((link) => (
                            <button
                                key={link.label}
                                type="button"
                                onClick={() => handleNav(link)}
                                className="rounded-full px-4 py-2 text-base font-medium text-slate-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                        {isLoggedIn &&
                            MEMBER_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="rounded-full px-4 py-2 text-base font-medium text-slate-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {isLoggedIn ? (
                            <ProfileChip username={username} picture={picture} />
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="btn-lift rounded-full px-5 py-2.5 text-base font-semibold text-green-800 hover:bg-green-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-lift rounded-full bg-green-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-green-700 hover:shadow-md"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                            className="lg:hidden p-2.5 rounded-xl hover:bg-green-50 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-slate-700" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile / tablet menu (slides in from the left) */}
            <div
                onClick={closeMenu}
                className={`fixed inset-0 z-50 bg-slate-900/40 transition-opacity duration-300 lg:hidden ${
                    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
            />
            <aside
                className={`fixed top-0 left-0 z-[60] h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 lg:hidden ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Menu"
                aria-hidden={!menuOpen}
                inert={!menuOpen ? true : undefined}
            >
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <span className="flex items-center gap-2.5 text-xl font-bold text-green-600">
                        <img src={logoImg} alt="" className="w-9 h-9 object-contain" />
                        {BRAND_NAME}
                    </span>
                    <button type="button" onClick={closeMenu} aria-label="Close menu" className="p-2 rounded-xl hover:bg-slate-100">
                        <X className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                <nav className="px-4 flex-1 space-y-1 overflow-y-auto" aria-label="Mobile">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            type="button"
                            onClick={() => handleNav(link)}
                            className="w-full text-left rounded-xl px-5 py-3.5 text-lg font-medium text-slate-700 hover:bg-green-50 hover:text-green-900 transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}
                    {MEMBER_LINKS.map((link) => (
                        <button
                            key={link.path}
                            type="button"
                            onClick={() => goTo(link.path)}
                            className={`w-full text-left rounded-xl px-5 py-3.5 text-lg font-medium transition-colors ${
                                pathname === link.path ? "bg-green-50 text-green-900" : "text-slate-700 hover:bg-green-50 hover:text-green-900"
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    {isLoggedIn && (
                        <button
                            type="button"
                            onClick={() => goTo(PERSONAL_PROFILE_PATH)}
                            className="w-full text-left rounded-xl px-5 py-3.5 text-lg font-medium text-slate-700 hover:bg-green-50 hover:text-green-900 transition-colors"
                        >
                            Personal Profile
                        </button>
                    )}
                </nav>

                {!isLoggedIn && (
                    <div className="p-5 border-t border-slate-100 flex flex-col gap-3">
                        <SecondaryButton to="/login" onClick={closeMenu}>Login</SecondaryButton>
                        <PrimaryButton to="/register" onClick={closeMenu}>Register</PrimaryButton>
                    </div>
                )}
            </aside>
        </>
    );
}
