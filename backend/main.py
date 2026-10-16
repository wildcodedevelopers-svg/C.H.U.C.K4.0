from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# Initialize the OpenAI client with your environment variable
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class UserQuery(BaseModel):
    message: str

@app.post("/ask")
async def ask_chuck(query: UserQuery):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": query.message}]
    )
    reply = response.choices[0].message.content
    return {"reply": f"Yes Boss, {reply}"}
