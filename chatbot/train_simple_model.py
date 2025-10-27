import json
import re
from collections import defaultdict
import pickle

def load_training_data(filename='training_data.json'):
    """Load training data from JSON file"""
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data['intents']

def preprocess_text(text):
    """Simple text preprocessing"""
    # Convert to lowercase and remove special characters
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def calculate_similarity(query, pattern):
    """Calculate simple word-based similarity between query and pattern"""
    query_words = set(preprocess_text(query).split())
    pattern_words = set(preprocess_text(pattern).split())
    
    if not query_words or not pattern_words:
        return 0.0
    
    # Calculate Jaccard similarity
    intersection = query_words.intersection(pattern_words)
    union = query_words.union(pattern_words)
    
    return len(intersection) / len(union) if union else 0.0

def train_simple_model(intents):
    """Create a simple pattern matching model"""
    model = {
        'intents': intents,
        'patterns': defaultdict(list)
    }
    
    # Index all patterns by intent
    for intent in intents:
        tag = intent['tag']
        for pattern in intent['patterns']:
            processed = preprocess_text(pattern)
            model['patterns'][tag].append({
                'original': pattern,
                'processed': processed,
                'words': set(processed.split())
            })
    
    return model

def save_model(model, model_path='simple_chatbot_model.pkl'):
    """Save the model"""
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"Model saved to {model_path}")

def test_model(model):
    """Test the model with sample messages"""
    test_messages = [
        "Hi there",
        "I need help urgently",
        "Where can I get legal advice",
        "I need a safe place to stay",
        "Mental health support",
        "Thank you"
    ]
    
    print("\n--- Testing Model ---")
    for message in test_messages:
        intent_tag, confidence = predict(model, message)
        
        # Find response
        response = ""
        for intent in model['intents']:
            if intent['tag'] == intent_tag:
                response = intent['responses'][0]
                break
        
        print(f"\nInput: {message}")
        print(f"Intent: {intent_tag} (confidence: {confidence:.2f})")
        print(f"Response: {response[:100]}...")

def predict(model, message):
    """Predict intent for a message"""
    processed_message = preprocess_text(message)
    message_words = set(processed_message.split())
    
    best_tag = None
    best_score = 0.0
    
    # Check each intent
    for tag, patterns in model['patterns'].items():
        max_similarity = 0.0
        
        # Find best matching pattern for this intent
        for pattern_info in patterns:
            # Calculate word overlap
            common_words = len(message_words.intersection(pattern_info['words']))
            total_words = len(message_words.union(pattern_info['words']))
            
            if total_words > 0:
                similarity = common_words / total_words
                max_similarity = max(max_similarity, similarity)
        
        # Update best match
        if max_similarity > best_score:
            best_score = max_similarity
            best_tag = tag
    
    return best_tag, best_score

def main():
    print("Loading training data...")
    intents = load_training_data()
    
    print(f"Loaded {len(intents)} intents")
    
    # Count total patterns
    total_patterns = sum(len(intent['patterns']) for intent in intents)
    print(f"Total training patterns: {total_patterns}")
    
    print("Training simple pattern matching model...")
    model = train_simple_model(intents)
    
    print("Saving model...")
    save_model(model)
    
    # Test the model
    test_model(model)
    
    print("\n✅ Training complete! Model ready to use.")

if __name__ == "__main__":
    main()
