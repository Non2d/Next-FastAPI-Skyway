from typing import List
import schemas.room as room_schema #import api.schemas.roomだとエラーになる

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

import cruds.room as room_crud
from db import get_db

router = APIRouter()


@router.get("/rooms", response_model=List[room_schema.Room])
async def list_rooms(db: AsyncSession = Depends(get_db)):
    return await room_crud.get_rooms(db)

@router.post("/rooms", response_model=room_schema.RoomCreateResponse)
async def create_room(
    room_body: room_schema.RoomCreate, db: AsyncSession = Depends(get_db)
):
    return await room_crud.create_room(db, room_body)
# awaitを忘れると，文法は問題ないがroom_crud.create_room(db, room_body) の応答を待たずにレスポンスを返してしまい，エラーになる

@router.put("/rooms/{room_id}", response_model=room_schema.RoomCreateResponse)
async def update_room(
    room_id: int, room_body: room_schema.RoomCreate, db: AsyncSession = Depends(get_db)
):
    room = await room_crud.get_room(db, room_id=room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return await room_crud.update_room(db, room_body, original=room)


@router.delete("/rooms/{room_id}", response_model=None)
async def delete_room(room_id: int, db: AsyncSession = Depends(get_db)):
    room = await room_crud.get_room(db, room_id=room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="room not found")
    
    return await room_crud.delete_room(db, original=room)