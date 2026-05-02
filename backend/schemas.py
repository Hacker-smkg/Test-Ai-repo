from pydantic import BaseModel
from typing import List, Optional

class WordBase(BaseModel):
    word: str
    sentiment_type: str

class WordCreate(WordBase):
    pass

class Word(WordBase):
    id: int

    class Config:
        orm_mode = True

class AnalyzeResponse(BaseModel):
    extracted_text: str
    sentiment_score: float
    sentiment: str
