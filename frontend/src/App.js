import axios from "axios";
import React, { useState } from "react";

function App() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true);
        setReply(""); 

        try {
            const response = await axios.post("http://localhost:5000/chat", { message }, {
                headers: { "Content-Type": "application/json" }
            });

            
            setReply(response.data.reply || response.data); 
        } catch (error) {
            setReply("🔥 Error: The roast bot took a break. Try again later! 🔥");
        }

        setLoading(false);
    };

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial, sans-serif" }}>
            <h1>🔥 Roast Bot 🔥</h1>
            <input
                type="text"
                placeholder="Say something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ padding: "10px", fontSize: "16px", width: "300px" }}
            />
            <button
                onClick={sendMessage}
                style={{ marginLeft: "10px", padding: "10px", fontSize: "16px", cursor: "pointer" }}
                disabled={loading} // Disable button while loading
            >
                {loading ? "Roasting..." : "Roast Me!"}
            </button>
            <h3>Bot's Response:</h3>
            {loading ? <p>🔥 Cooking up a burn... 🔥</p> : <p style={{ fontWeight: "bold" }}>{reply}</p>}
        </div>
    );
}

export default App;
