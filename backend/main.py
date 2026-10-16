from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

# ✅ Allow frontend (GitHub Pages) to talk to backend (Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 Load your OpenAI API key from Render environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    msg = data.get("message", "")

    # ✅ Call OpenAI to generate a reply
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",   # or "gpt-4" if enabled
        messages=[{"role": "user", "content": msg}]
    )

    reply = response["choices"][0]["message"]["content"]
    return {"reply": reply}
