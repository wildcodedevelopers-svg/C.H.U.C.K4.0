
const API_URL = "https://c-h-u-c-k4-0-2.onrender.com/ask";

const chat = document.getElementById("chat");
const form = document.getElementById("messageForm");
const input = document.getElementById("message");
const statusLabel = document.getElementById("status");

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = "message " + type;
    message.textContent = text;
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
    return message;
}

async function sendMessage(text) {
    const message = (text || input.value).trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    const waiting = addMessage("Thinking...", "bot");
    statusLabel.textContent = "THINKING";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error("Server returned " + response.status);
        }

        const data = await response.json();
        waiting.textContent =
            data.reply || "I didn't receive a response.";
        statusLabel.textContent = "ONLINE";

        speakReply(waiting.textContent);
    } catch (error) {
        waiting.textContent =
            "I couldn't connect to my AI server. " +
            "Please check the internet or try again shortly.";
        statusLabel.textContent = "OFFLINE";
        console.error(error);
    }
}

function speakReply(text) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-ZA";
    utterance.rate = 1;
    utterance.pitch = 0.95;

    window.speechSynthesis.speak(utterance);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendMessage();
});
