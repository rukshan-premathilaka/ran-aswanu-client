import { useEffect, useRef, useState } from "react";

const MAX_LENGTH = 1000;

function ChatWindow({
    chat,
    messages,
    myUserId,
    canSend,
    connectionStatus = "Connecting…",
    errorText = "",
    onBack,
    onSend,
    onOpenProfile,
}) {
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);
    const otherName = chat?.otherUserName ?? "Unknown user";

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const handleSend = () => {
        const text = input.trim();
        if (!text || !canSend) return;
        onSend(text);
        setInput("");
    };

    return (
        <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
            <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-3 sm:gap-3 sm:px-5">
                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-lg px-2 py-2 text-lg text-slate-600 hover:bg-slate-100 md:hidden"
                    aria-label="Back to chats"
                >
                    ←
                </button>
                <button
                    type="button"
                    onClick={onOpenProfile}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                        {otherName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{otherName}</p>
                        <p className={`text-[11px] ${canSend ? "text-green-600" : "text-amber-600"}`}>
                            {connectionStatus}
                        </p>
                    </div>
                </button>
                <button
                    type="button"
                    onClick={onOpenProfile}
                    className="hidden rounded-lg px-2 py-2 text-slate-500 hover:bg-slate-100 sm:block"
                    aria-label="Open contact info"
                >
                    ⋮
                </button>
            </div>

            {errorText && (
                <div className="shrink-0 border-b border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700 sm:px-5">
                    {errorText}
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-6">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-2">
                    {messages.length === 0 && (
                        <p className="mt-6 text-center text-sm text-slate-500">No messages yet. Say hello.</p>
                    )}

                    {messages.map((msg) => {
                        const isMine = Number(msg.senderId) === Number(myUserId);
                        return (
                            <div key={msg.messageId} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[86%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[70%] ${
                                        isMine
                                            ? "rounded-2xl rounded-br-sm bg-green-600 text-white"
                                            : "rounded-2xl rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-3">
                <div className="mx-auto flex w-full max-w-4xl items-end gap-2">
                    <textarea
                        className="min-h-11 max-h-28 flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
                        value={input}
                        maxLength={MAX_LENGTH}
                        disabled={!canSend}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={canSend ? "Type a message…" : "Connecting to chat…"}
                        rows={1}
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!canSend || !input.trim()}
                        className="shrink-0 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                    >
                        Send
                    </button>
                </div>
                <p className="mx-auto mt-1.5 hidden max-w-4xl text-right text-[10px] text-slate-400 sm:block">
                    Enter to send · Shift+Enter for a new line
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
