import { useEffect, useState } from "react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { fileUrl } from "@/api/fileUrl.js";

// >>> Personal profile page path (BuyerProfilePage route in Routes.config.js). Home and Products both read it from this one place. <<<
export const PERSONAL_PROFILE_PATH = "/buyer-profile";

// Who is logged in? Visitors (no token) never call the backend.
// Returns { isLoggedIn, username, picture }.
export function useCurrentUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("my_app_token")));
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("my_app_token")) return;
        let cancelled = false;
        const loadMe = async () => {
            try {
                const data = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (!cancelled) setMe(data);
            } catch (error) {
                // Expired or invalid login -> treat as a visitor
                if (error?.response?.status === 401) {
                    localStorage.removeItem("my_app_token");
                    if (!cancelled) setIsLoggedIn(false);
                }
            }
        };
        loadMe();
        return () => {
            cancelled = true;
        };
    }, []);

    return {
        isLoggedIn,
        username: me?.username ?? "",
        picture: fileUrl(me?.profilePictureUrl),
    };
}