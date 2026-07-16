import { useState, useRef } from "react";
import NotificationBell from "./NotificationBell.jsx";

<NotificationBell notifications={notifications} />


// notifications prop eka witharai denna one - state eka okkoma methanama thiyenawa
function NotificationBell({ notifications }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const bellRef = useRef(null);

    const handleToggle = () => {
        if (!showNotifications && bellRef.current) {
            // Bell icon eke exact screen position eka gannawa
            const rect = bellRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + 8, left: rect.right - 280 });
        }
        setShowNotifications(!showNotifications);
    };

    return (
        <div style={{ display: "inline-block" }}>
      <span ref={bellRef} onClick={handleToggle} style={{ cursor: "pointer", fontSize: "20px" }}>
        🔔
      </span>

            {showNotifications && (
                <div
                    style={{
                        position: "fixed", // "fixed" eken parent eke overflow eken clip wenne naa
                        top: coords.top,
                        left: coords.left,
                        zIndex: 1000,
                    }}
                >
                    <NotificationPanel
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default NotificationBell;