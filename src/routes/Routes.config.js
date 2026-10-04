import { lazy } from "react";
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
const DeliveryRoutes = lazy(() => import("@/routes/DeliveryRoutes.jsx"));
const MatchingDeliveriesPage = lazy(() => import("@/page/delivery/MatchingDeliveriesPage.jsx"));
const DeliveryRequestPage = lazy(() => import("@/page/delivery/DeliveryRequestPage.jsx"));
const DeliveryTrackingPage = lazy(() => import("@/page/delivery/DeliveryTrackingPage.jsx"));

const routes = [
    // ---------------- Public Routes ----------------
    { path: "/", label: "Welcome", group: "Public", element: Welcome },
    { path: "/home", label: "Home", group: "Public", element: Home },
    { path: "/products", label: "Products", group: "Public", element: ProductsPage },
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

    // ---------------- Admin Routes ----------------
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

    // ---------------- Delivery Center ----------------
    {
        path: "/delivery/*",
        devLink: "/delivery/matches",
        label: "Delivery Center",
        group: "Deliveries",
        element: DeliveryRoutes,
        protectedRole: "AUTHENTICATED"
    },

    // Legacy URLs are retained so existing bookmarks/components keep working.
    { path: "/MatchineDeliveries", label: "Matching Deliveries", group: "Deliveries", element: MatchingDeliveriesPage, protectedRole: "AUTHENTICATED" },
    { path: "/DeliveryRequest", label: "Delivery Request", group: "Deliveries", element: DeliveryRequestPage, protectedRole: "AUTHENTICATED" },
    { path: "/DeliveryTracking", label: "Delivery Tracking", group: "Deliveries", element: DeliveryTrackingPage, protectedRole: "AUTHENTICATED" },
];

export default routes;
