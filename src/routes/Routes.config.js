import { lazy } from "react";
import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";
import FarmerRoutes from "@/routes/FarmerRoutes.jsx";
import AdminRoutes from "@/routes/AdminRoutes.jsx";
import BuyerProfilePage from "@/page/buyer/BuyerProfilePage.jsx";

// Auth pages
const Login = lazy(() => import("@/page/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("@/page/auth/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(() => import("@/page/auth/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("@/page/auth/ResetPassword.jsx"));

// Public pages
const Welcome = lazy(() => import("@/page/public/welcome.jsx"));
const Home = lazy(() => import("@/page/public/Home.jsx"));
const ProductsPage = lazy(() => import("@/page/public/ProductsPage.jsx"));
const ProductClick = lazy(() => import("@/page/public/ProductClick.jsx"));
const CartPage = lazy(() => import("@/page/public/CartPage.jsx"));

// Settings
const UserProfileSettings = lazy(() => import("@/page/settings/UserProfileSettings.jsx"));

// Common
const ChatPage = lazy(() => import("@/page/common/ChatPage.jsx"));

const routes = [
	// ---------------- Public Routes ----------------
	{ path: "/", label: "Welcome", group: "Public", element: Welcome },
	{ path: "/home", label: "Home", group: "Public", element: Home },
	{ path: "/products", label: "Products", group: "Public", element: ProductsPage },
	// ProductClick reads :listId from the URL. devLink is used by the dev route list (a path with :listId cannot be clicked).
	{ path: "/product/:listId", devLink: "/products", label: "Product Details", group: "Public", element: ProductClick },
	{ path: "/cart", label: "Cart", group: "Public", element: CartPage },

	// ---------------- Auth Routes ----------------
	{ path: "/register", label: "Register", group: "Auth", element: RegisterPage },
	{ path: "/login", label: "Login", group: "Auth", element: Login },
	{ path: "/forgot-password", label: "Forgot Password", group: "Auth", element: ForgotPasswordPage },
	{ path: "/reset-password", label: "Reset Password", group: "Auth", element: ResetPasswordPage },

	// ---------------- Settings Routes ----------------
	{
		path: "/user-setting",
		label: "User Profile Settings",
		group: "Settings",
		element: UserProfileSettings,
		protectedRole: "AUTHENTICATED"
	},

	// ---------------- Farmer Routes (FARMER role only) ----------------
	{
		path: "/farmer/*",
		devLink: "/farmer/home",
		label: "Farmer Dashboard",
		group: "Farmer",
		element: FarmerRoutes,
		protectedRole: "FARMER"
	},

	// ---------------- Admin Routes (AdminGuard inside AdminRoutes checks the ADMIN role) ----------------
	{
		path: "/admin/*",
		devLink: "/admin",
		label: "Admin Dashboard",
		group: "Admin",
		element: AdminRoutes
	},

	// ---------------- Buyer Profile Route (any logged-in user) ----------------
	{
		path: "/buyer-profile",
		label: "Buyer Profile",
		group: "Buyer",
		element: BuyerProfilePage,
		protectedRole: "AUTHENTICATED"
	},

	// ---------------- Common Routes ----------------
	{
		path: "/chat",
		label: "Chat",
		group: "Common",
		element: ChatPage,
		protectedRole: "AUTHENTICATED"
	},

	// ---------------- Deliveries Routes ----------------
	{ path: "/MatchineDeliveries", label: "Matchine Deliveries", group: "Deliveries", element: MatchingDeliveriesPage },
	{ path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage },
	{ path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage },
];

export default routes;
