from fastapi import APIRouter
from db import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
import schemas.room as room_schema
import cruds.room as room_crud
from fastapi import Request

from starlette.requests import Request
from starlette.responses import StreamingResponse
import time

router = APIRouter()

#Server sent eventで，1秒ごとにルームの情報を返す
@router.get("/rooms/sse", response_model=Any)
async def list_rooms(db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_rooms(db)
    print("room is " + str(room[0]))
    return "await room_crud.get_rooms(db)"

def event_stream():
    count = 0
    while True:
        yield f"data: {count}\n\n"
        count += 1
        time.sleep(1)  # 1秒ごとにメッセージを送信

@router.get("/rooms/sse2")
async def rooms_sse(request: Request):
    event_generator = event_stream()
    return StreamingResponse(event_generator, media_type="text/event-stream")