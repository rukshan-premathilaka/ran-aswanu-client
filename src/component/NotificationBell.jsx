import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/apiError.js";
import NotificationPanel from "@/component/NotificationPanel.jsx";

const PANEL_WIDTH = 320;

// Loads its own notifications, so pages do not pass any data in.
function NotificationBell() {
    const navigate = useNavigate();
    const bellRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const loadNotifications = async () => {
            setIsLoading(true);
            setErrorText("");
            try {
                const data = await api.call(ENDPOINTS.NOTIFICATIONS.LIST_MINE);
                setNotifications(data);
            } catch (error) {
                const err = getApiError(error);
                if (err.status === 401) {
                    localStorage.removeItem("my_app_token");
                    navigate("/login");
                    return;
                }
                setErrorText(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadNotifications();
    }, [navigate]);

    const handleToggle = () => {
        if (!isOpen && bellRef.current) {
            // "fixed" panel is not clipped by a parent with overflow, so we need the bell's screen position
            const rect = bellRef.current.getBoundingClientRect();
            const maxLeft = window.innerWidth - PANEL_WIDTH - 16; // keep the panel inside the screen
            setCoords({ top: rect.bottom + 8, left: Math.max(16, Math.min(rect.left, maxLeft)) });
        }
        setIsOpen(!isOpen);
    };

    const handleMarkRead = async (notificationId) => {
        try {
            await api.call(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
            // Update the list only after the backend said OK (no fake success)
            setNotifications((prev) =>
                prev.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            setErrorText(getApiError(error).message);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="inline-block">
            <button ref={bellRef} onClick={handleToggle} className="relative text-xl cursor-pointer">
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed z-50" style={{ top: coords.top, left: coords.left }}>
                    <NotificationPanel
                        notifications={notifications}
                        isLoading={isLoading}
                        errorText={errorText}
                        onMarkRead={handleMarkRead}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default NotificationBell;