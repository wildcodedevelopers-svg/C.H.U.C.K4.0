from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

app = FastAPI()

# ✅ Allow frontend (GitHub Pages) to talk to backend (Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load OpenAI client with API key from environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ✅ Root endpoint (Fixes {"detail": "Not Found"})
@app.get("/")
def home():
    return {"status": "Chuck backend is running!"}

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    msg = data.get("message", "")

    # ✅ Call OpenAI API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": msg}]
    )

    reply = response.choices[0].message.content
    return {"reply": reply}
