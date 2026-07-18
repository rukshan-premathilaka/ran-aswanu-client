import { useState, useRef } from "react";

// notifications prop eka witharai denna one - state eka okkoma methanama thiyenawa
function NotificationBell({ notifications }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const bellRef = useRef(null);

    const handleToggle = () => {
        if (!showNotifications && bellRef.current) {
            // Bell icon eke exact screen position eka gannawa
            const rect = bellRef.current.getBoundingClientRect();
            // left: rect.left dammama, panel eka bell eken right side ekata open wenawa
            setCoords({ top: rect.bottom + 8, left: rect.left });
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
                        width: "300px",
                        background: "white",
                        borderRadius: "16px",
                        border: "1px solid #e0e0e0",
                        padding: "16px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
                    }}
                >
                    {/* Panel header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#222",
                            paddingBottom: "10px",
                            marginBottom: "12px",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <span>Notifications</span>
                        <span
                            onClick={() => setShowNotifications(false)}
                            style={{ cursor: "pointer", color: "#888", fontSize: "14px" }}
                        >
                            ✕
                        </span>
                    </div>

                    {/* Notification list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {notifications.map((note) => (
                            <div
                                key={note.id}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    background: "#f7f7f7",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "12px",
                                    padding: "10px 12px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "26px",
                                        height: "26px",
                                        flexShrink: 0,
                                        border: "2px solid #333",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                        color: "#333",
                                    }}
                                >
                                    i
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#222" }}>
                                        {note.title}
                                    </p>
                                    <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#666", lineHeight: 1.3 }}>
                                        {note.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;