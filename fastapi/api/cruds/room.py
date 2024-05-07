from typing import List, Tuple, Optional

from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


import models.room as room_model
import schemas.room as room_schema


async def create_room(
    db: AsyncSession, room_create: room_schema.RoomCreate
) -> room_model.Room:
    room = room_model.Room(**room_create.dict())
    db.add(room)
    await db.commit()
    await db.refresh(room)
    return room

async def get_rooms(db: AsyncSession) -> List[Tuple[int, str, bool]]:
    result: Result = await(
        db.execute(
            select(
                room_model.Room.id,
                room_model.Room.title
            )
        )
    )
    return result.all()

# updateの際にそもそもidのroomが存在するか確認．実質check_roomとかroom_isExist
async def get_room(db: AsyncSession, room_id: int) -> Optional[room_model.Room]:
    result: Result = await db.execute(
        select(room_model.Room).filter(room_model.Room.id == room_id)
        )
    room: Optional[Tuple[room_model.Room]] = result.first()
    return room[0] if room is not None else None

async def update_room(
        db:AsyncSession, room_create: room_schema.RoomCreate, original: room_model.Room
) -> room_model.Room:
    original.title = room_create.title
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original

async def delete_room(db: AsyncSession, original: room_model.Room) -> None:
    await db.delete(original)
    await db.commit()

