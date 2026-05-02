from sqlalchemy import Column, Integer, String
from database import Base

class WordList(Base):
    __tablename__ = "word_lists"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, unique=True, index=True)
    sentiment_type = Column(String, index=True)  # "positive", "negative", "neutral"
