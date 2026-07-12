import {useState} from "react";

function ChatPage({onSend}) {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");

    const chats =[
        { id:1,name:"rumesh"},
        {id:2,name:"isuru"},
        {id:3,name:"samitha"}
    ];
    const handleSend = () => {
        if (message.trim() === "") return;
        onSend(message);
        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };


    return (
        <div style={{ display: "flex", height: "100vh" }}>


            <div style={{ width: "260px", background: "#1e1e1e" }}>
                {chats.map((chat) => (

                <div className="Chat-names" onClick={()=>setSelectedChat(chat)}
                style={{ background: selectedChat?.id === chat.id ? "#333" : "transparent"}}>
                    {chat.name}
                </div>
                ))}
            </div>

            {selectedChat && (
            <div style={{ flex: 1, background: "#121212" }}>
                <h3 style={{ color: "white", padding: "10px" }}>{selectedChat.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", background: "#1e1e1e", borderRadius: "20px" }}>
                    <span style={{ color: "white", cursor: "pointer" }}>+</span>

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message"
                        style={{ flex: 1, background: "transparent", border: "none", color: "white", outline: "none" }}
                    />

                    <button onClick={handleSend} style={{ background: "#ff6b4a", border: "none", borderRadius: "50%", width: "34px", height: "34px", color: "white" }}>
                        ➤
                    </button>
                </div>
            </div>
                 )
            }
        </div>
    );
}


export default ChatPage;
