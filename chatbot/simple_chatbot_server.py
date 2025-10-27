import os
import pickle
import random
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# Initialize
model = None

def load_model():
    """Load the trained model"""
    global model
    
    try:
        with open('simple_chatbot_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        print("✅ Model loaded successfully!")
        return True
    except FileNotFoundError:
        print("❌ Model file not found. Please run train_simple_model.py first!")
        return False

def preprocess_text(text):
    """Simple text preprocessing"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def predict_intent(message):
    """Predict intent for a message"""
    if not model:
        return None, 0.0
    
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

def get_response(message, confidence_threshold=0.3):
    """Get chatbot response for a message"""
    if not model:
        return "Sorry, the chatbot is not ready yet. Please contact support."
    
    # Get prediction
    prediction, confidence = predict_intent(message)
    
    # If confidence is too low, return a default response
    if confidence < confidence_threshold or not prediction:
        return "I'm not sure I understand. Could you rephrase that? You can also:\n• Call GBV Command Centre: 0800 428 428 (24/7)\n• Check the Resources page for more information\n• Use the emergency button if you're in danger"
    
    # Find the matching intent and return a random response
    for intent in model['intents']:
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
    is_ready = model is not None
    return jsonify({
        'status': 'ready' if is_ready else 'not_ready',
        'message': 'Chatbot is ready' if is_ready else 'Model not loaded'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'service': 'SafeSupport Chatbot API (Simple Version)',
        'version': '1.0',
        'endpoints': {
            'POST /api/chat': 'Send a message to the chatbot',
            'GET /api/chat/health': 'Check chatbot status'
        }
    })

if __name__ == '__main__':
    print("🤖 Starting SafeSupport Chatbot Server (Simple Version)...")
    print("📦 Using simple pattern matching (no ML dependencies needed!)")
    
    # Load the model
    if not load_model():
        print("\n⚠️  WARNING: Run 'python train_simple_model.py' first to train the model!")
        print("The server will start but chatbot won't work until model is trained.\n")
    
    # Start Flask server
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🚀 Server running on http://localhost:{port}")
    print("📡 Ready to receive chat requests!")
    print("\nTest with: POST http://localhost:5000/api/chat")
    print('Body: {"message": "Hello"}\n')
    
    app.run(host='0.0.0.0', port=port, debug=True)
