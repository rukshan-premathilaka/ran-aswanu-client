import { useState } from "react";

// Right side of the chat page: header, messages, input.
function ChatWindow({ chat, messages, myUserId, canSend, onSend, onOpenProfile }) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "") return;
        onSend(input.trim());
        setInput("");
    };

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <button
                onClick={onOpenProfile}
                className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-100 text-left"
            >
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center">
                    {chat.otherUserName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-800">{chat.otherUserName}</span>
            </button>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                {messages.length === 0 && (
                    <p className="text-sm text-gray-500 text-center mt-6">No messages yet. Say hello.</p>
                )}
                {messages.map((msg) => {
                    const isMine = msg.senderId === myUserId;
                    return (
                        <div key={msg.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[60%] px-3 py-2 rounded-2xl text-sm ${
                                    isMine
                                        ? "bg-green-600 text-white rounded-br-sm"
                                        : "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white border-t border-gray-100">
                <input
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message"
                />
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatWindow;