from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

app = FastAPI()

# ✅ Fixed CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Correct OpenAI v1.0+ client initialization
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    msg = data.get("message", "")

    # ✅ Correct v1.0+ completion call
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": msg}]
    )

    reply = response.choices[0].message.content
    return {"reply": reply}
