from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from db import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    title = Column(String(1024))
    # enter_id = Column(String(1024))

    # cards = relationship("Card", back_populates="room", cascade="delete")
    # members = relationship("Member", back_populates="room", cascade="delete")