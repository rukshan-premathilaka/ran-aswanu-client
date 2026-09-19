import { lazy } from "react";
import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";

// Farmer Layout
import FarmerDashboardLayout from "@/layouts/FarmerDashboard.jsx";

// Farmer Pages
import FarmerHomePage from "@/page/farmer/FarmerHomePage.jsx";
import FarmerAddHarvestPage from "@/page/farmer/FarmerAddHarvestPage.jsx";
import FarmerManageHarvestPage from "@/page/farmer/FarmerManageHarvestPage.jsx";
import FarmerCropManagementPage from "@/page/farmer/FarmerCropManagementPage.jsx";
import CalendarPage from "@/page/farmer/FarmerCalenderPage.jsx";
import FarmerWeatherPage from "@/page/farmer/FarmerWeatherPage.jsx";
import FarmerSettingsPage from "@/page/farmer/FarmerSettingsPage.jsx";
import FarmerHelpSupportPage from "@/page/farmer/FarmerHelpSupportPage.jsx";

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
		path: "/dashboard",
		label: "Farmer Dashboard",
		group: "Farmer",
		element: FarmerDashboardLayout,
		children: [
			{ index: true, label: "Farmer Home", element: FarmerHomePage },
			{ path: "add-harvest", label: "Add Harvest", element: FarmerAddHarvestPage },
			{ path: "manage-harvest", label: "Manage Harvest", element: FarmerManageHarvestPage },
			{ path: "crop-management", label: "Crop Management", element: FarmerCropManagementPage },
			{ path: "calendar", label: "Calendar", element: CalendarPage },
			{ path: "weather", label: "Weather", element: FarmerWeatherPage },
			{ path: "settings", label: "Settings", element: FarmerSettingsPage },
			{ path: "help", label: "Help & Support", element: FarmerHelpSupportPage }
		]
	},

	// ---------------- Common ----------------
	{ path: "/chat", label: "Chat", group: "Common", element: ChatPage },

	// ---------------- Deliveries ----------------
	{ path: "/MatchineDeliveries", label: "Matchine Deliveries", group: "Deliveries", element: MatchingDeliveriesPage },
	{ path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage },
	{ path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage },
];

export default routes;