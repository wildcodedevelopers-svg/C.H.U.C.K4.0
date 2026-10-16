from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# Load your OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

class UserQuery(BaseModel):
    message: str

@app.post("/ask")
async def ask_chuck(query: UserQuery):
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": query.message}]
    )
    reply = completion.choices[0].message["content"]
    return {"reply": f"Yes Boss, {reply}"}
