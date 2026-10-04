import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/ApiService.js";
import ENDPOINTS from "@/api/endpoints.js";
import { getApiError } from "@/api/Apierror.js";
import { createChatClient, subscribeToNotifications, closeChatClient } from "@/api/chatsocket.js";
import NotificationPanel from "@/component/NotificationPanel.jsx";

const PANEL_WIDTH = 320;

function NotificationBell({ onNewNotification }) {
    const navigate = useNavigate();
    const bellRef = useRef(null);
    const notificationClientRef = useRef(null);
    const onNewNotificationRef = useRef(onNewNotification);

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    useEffect(() => {
        onNewNotificationRef.current = onNewNotification;
    }, [onNewNotification]);

    const loadNotifications = async (showSpinner = true) => {
        if (showSpinner) setIsLoading(true);
        try {
            const data = await api.call(ENDPOINTS.NOTIFICATIONS.LIST_MINE);
            setNotifications(Array.isArray(data) ? data : []);
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

    useEffect(() => {
        loadNotifications();
        const timer = setInterval(() => loadNotifications(false), 30000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    useEffect(() => {
        let client = null;
        let subscription = null;
        let cancelled = false;

        const connect = async () => {
            if (!localStorage.getItem("my_app_token")) return;
            try {
                const me = await api.call(ENDPOINTS.ME.GET_PROFILE);
                if (cancelled || !me?.userId) return;

                client = createChatClient({
                    onConnected: () => {
                        if (cancelled) return;
                        subscription = subscribeToNotifications(client, me.userId, (notification) => {
                            setNotifications((prev) => {
                                if (notification?.notificationId && prev.some((item) => item.notificationId === notification.notificationId)) {
                                    return prev;
                                }
                                return notification ? [notification, ...prev] : prev;
                            });
                            onNewNotificationRef.current?.(notification);
                        });
                    },
                    onError: () => {
                        // REST polling remains the fallback when live notifications cannot connect.
                    },
                });
                notificationClientRef.current = client;
            } catch (error) {
                const err = getApiError(error);
                if (err.status === 401) {
                    localStorage.removeItem("my_app_token");
                    navigate("/login");
                }
            }
        };

        connect();
        return () => {
            cancelled = true;
            if (subscription) subscription.unsubscribe();
            closeChatClient(notificationClientRef.current);
            notificationClientRef.current = null;
        };
    }, [navigate]);

    const handleToggle = () => {
        if (!isOpen && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            const maxLeft = window.innerWidth - PANEL_WIDTH - 16;
            setCoords({ top: rect.bottom + 8, left: Math.max(16, Math.min(rect.left, maxLeft)) });
        }
        setIsOpen((value) => !value);
    };

    const handleMarkRead = async (notificationId) => {
        try {
            await api.call(ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
            setNotifications((prev) => prev.map((n) => n.notificationId === notificationId ? { ...n, isRead: true } : n));
        } catch (error) {
            setErrorText(getApiError(error).message);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="inline-block">
            <button ref={bellRef} onClick={handleToggle} className="relative text-xl cursor-pointer" aria-label="Notifications">
                🔔
                {unreadCount > 0 && <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="fixed z-50" style={{ top: coords.top, left: coords.left }}>
                    <NotificationPanel notifications={notifications} isLoading={isLoading} errorText={errorText} onMarkRead={handleMarkRead} onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
