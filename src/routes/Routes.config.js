import { createElement, lazy } from "react";
import { Navigate } from "react-router-dom";
import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";
import FarmerRoutes from "@/routes/FarmerRoutes.jsx";
import BuyerProfilePage from "@/page/buyer/BuyerProfilePage.jsx";
// Auth pages
const Login = lazy(() => import("@/page/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("@/page/auth/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(() => import("@/page/auth/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("@/page/auth/ResetPassword.jsx"));

// Public pages
const Welcome = lazy(() => import("@/page/public/welcome.jsx"));
const Home = lazy(() =>
	import("@/page/public/Home.jsx").then((m) => ({ default: m.Home }))
);
const ProductClick = lazy(() => import("@/page/public/ProductClick.jsx"));
const ProductsPage = lazy(() =>
	import("@/page/public/ProductsPage.jsx").then((m) => ({ default: m.ProductsPage }))
);
const CartPage = lazy(() => import("@/page/public/CartPage.jsx"));

// Admin
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes.jsx"));

// Settings
const UserProfileSettings = lazy(() => import("@/page/settings/UserProfileSettings.jsx"));

// Common
const ChatPage = lazy(() => import("@/page/common/ChatPage.jsx"));

// "/" (what opens when the project runs) goes straight to the home page
const RedirectToHome = () => createElement(Navigate, { to: "/home", replace: true });

const routes = [
	// ---------------- Public ----------------
	{ path: "/", label: "Root (goes to Home)", group: "Public", element: RedirectToHome },
	{ path: "/welcome", label: "Welcome", group: "Public", element: Welcome }, // language page, still available here
	{ path: "/home", label: "Home", group: "Public", element: Home },
	{ path: "/products", label: "Products", group: "Public", element: ProductsPage },
	{ path: "/product/:listId", devLink: "/product/1", label: "Product Detail", group: "Public", element: ProductClick },
	{ path: "/cart", label: "Cart", group: "Public", element: CartPage },

	// ---------------- Auth ----------------
	{ path: "/register", label: "Register", group: "Auth", element: RegisterPage },
	{ path: "/login", label: "Login", group: "Auth", element: Login },
	{ path: "/forgot-password", label: "Forgot Password", group: "Auth", element: ForgotPasswordPage },
	{ path: "/reset-password", label: "Reset Password", group: "Auth", element: ResetPasswordPage },

	// ---------------- Settings ----------------
	{ path: "/user-setting", label: "User Profile Settings", group: "Settings", element: UserProfileSettings },

	// ---------------- Farmer ----------------
	{
		path: "/farmer/*",
		devLink: "/farmer/home",
		label: "Farmer Dashboard",
		group: "Farmer",
		element: FarmerRoutes,
	},

	{
		path: "/buyer-profile",
		label: "Buyer Profile",
		group: "Public",
		element: BuyerProfilePage
	},

	// ---------------- Admin ----------------
	{
		path: "/admin/*",
		devLink: "/admin",
		label: "Admin Dashboard",
		group: "Admin",
		element: AdminRoutes,
	},

	// ---------------- Common ----------------
	{ path: "/chat", label: "Chat", group: "Common", element: ChatPage },

	// ---------------- Deliveries ----------------
	{ path: "/MatchineDeliveries", label: "Matchine Deliveries", group: "Deliveries", element: MatchingDeliveriesPage },
	{ path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage },
	{ path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage },
];

export default routes;