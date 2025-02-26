require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
const API_TOKEN = process.env.HUGGING_FACE_API_KEY;

if (!API_TOKEN) {
    console.error("🚨 ERROR: Hugging Face API key is missing! Check your .env file.");
    process.exit(1);
}

// Savage backup roasts (for when AI fails to deliver 🔥)
const savageRoasts = [
    "You're like a software update… whenever you appear, everyone sighs. 😮‍💨",
    "I'd explain it to you, but I left my crayons at home. 🖍️",
    "You're like a WiFi signal with one bar—weak and barely useful. 📶",
    "Your jokes are like expired milk—nobody enjoys them. 🥛🤢",
    "If common sense were currency, you'd be bankrupt. 💸",
    "You're the human equivalent of autocorrect—always wrong at the worst time. 📱❌",
    "I’d agree with you, but then we’d both be wrong. 🤡",
    "You're proof that even evolution takes a few wrong turns. 😂"
];

app.post("/chat", async (req, res) => {
    const userInput = req.body.message;
    console.log(`💬 User Input: ${userInput}`);

    const roastPrompt = `You are a savage AI roast bot. No matter what the user says, always respond with a brutal, sarcastic insult. Be witty, clever, and absolutely ruthless.
User: "${userInput}"
RoastBot:`;

    try {
        const response = await axios.post(
            API_URL,
            { inputs: roastPrompt },
            { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );

        console.log("🤖 Full API Response:", JSON.stringify(response.data, null, 2));

        let botReply = response.data[0]?.generated_text || response.data?.generated_text || "";

        // ✅ Extract just the roast using regex
      // Extract just the roast text
let match = botReply.match(/RoastBot:\s*"(.*?)"/i);
botReply = match ? match[1].trim() : botReply;

// Remove anything after the roast, including "User" at the end
botReply = botReply.split("\nUser")[0].trim();


        if (!botReply || botReply.length < 5) {
            console.warn("⚠️ Weak AI response, using a backup roast.");
            botReply = savageRoasts[Math.floor(Math.random() * savageRoasts.length)];
        }

        res.json({ reply: botReply });
    } catch (error) {
        console.error("🚨 API Error:", error.response ? error.response.data : error.message);
        res.json({ reply: "I’d roast you, but it looks like life already did. 🔥" });
    }
});




app.listen(PORT, () => console.log(`🔥 RoastBot is firing insults on port ${PORT} 🔥`));
