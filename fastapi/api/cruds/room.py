from typing import List, Tuple, Optional

from sqlalchemy import select
from sqlalchemy.engine import Result
from sqlalchemy.ext.asyncio import AsyncSession


import models.room as room_model
import schemas.room as room_schema


async def create_room(
    db: AsyncSession, room_create: room_schema.RoomCreate
) -> room_model.Room:
    room = room_model.Room(
        enter_id=room_create.enter_id,
        name=room_create.name,
    )
    db.add(room)
    await db.commit()
    await db.refresh(room)

    cards = [room_model.Card(state=card.state, content=card.content) for card in room_create.cards]
    db.add_all(cards)
    await db.commit()
    await db.refresh(room)

    room_response_model = room_model.Room(
        id=room.id,
        enter_id=room.enter_id,
        name=room.name,
        cards = [room_model.Card(state=card.state, content=card.content) for card in room_create.cards]
    )
    return room_response_model

async def get_rooms(db: AsyncSession) -> List[Tuple[int, str, bool]]:
    result: Result = await(
        db.execute(
            select(
                room_model.Room.id,
                room_model.Room.enter_id,
                room_model.Room.name,
                room_model.Room.cards
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
    original.enter_id = room_create.enter_id
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original

async def delete_room(db: AsyncSession, original: room_model.Room) -> None:
    await db.delete(original)
    await db.commit()

