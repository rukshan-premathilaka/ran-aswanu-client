import {lazy} from "react";
import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";


// Auth pages
const Login = lazy(() => import("@/page/auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("@/page/auth/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(() => import("@/page/auth/ForgotPasswordPage.jsx"));
const ResetPasswordPage = lazy(() => import("@/page/auth/ResetPassword.jsx"));

// Public pages
const Welcome = lazy(() => import("@/page/public/welcome.jsx"));
const Home = lazy(() =>
	import("@/page/public/Home.jsx").then((m) => ({default: m.Home}))
);
const ProductClick = lazy(() => import("@/page/public/ProductClick.jsx"));

// Settings
const UserProfileSettings = lazy(() => import("@/page/settings/UserProfileSettings.jsx"));

// Farmer
const FarmerDashboard = lazy(() =>
	import("@/page/farmer/FarmerDashboard.jsx").then((m) => ({default: m.FarmerDashboard}))
);
const FarmerHomePage = lazy(() =>
	import("@/page/farmer/FarmerHomePage.jsx").then((m) => ({default: m.FarmerHomePage}))
);
const FarmerAddHarvestPage = lazy(() =>
	import("@/page/farmer/FarmerAddHarvestPage.jsx").then((m) => ({default: m.FarmerAddHarvestPage}))
);
const FarmerManageHarvestPage = lazy(() =>
	import("@/page/farmer/FarmerManageHarvestPage.jsx").then((m) => ({default: m.FarmerManageHarvestPage}))
);
const FarmerCropManagementPage = lazy(() =>
	import("@/page/farmer/FarmerCropManagementPage.jsx").then((m) => ({default: m.FarmerCropManagementPage}))
);
const CalendarPage = lazy(() =>
	import("@/page/farmer/FarmerCalenderPage.jsx").then((m) => ({default: m.CalendarPage}))
);
const FarmerWeatherPage = lazy(() =>
	import("@/page/farmer/FarmerWeatherPage.jsx").then((m) => ({default: m.FarmerWeatherPage}))
);
const FarmerSettingsPage = lazy(() =>
	import("@/page/farmer/FarmerSettingsPage.jsx").then((m) => ({default: m.FarmerSettingsPage}))
);
const FarmerHelpSupportPage = lazy(() =>
	import("@/page/farmer/FarmerHelpSupportPage.jsx").then((m) => ({default: m.FarmerHelpSupportPage}))
);

// Common
const ChatPage = lazy(() => import("@/page/common/ChatPage.jsx"))

const routes = [
	// ---------------- Public ----------------
	{path: "/", label: "Welcome", group: "Public", element: Welcome},
	{path: "/home", label: "Home", group: "Public", element: Home},
	{path: "/product-click", label: "Product Click", group: "Public", element: ProductClick},

	// ---------------- Auth ----------------
	{path: "/register", label: "Register", group: "Auth", element: RegisterPage},
	{path: "/login", label: "Login", group: "Auth", element: Login},
	{path: "/forgot-password", label: "Forgot Password", group: "Auth", element: ForgotPasswordPage},
	{path: "/reset-password", label: "Reset Password", group: "Auth", element: ResetPasswordPage},

	// ---------------- Settings ----------------
	{path: "/user-setting", label: "User Profile Settings", group: "Settings", element: UserProfileSettings},

	// ---------------- Farmer ----------------
	{path: "/farmer-dashboard", label: "Farmer Dashboard", group: "Farmer", element: FarmerDashboard},
	{path: "/farmer-home", label: "Farmer Home", group: "Farmer", element: FarmerHomePage},
	{path: "/farmer-add-harvest", label: "Add Harvest", group: "Farmer", element: FarmerAddHarvestPage},
	{path: "/farmer-manage-harvest", label: "Manage Harvest", group: "Farmer", element: FarmerManageHarvestPage},
	{path: "/farmer-crop-management", label: "Crop Management", group: "Farmer", element: FarmerCropManagementPage},
	{path: "/farmer-calendar", label: "Calendar", group: "Farmer", element: CalendarPage},
	{path: "/farmer-weather", label: "Weather", group: "Farmer", element: FarmerWeatherPage},
	{path: "/farmer-settings", label: "Farmer Settings", group: "Farmer", element: FarmerSettingsPage},
	{path: "/farmer-help", label: "Help & Support", group: "Farmer", element: FarmerHelpSupportPage},

	// ---------------- Common ----------------
	{path: "/chat", label: "Chat", group: "Common", element: ChatPage},

	// ---------------- Deliveries ----------------
	{path: "/MatchineDeliveries", label: "Matchine Deliveries", group: "Deliveries", element: MatchingDeliveriesPage},
	{path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage},
	{path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage},

];

export default routes;



/*
<BrowserRouter>
	<Routes>
		<Route path="/" element={<Navigate to="/dashboard" replace />} />

		<Route path="/dashboard" element={<DashboardLayout />}>
			<Route index element={<FarmerHomePage />} />
			<Route path="add-harvest" element={<FarmerAddHarvestPage />} />
			<Route path="manage-harvest" element={<FarmerManageHarvestPage />} />
			<Route path="crop-management" element={<FarmerCropManagementPage />} />
			<Route path="calendar" element={<CalendarPage />} />
			<Route path="weather" element={<FarmerWeatherPage />} />

			{/!* New Routes for Settings and Help *!/}
			<Route path="settings" element={<FarmerSettingsPage />} />
			<Route path="help" element={<FarmerHelpSupportPage />} />
		</Route>
	</Routes>
</BrowserRouter>*/



