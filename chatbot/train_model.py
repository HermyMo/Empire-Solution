import json
import numpy as np
import pickle
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import os

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

def load_training_data(filename='training_data.json'):
    """Load training data from JSON file"""
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data['intents']

def preprocess_text(text):
    """Preprocess text: tokenize and lemmatize"""
    words = nltk.word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    return ' '.join(words)

def prepare_training_data(intents):
    """Prepare training data from intents"""
    X_train = []
    y_train = []
    
    for intent in intents:
        tag = intent['tag']
        for pattern in intent['patterns']:
            processed_pattern = preprocess_text(pattern)
            X_train.append(processed_pattern)
            y_train.append(tag)
    
    return X_train, y_train

def train_model(X_train, y_train):
    """Train the chatbot model using TF-IDF and Naive Bayes"""
    # Create a pipeline with TF-IDF vectorizer and Naive Bayes classifier
    model = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
        ('classifier', MultinomialNB(alpha=0.1))
    ])
    
    # Train the model
    model.fit(X_train, y_train)
    
    return model

def save_model_and_data(model, intents, model_path='chatbot_model.pkl', intents_path='intents.pkl'):
    """Save the trained model and intents"""
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    with open(intents_path, 'wb') as f:
        pickle.dump(intents, f)
    
    print(f"Model saved to {model_path}")
    print(f"Intents saved to {intents_path}")

def main():
    print("Loading training data...")
    intents = load_training_data()
    
    print("Preparing training data...")
    X_train, y_train = prepare_training_data(intents)
    
    print(f"Training samples: {len(X_train)}")
    print(f"Unique intents: {len(set(y_train))}")
    
    print("Training model...")
    model = train_model(X_train, y_train)
    
    print("Saving model...")
    save_model_and_data(model, intents)
    
    # Test the model
    print("\n--- Testing Model ---")
    test_messages = [
        "Hi there",
        "I need help urgently",
        "Where can I get legal advice",
        "I need a safe place to stay"
    ]
    
    for message in test_messages:
        processed = preprocess_text(message)
        prediction = model.predict([processed])[0]
        probabilities = model.predict_proba([processed])[0]
        confidence = max(probabilities)
        
        # Find response
        for intent in intents:
            if intent['tag'] == prediction:
                response = intent['responses'][0]
                break
        
        print(f"\nInput: {message}")
        print(f"Intent: {prediction} (confidence: {confidence:.2f})")
        print(f"Response: {response[:100]}...")
    
    print("\n✅ Training complete! Model ready to use.")

if __name__ == "__main__":
    main()
