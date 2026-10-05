import MessageBox from "@/component/MessageBox.jsx";

// "5 min ago", "2 h ago", "3 d ago"; older than a week shows the date.
function timeAgo(isoString) {
    if (!isoString) return "";
    const then = new Date(isoString);
    if (Number.isNaN(then.getTime())) return "";
    const minutes = Math.floor((Date.now() - then.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d ago`;
    return then.toLocaleDateString();
}

// . NotificationBell loads the data and decides  on click.
function NotificationPanel({ notifications, isLoading, errorText, onMarkRead, onClose }) {
    return (
        <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-lg p-4">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
                    ✕
                </button>
            </div>

            {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
            {!isLoading && errorText && <MessageBox type="error" text={errorText} />}
            {!isLoading && !errorText && notifications.length === 0 && (
                <p className="text-sm text-gray-500">No notifications yet.</p>
            )}

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                {notifications.map((note) => (
                    <button
                        key={note.notificationId}
                        onClick={() => !note.isRead && onMarkRead(note.notificationId)}
                        className={`text-left rounded-xl border px-3 py-2.5 ${
                            note.isRead
                                ? "bg-white border-gray-100"
                                : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                    >
                        <p className="text-sm font-semibold text-gray-800">{note.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{note.message}</p>
                        {note.createdAt && (
                            <p className="text-[11px] text-gray-400 mt-1">{timeAgo(note.createdAt)}</p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default NotificationPanel;