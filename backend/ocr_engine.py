import cv2
import numpy as np
import pytesseract
from fuzzywuzzy import fuzz
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('punkt_tab', quiet=True)

def preprocess_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive thresholding to maximize text clarity
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    # Optionally denoise
    denoised = cv2.fastNlMeansDenoising(thresh, None, 10, 7, 21)
    
    return denoised

def extract_text(image_bytes):
    processed_img = preprocess_image(image_bytes)
    # config psm 11 means: Sparse text. Find as much text as possible in no particular order.
    text = pytesseract.image_to_string(processed_img, lang='eng', config='--psm 11')
    return text

def calculate_sentiment(text, positive_words, negative_words):
    words = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalpha() and word.lower() not in stop_words]
    
    sentiment_scores = []
    
    # Handle empty lists gracefully
    if not positive_words:
        positive_words = ["positive", "good", "happy"]
    if not negative_words:
        negative_words = ["negative", "bad", "sad"]

    for word in words:
        best_pos_score = max([fuzz.ratio(word.lower(), pos) for pos in positive_words]) / 100.0
        best_neg_score = max([fuzz.ratio(word.lower(), neg) for neg in negative_words]) / 100.0
        
        sentiment_score = best_pos_score - best_neg_score
        sentiment_scores.append(sentiment_score)

    overall_sentiment_score = np.mean(sentiment_scores) if sentiment_scores else 0.0
    
    if overall_sentiment_score >= 0.1:
        sentiment = 'Positive'
    elif overall_sentiment_score <= -0.1:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
        
    return overall_sentiment_score, sentiment
