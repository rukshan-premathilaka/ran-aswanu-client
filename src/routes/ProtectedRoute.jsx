import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "@/api/ApiService.js";

const api = new ApiService();

const roleLabel = (role) => {
    if (!role || role === "UNASSIGNED") return "No role yet";
    return role.charAt(0) + role.slice(1).toLowerCase();
};

function ProtectedRoute({ children, requiredRole = "AUTHENTICATED" }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: "",
        message: "",
        actionType: "",
    });

    useEffect(() => {
        let isMounted = true;

        const checkAuthorization = async () => {
            const token = localStorage.getItem("my_app_token");
            if (!token) {
                if (isMounted) {
                    setModalState({
                        isOpen: true,
                        title: "Access Restricted",
                        message: "You need to log in to access this page. Please log in with your credentials to continue.",
                        actionType: "LOGIN",
                    });
                    setIsChecking(false);
                }
                return;
            }

            let currentRole = localStorage.getItem("user_role");
            if (!currentRole) {
                try {
                    const me = await api.request("GET", "/me");
                    if (me?.role) {
                        currentRole = me.role;
                        localStorage.setItem("user_role", me.role);
                    }
                } catch {
                    localStorage.removeItem("my_app_token");
                    localStorage.removeItem("user_role");
                    localStorage.removeItem("user");
                    if (isMounted) {
                        setModalState({
                            isOpen: true,
                            title: "Session Expired",
                            message: "Your session has expired. Please log in again to continue.",
                            actionType: "LOGIN",
                        });
                        setIsChecking(false);
                    }
                    return;
                }
            }

            if (location.pathname === "/buyer-profile" || requiredRole === "AUTHENTICATED") {
                if (isMounted) setIsChecking(false);
                return;
            }

            if (requiredRole && currentRole !== requiredRole) {
                const requiredLabel = roleLabel(requiredRole);
                const message = requiredRole === "FARMER"
                    ? "Your account is currently not in Farmer mode. Please switch to Farmer mode from your profile to access the Farmer Dashboard."
                    : `This page is available to ${requiredLabel} accounts. Please switch your account role from your profile to continue.`;

                if (isMounted) {
                    setModalState({
                        isOpen: true,
                        title: `${requiredLabel} Access Only`,
                        message,
                        actionType: "SWITCH_ROLE",
                    });
                    setIsChecking(false);
                }
                return;
            }

            if (isMounted) setIsChecking(false);
        };

        checkAuthorization();
        return () => {
            isMounted = false;
        };
    }, [location.pathname, requiredRole]);

    const handleAction = () => {
        setModalState({ isOpen: false, title: "", message: "", actionType: "" });
        if (modalState.actionType === "LOGIN") {
            navigate("/login", { state: { from: location }, replace: true });
        } else if (modalState.actionType === "SWITCH_ROLE") {
            navigate("/buyer-profile", { replace: true });
        }
    };

    const handleBackHome = () => {
        setModalState({ isOpen: false, title: "", message: "", actionType: "" });
        navigate("/home", { replace: true });
    };

    if (isChecking) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            </div>
        );
    }

    if (modalState.isOpen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-lg">!</div>
                        <h3 className="text-lg font-bold text-gray-800">{modalState.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 mb-6">{modalState.message}</p>
                    <div className="flex flex-col sm:flex-row justify-end gap-2.5">
                        <button type="button" onClick={handleBackHome} className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition cursor-pointer">
                            Back to Home
                        </button>
                        <button type="button" onClick={handleAction} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-sm transition cursor-pointer">
                            {modalState.actionType === "LOGIN" ? "Go to Login" : "Go to Profile"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;
