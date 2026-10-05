import { useEffect, useState } from "react";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { fileUrl } from "@/api/fileurl.js";
import { normalizeRoles, syncRoleStorage, clearRoleStorage } from "@/utils/roleUtils.js";

export const PERSONAL_PROFILE_PATH = "/buyer-profile";

// Returns the current profile plus normalized multi-role information.
export function useCurrentUser() {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("my_app_token")));
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("my_app_token")) return;
        let cancelled = false;
        const loadMe = async () => {
            try {
                const data = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (!cancelled) {
                    setMe(data);
                    syncRoleStorage(data);
                }
            } catch (error) {
                if (error?.response?.status === 401) {
                    localStorage.removeItem("my_app_token");
                    clearRoleStorage();
                    localStorage.removeItem("user");
                    if (!cancelled) {
                        setMe(null);
                        setIsLoggedIn(false);
                    }
                }
            }
        };
        loadMe();
        return () => { cancelled = true; };
    }, []);

    const roles = normalizeRoles(me);

    return {
        isLoggedIn,
        me,
        username: me?.username ?? "",
        role: me?.role ?? roles[0] ?? "",
        roles,
        picture: fileUrl(me?.profilePictureUrl),
    };
}
