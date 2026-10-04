import { useEffect, useState } from "react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { fileUrl } from "@/api/fileUrl.js";
import { onAuthChanged } from "@/utils/authModal.js";

// >>> Personal profile page path (BuyerProfilePage route in Routes.config.js). Home and Products both read it from this one place. <<<
export const PERSONAL_PROFILE_PATH = "/buyer-profile";

// Who is logged in? Visitors (no token) never call the backend.
// Returns { isLoggedIn, username, picture }.
export function useCurrentUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("my_app_token")));
    const [me, setMe] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    // The login / sign-up popup finished: pick up the new token and load the user
    useEffect(
        () =>
            onAuthChanged(() => {
                setIsLoggedIn(Boolean(localStorage.getItem("my_app_token")));
                setMe(null);
                setReloadKey((k) => k + 1);
            }),
        []
    );

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
    }, [reloadKey]);

    return {
        isLoggedIn,
        username: me?.username ?? "",
        picture: fileUrl(me?.profilePictureUrl),
    };
}