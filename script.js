async function chuckReply(msg) {
  try {
    const response = await fetch("https://c-h-u-c-k4-0-2.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    // If Render returns a server error (like 500 or 401), catch it here
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    addMessage("chuck", data.reply);
    speak(data.reply);
    playWakeSound(); 
  } catch (err) {
    console.error(err);
    // This will now show you the EXACT error on your chat screen
    addMessage("chuck", `Error: ${err.message}`);
  }
}
