from typing import Optional
from pydantic import BaseModel, Field #BaseModelはFastAPIで使われるスキーマモデルクラスのベースクラス

class RoomBase(BaseModel): #共通のフィールドを持つベースクラスを定義
    title: Optional[str] = Field(None, example="クリーニングを取りに行く")

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