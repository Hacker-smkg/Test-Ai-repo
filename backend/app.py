from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine, Base
import models, schemas
from ocr_engine import extract_text, calculate_sentiment

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sentiment OCR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def seed_db():
    db = SessionLocal()
    if db.query(models.WordList).count() == 0:
        initial_positive = ["positive", "good", "happy", "love", "excellent", "awesome", "fantastic", "great", "joy"]
        initial_negative = ["negative", "bad", "sad", "hate", "poor", "terrible", "awful", "angry", "horrible"]
        initial_neutral = ["neutral", "okay", "fine", "normal", "average", "standard"]
        
        for word in initial_positive:
            db.add(models.WordList(word=word, sentiment_type="positive"))
        for word in initial_negative:
            db.add(models.WordList(word=word, sentiment_type="negative"))
        for word in initial_neutral:
            db.add(models.WordList(word=word, sentiment_type="neutral"))
            
        db.commit()
    db.close()

@app.get("/api/words", response_model=List[schemas.Word])
def get_words(sentiment_type: str = None, db: Session = Depends(get_db)):
    if sentiment_type:
        return db.query(models.WordList).filter(models.WordList.sentiment_type == sentiment_type).all()
    return db.query(models.WordList).all()

@app.post("/api/words", response_model=schemas.Word)
def add_word(word: schemas.WordCreate, db: Session = Depends(get_db)):
    db_word = db.query(models.WordList).filter(models.WordList.word == word.word).first()
    if db_word:
        raise HTTPException(status_code=400, detail="Word already exists")
    new_word = models.WordList(word=word.word, sentiment_type=word.sentiment_type)
    db.add(new_word)
    db.commit()
    db.refresh(new_word)
    return new_word

@app.delete("/api/words/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    db_word = db.query(models.WordList).filter(models.WordList.id == word_id).first()
    if not db_word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(db_word)
    db.commit()
    return {"message": "Word deleted successfully"}

@app.post("/api/analyze", response_model=schemas.AnalyzeResponse)
async def analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        image_bytes = await file.read()
        text = extract_text(image_bytes)
        
        positive_words = [w.word for w in db.query(models.WordList).filter(models.WordList.sentiment_type == "positive").all()]
        negative_words = [w.word for w in db.query(models.WordList).filter(models.WordList.sentiment_type == "negative").all()]
        
        score, sentiment = calculate_sentiment(text, positive_words, negative_words)
        
        return schemas.AnalyzeResponse(
            extracted_text=text,
            sentiment_score=score,
            sentiment=sentiment
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
