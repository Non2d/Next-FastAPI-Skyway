from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_env_variable #本当はoriginsをenvに入れろ

from routers import room
from routers import sse

app = FastAPI(docs_url="/docs", openapi_url="/openapi.json")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://vps4.nkmr.io",
    "https://vps4.nkmr.io",
    "http://localhost:7000",
    "http://localhost:8000",
    "http://localhost:9000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "FastAPI is running :)"}

# そのうちforで書いたりしよう
app.include_router(room.router)
app.include_router(sse.router)