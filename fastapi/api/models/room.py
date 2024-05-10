from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from db import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    enter_id = Column(String(1024))
    name = Column(String(1024))

    cards = relationship("Card", back_populates="room", cascade="delete")
    # members = relationship("Member", back_populates="room", cascade="delete")

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True)
    content = Column(String(1024))
    state = Column(String(1024))

    room_id = Column(Integer, ForeignKey("rooms.id"))
    room = relationship("Room", back_populates="cards")