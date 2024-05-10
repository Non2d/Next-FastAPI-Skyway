from typing import Optional, List
from pydantic import BaseModel, Field #BaseModelはFastAPIで使われるスキーマモデルクラスのベースクラス

class Card(BaseModel):
    state : str = Field(..., example="todo")
    content : str = Field(..., example="Buy milk")

class RoomBase(BaseModel): #共通のフィールドを持つベースクラスを定義
    enter_id : str = Field(..., example="1248123")
    name : str = Field(..., example="room1")
    cards: List[Card] = Field(..., example=[{"state": "Deck", "content": "みんな発言しよう！"}])

class RoomCreate(RoomBase):
    pass

class RoomCreateResponse(RoomCreate):
    id: int

    class Config:
        orm_mode = True

class Room(RoomBase):
    id: int

    class Config: #DBとの接続に使う
        orm_mode = True