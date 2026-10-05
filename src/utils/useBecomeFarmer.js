import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";

const FARMER_DASHBOARD = "/farmer/home";

// "Become a farmer": changes the logged-in user's role to FARMER in the database
// (PUT /api/me/role) and then opens the farmer dashboard.
// status: idle | login (not logged in) | working | success | error
export function useBecomeFarmer() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const timer = useRef(null);
    const busy = useRef(false);

    useEffect(() => () => clearTimeout(timer.current), []);

    const start = useCallback(async () => {
        if (busy.current) return; // ignore a second click while the first one is running
        setMessage("");

        // Not logged in: ask the user to log in or create an account
        if (!localStorage.getItem("my_app_token")) {
            setStatus("login");
            return;
        }

        busy.current = true;
        setStatus("working");
        try {
            await api.call(ENDPOINTS.ME.UPDATE_ROLE, { role: "FARMER" });
            localStorage.setItem("user_role", "FARMER");
            setStatus("success");
            // short pause so the user can read the message (same as the buyer profile page)
            timer.current = setTimeout(() => navigate(FARMER_DASHBOARD), 800);
        } catch (error) {
            busy.current = false; // failed: the user may try again (after success it stays locked until we leave the page)
            const err = getApiError(error);
            if (err.status === 401) {
                localStorage.removeItem("my_app_token"); // token expired or invalid
                setStatus("login");
            } else {
                setMessage(err.message); // e.g. "Administrator accounts cannot change role here."
                setStatus("error");
            }
        }
    }, [navigate]);

    const close = useCallback(() => {
        if (!busy.current) setStatus("idle");
    }, []);

    return { status, message, start, close };
}

export default useBecomeFarmer;
