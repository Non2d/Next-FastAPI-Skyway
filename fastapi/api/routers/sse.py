from fastapi import APIRouter, Request
from db import get_db
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
import schemas.room as room_schema
import cruds.room as room_crud
from fastapi.responses import StreamingResponse
import time, json

router = APIRouter()

#Server sent eventで，1秒ごとにルームの情報を返す
@router.get("/rooms/sse", response_model=Any)
async def list_rooms(db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_rooms(db)
    print("room is " + str(room[0]))
    return "await room_crud.get_rooms(db)"

def event_stream():
    count = 0
    response = {"count": count, "members":["Tarou", "Jirou", "Saburou"]}
    while True:
        response["count"]=count
        yield f"data: {json.dumps(response)}\n\n"
        count += 1
        time.sleep(1)  # 1秒ごとにメッセージを送信

#パスオペレーション関数
@router.get("/rooms/sse2")
async def rooms_sse(request: Request):
    event_generator = event_stream()
    return StreamingResponse(event_generator, media_type="text/event-stream")