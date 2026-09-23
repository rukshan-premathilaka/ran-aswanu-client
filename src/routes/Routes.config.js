import { lazy } from "react";

// ============================================================
// Delivery Pages
// ============================================================

import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";

// ============================================================
// Farmer Layout
// ============================================================

import FarmerDashboardLayout from "@/layouts/FarmerDashboard.jsx";

// ============================================================
// Farmer Pages
// ============================================================

import FarmerHomePage from "@/page/farmer/FarmerHomePage.jsx";
import FarmerAddHarvestPage from "@/page/farmer/FarmerAddHarvestPage.jsx";
import FarmerManageHarvestPage from "@/page/farmer/FarmerManageHarvestPage.jsx";
import FarmerCropManagementPage from "@/page/farmer/FarmerCropManagementPage.jsx";
import CalendarPage from "@/page/farmer/FarmerCalenderPage.jsx";
import FarmerWeatherPage from "@/page/farmer/FarmerWeatherPage.jsx";
import FarmerSettingsPage from "@/page/farmer/FarmerSettingsPage.jsx";
import FarmerHelpSupportPage from "@/page/farmer/FarmerHelpSupportPage.jsx";

// ============================================================
// Auth Pages
// ============================================================

const Login = lazy(() =>
	import("@/page/auth/LoginPage.jsx")
);

const RegisterPage = lazy(() =>
	import("@/page/auth/RegisterPage.jsx")
);

const ForgotPasswordPage = lazy(() =>
	import("@/page/auth/ForgotPasswordPage.jsx")
);

const ResetPasswordPage = lazy(() =>
	import("@/page/auth/ResetPassword.jsx")
);

// ============================================================
// Public Pages
// ============================================================

const Welcome = lazy(() =>
	import("@/page/public/welcome.jsx")
);

const Home = lazy(() =>
	import("@/page/public/Home.jsx").then((module) => ({
		default: module.Home,
	}))
);

const ProductClick = lazy(() =>
	import("@/page/public/ProductClick.jsx")
);

// ============================================================
// Settings Pages
// ============================================================

const UserProfileSettings = lazy(() =>
	import("@/page/settings/UserProfileSettings.jsx")
);

// ============================================================
// Common Pages
// ============================================================

const ChatPage = lazy(() =>
	import("@/page/common/ChatPage.jsx")
);


// ============================================================
// PUBLIC ROUTES
// ============================================================

const publicRoutes = [
	{
		path: "/",
		label: "Welcome",
		group: "Public",
		element: Welcome,
	},
	{
		path: "/home",
		label: "Home",
		group: "Public",
		element: Home,
	},
	{
		path: "/product-click",
		label: "Product Click",
		group: "Public",
		element: ProductClick,
	},
];


// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

const authRoutes = [
	{
		path: "/register",
		label: "Register",
		group: "Auth",
		element: RegisterPage,
	},
	{
		path: "/login",
		label: "Login",
		group: "Auth",
		element: Login,
	},
	{
		path: "/forgot-password",
		label: "Forgot Password",
		group: "Auth",
		element: ForgotPasswordPage,
	},
	{
		path: "/reset-password",
		label: "Reset Password",
		group: "Auth",
		element: ResetPasswordPage,
	},
];


// ============================================================
// SETTINGS ROUTES
// ============================================================

const settingsRoutes = [
	{
		path: "/user-setting",
		label: "User Profile Settings",
		group: "Settings",
		element: UserProfileSettings,
	},
];


// ============================================================
// FARMER ROUTES
// ============================================================
//
// Farmer has its own layout and nested pages.
// Keep these routes nested under /dashboard.
//

const farmerRoutes = [
	{
		path: "/dashboard",
		label: "Farmer Dashboard",
		group: "Farmer",
		element: FarmerDashboardLayout,

		children: [
			{
				index: true,
				label: "Farmer Home",
				element: FarmerHomePage,
			},
			{
				path: "add-harvest",
				label: "Add Harvest",
				element: FarmerAddHarvestPage,
			},
			{
				path: "manage-harvest",
				label: "Manage Harvest",
				element: FarmerManageHarvestPage,
			},
			{
				path: "crop-management",
				label: "Crop Management",
				element: FarmerCropManagementPage,
			},
			{
				path: "calendar",
				label: "Calendar",
				element: CalendarPage,
			},
			{
				path: "weather",
				label: "Weather",
				element: FarmerWeatherPage,
			},
			{
				path: "settings",
				label: "Settings",
				element: FarmerSettingsPage,
			},
			{
				path: "help",
				label: "Help & Support",
				element: FarmerHelpSupportPage,
			},
		],
	},
];


// ============================================================
// COMMON ROUTES
// ============================================================

const commonRoutes = [
	{
		path: "/chat",
		label: "Chat",
		group: "Common",
		element: ChatPage,
	},
];


// ============================================================
// DELIVERY ROUTES
// ============================================================

const deliveryRoutes = [
	{
		path: "/MatchineDeliveries",
		label: "Matching Deliveries",
		group: "Deliveries",
		element: MatchingDeliveriesPage,
	},
	{
		path: "/DeliveryRequest",
		label: "Delivery Request",
		group: "Deliveries",
		element: DeliveryRequestPage,
	},
	{
		path: "/DeliveryTracking",
		label: "Delivery Tracking",
		group: "Deliveries",
		element: DeliveryTrackingPage,
	},
];


// ============================================================
// ALL APPLICATION ROUTES
// ============================================================

const routes = [
	...publicRoutes,
	...authRoutes,
	...settingsRoutes,
	...farmerRoutes,
	...commonRoutes,
	...deliveryRoutes,
];

export default routes;