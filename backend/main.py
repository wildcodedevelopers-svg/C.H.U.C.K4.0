from fastapi import FastAPI, Request
app = FastAPI()

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    msg = data.get("message", "")
    return {"reply": f"Yes Boss, you said: {msg}"}
