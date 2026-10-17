const chat = document.getElementById("chat");

function addMessage(sender, text) {
  chat.innerHTML += `<p class="${sender}"><b>${sender}:</b> ${text}</p>`;
  chat.scrollTop = chat.scrollHeight;
}

async function chuckReply(msg) {
  try {
    // Call backend AI (your Render URL)
    const response = await fetch("https://c-h-u-c-k4-0-2.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    // Check if Render returned a server error code
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    addMessage("chuck", data.reply);
    speak(data.reply);
    playWakeSound(); // chime when Chuck replies
  } catch (err) {
    console.error(err);
    // This displays the exact error message on the screen instead of a generic one
    addMessage("chuck", `Error: ${err.message}`);
  }
}

function sendMessage() {
  const msg = document.getElementById("message").value;
  if (!msg) return;
  addMessage("user", msg);
  chuckReply(msg);
  document.getElementById("message").value = "";
}

// Hands-free continuous listening with wake word
function startVoice() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const msg = event.results[event.results.length - 1][0].transcript;
    addMessage("user", msg);

    if (msg.toLowerCase().includes("hey chuck")) {
      const command = msg.toLowerCase().replace("hey chuck", "").trim();
      chuckReply(command || "Yes Boss, I’m listening.");
    }
  };

  recognition.start();
}

// Voice output with deep male voice
function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);

  const voices = synth.getVoices();
  const preferredVoice = voices.find(v =>
    v.name.toLowerCase().includes("male") ||
    v.name.toLowerCase().includes("baritone") ||
    v.lang === "en-US"
  );
  if (preferredVoice) utter.voice = preferredVoice;

  synth.speak(utter);
}

// Play wake-up chime
function playWakeSound() {
  const audio = new Audio("wake.mp3"); // add wake.mp3 in frontend folder
  audio.play();
}
