import { lazy } from "react";
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

// Settings
const UserProfileSettings = lazy(() => import("@/page/settings/UserProfileSettings.jsx"));

// Common
const ChatPage = lazy(() => import("@/page/common/ChatPage.jsx"));

const routes = [
	// ---------------- Public ----------------
	{ path: "/", label: "Welcome", group: "Public", element: Welcome },
	{ path: "/home", label: "Home", group: "Public", element: Home },
	{ path: "/product-click", label: "Product Click", group: "Public", element: ProductClick },

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

	// ---------------- Common ----------------
	{ path: "/chat", label: "Chat", group: "Common", element: ChatPage },

	// ---------------- Deliveries ----------------
	{ path: "/MatchineDeliveries", label: "Matchine Deliveries", group: "Deliveries", element: MatchingDeliveriesPage },
	{ path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage },
	{ path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage },
];

export default routes;