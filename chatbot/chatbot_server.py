import os
import pickle
import random
import nltk
from nltk.stem import WordNetLemmatizer
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# Initialize
lemmatizer = WordNetLemmatizer()
model = None
intents = None

def load_model():
    """Load the trained model and intents"""
    global model, intents
    
    try:
        with open('chatbot_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        with open('intents.pkl', 'rb') as f:
            intents = pickle.load(f)
        
        print("✅ Model loaded successfully!")
        return True
    except FileNotFoundError:
        print("❌ Model files not found. Please run train_model.py first!")
        return False

def preprocess_text(text):
    """Preprocess text: tokenize and lemmatize"""
    words = nltk.word_tokenize(text.lower())
    words = [lemmatizer.lemmatize(word) for word in words if word.isalnum()]
    return ' '.join(words)

def get_response(message, confidence_threshold=0.5):
    """Get chatbot response for a message"""
    if not model or not intents:
        return "Sorry, the chatbot is not ready yet. Please contact support."
    
    # Preprocess the message
    processed = preprocess_text(message)
    
    # Get prediction
    prediction = model.predict([processed])[0]
    probabilities = model.predict_proba([processed])[0]
    confidence = max(probabilities)
    
    # If confidence is too low, return a default response
    if confidence < confidence_threshold:
        return "I'm not sure I understand. Could you rephrase that? You can also:\n• Call GBV Command Centre: 0800 428 428 (24/7)\n• Check the Resources page for more information\n• Use the emergency button if you're in danger"
    
    # Find the matching intent and return a random response
    for intent in intents:
        if intent['tag'] == prediction:
            response = random.choice(intent['responses'])
            return response
    
    return "I'm here to help. What can I assist you with?"

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get response from chatbot
        response = get_response(message)
        
        return jsonify({
            'response': response,
            'timestamp': data.get('timestamp')
        })
    
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    is_ready = model is not None and intents is not None
    return jsonify({
        'status': 'ready' if is_ready else 'not_ready',
        'message': 'Chatbot is ready' if is_ready else 'Model not loaded'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'service': 'SafeSupport Chatbot API',
        'version': '1.0',
        'endpoints': {
            'POST /api/chat': 'Send a message to the chatbot',
            'GET /api/chat/health': 'Check chatbot status'
        }
    })

if __name__ == '__main__':
    print("🤖 Starting SafeSupport Chatbot Server...")
    
    # Load the model
    if not load_model():
        print("\n⚠️  WARNING: Run 'python train_model.py' first to train the model!")
        print("The server will start but chatbot won't work until model is trained.\n")
    
    # Start Flask server
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🚀 Server running on http://localhost:{port}")
    print("📡 Ready to receive chat requests!")
    print("\nTest with: POST http://localhost:5000/api/chat")
    print('Body: {"message": "Hello"}\n')
    
    app.run(host='0.0.0.0', port=port, debug=True)
