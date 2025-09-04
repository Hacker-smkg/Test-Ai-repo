
# Import necessary libraries
import numpy as np
from fuzzywuzzy import fuzz
from PIL import Image
import pytesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

# Define a function to extract text from handwritten images
def extract_text_from_image(image_path):
    # Use OCR to extract text from the image
    text = pytesseract.image_to_string(Image.open(image_path), lang='eng', config='--psm 11')
    return text

# Define a function to calculate sentiment scores
def calculate_sentiment_scores(text):
    # Tokenize the text into words
    words = word_tokenize(text)
    
    # Remove stopwords and non-alphabetic tokens
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalpha() and word.lower() not in stop_words]
    
    # Calculate sentiment scores using fuzzy logic
    sentiment_scores = []
    # for word in words:
    #     # Calculate the membership degree of the word in the positive sentiment set
    #     positive_membership = fuzz.ratio(word.lower(), 'positive') / 100.0
        
    #     # Calculate the membership degree of the word in the negative sentiment set
    #     negative_membership = fuzz.ratio(word.lower(), 'negative') / 100.0
        
    #     # Calculate the sentiment score using the membership degrees
    #     sentiment_score = positive_membership - negative_membership
        
    #     # Append the sentiment score to the list
    #     sentiment_scores.append(sentiment_score)
    
    positive_words = ["positive", "good", "happy", "love", "excellent", "awesome", "fantastic", "great", "joy"]
    negative_words = ["negative", "bad", "sad", "hate", "poor", "terrible", "awful", "angry", "horrible"]

    for word in words:
        best_pos_score = max(fuzz.ratio(word.lower(), pos) for pos in positive_words) / 100.0
        best_neg_score = max(fuzz.ratio(word.lower(), neg) for neg in negative_words) / 100.0
        
        sentiment_score = best_pos_score - best_neg_score
        sentiment_scores.append(sentiment_score)

    # Calculate the overall sentiment score
    if sentiment_scores:
        overall_sentiment_score = np.mean(sentiment_scores)
    else:
        overall_sentiment_score = 0.0
    
    return overall_sentiment_score

# Define a function to classify sentiment
def classify_sentiment(image_path):
    # Extract text from the image
    text = extract_text_from_image(image_path)
    
    # Calculate the sentiment score
    sentiment_score = calculate_sentiment_scores(text)
    
    # # Classify the sentiment based on the score
    # if (sentiment_score > 0.5):
    #     return 'Positive'
    # elif (sentiment_score < -0.5):
    #     return 'Negative'
    # else:
    #     return 'Neutral'
    
    #More realistic sentiment thresholds
    if sentiment_score >= 0.1:
        return 'Positive'
    elif sentiment_score <= -0.1:
        return 'Negative'
    else:
        return 'Neutral'

# Test the sentiment classification function
image_path = 'handwritten_text_image3.jpg'  # Ensure this image exists in your working directory
sentiment = classify_sentiment(image_path)
print("Sentiment:", sentiment)