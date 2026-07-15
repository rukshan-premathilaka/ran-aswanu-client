import {lazy} from "react";

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

// Common
const ChatPage = lazy(() => import("@/page/coman/ChatPage.jsx"))

/**
 * Single source of truth for every route.
 * - `path` / `element` -> consumed by <AppRoutes /> to build <Route> entries
 * - `label` / `group`  -> consumed by <DevRouteList /> to render a clickable
 *                         index page during development
 * Add a new page once here and it shows up in both places automatically.
 */
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

	// ---------------- Common ----------------
	{path: "/chat", label: "Chat", group: "Common", element: ChatPage},
];

export default routes;