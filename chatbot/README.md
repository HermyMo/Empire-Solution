# SafeSupport Chatbot 🤖

An AI-powered chatbot trained on South African GBV support resources to provide instant, confidential assistance to users.

## Features

- ✅ Intent-based classification using Machine Learning (TF-IDF + Naive Bayes)
- ✅ Trained on SafeSupport-specific data (SA crisis hotlines, resources, safety tips)
- ✅ Easy to retrain with your own data
- ✅ REST API for integration
- ✅ Real-time chat interface
- ✅ Confidential conversations

## Quick Start

### 1. Install Python Dependencies

```powershell
cd chatbot
pip install -r requirements.txt
```

### 2. Train the Model

```powershell
python train_model.py
```

You should see output like:
```
Loading training data...
Preparing training data...
Training samples: 80+
Unique intents: 13
Training model...
Saving model...
✅ Training complete! Model ready to use.
```

### 3. Start the Chatbot Server

```powershell
python chatbot_server.py
```

The server will start on `http://localhost:5000`

### 4. Test the Chatbot

Open your browser and go to `http://localhost:5173/dashboard` - you'll see a chat icon in the bottom-right corner!

## File Structure

```
chatbot/
├── training_data.json      # Training data (intents, patterns, responses)
├── train_model.py          # Script to train the chatbot model
├── chatbot_server.py       # Flask API server
├── requirements.txt        # Python dependencies
├── chatbot_model.pkl       # Trained model (generated after training)
├── intents.pkl            # Intents data (generated after training)
└── README.md              # This file
```

## Training Data Format

The chatbot uses `training_data.json` with this structure:

```json
{
  "intents": [
    {
      "tag": "greeting",
      "patterns": [
        "Hi",
        "Hello",
        "Hey"
      ],
      "responses": [
        "Hello! I'm SafeSupport Assistant. How can I help you today?"
      ]
    }
  ]
}
```

## Adding New Intents

1. Edit `training_data.json`
2. Add your new intent with patterns and responses
3. Run `python train_model.py` to retrain
4. Restart the chatbot server

### Example: Adding a new intent

```json
{
  "tag": "job_training",
  "patterns": [
    "I need job training",
    "Skills development",
    "How can I get a job",
    "Employment help"
  ],
  "responses": [
    "We can help you with job training! Contact:\n• FET Colleges: Skills training\n• Department of Labour: 0800 872 829\n• SETA programs in your area"
  ]
}
```

## API Endpoints

### POST /api/chat
Send a message to the chatbot

**Request:**
```json
{
  "message": "I need help",
  "timestamp": "2025-10-26T10:00:00Z"
}
```

**Response:**
```json
{
  "response": "🚨 If you're in immediate danger...",
  "timestamp": "2025-10-26T10:00:00Z"
}
```

### GET /api/chat/health
Check if chatbot is ready

**Response:**
```json
{
  "status": "ready",
  "message": "Chatbot is ready"
}
```

## Testing the Chatbot

### Test via command line (curl):

```powershell
curl -X POST http://localhost:5000/api/chat `
  -H "Content-Type: application/json" `
  -d '{"message": "I need help urgently"}'
```

### Test via browser:

Open the browser console on your dashboard and run:

```javascript
fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
})
.then(r => r.json())
.then(console.log);
```

## Current Training Topics

The chatbot is trained on:

1. **Greetings** - Basic introductions
2. **Emergency Support** - Immediate danger responses
3. **Crisis Hotlines** - 24/7 support numbers
4. **Resources** - Available support services
5. **Legal Help** - Legal aid and protection orders
6. **Shelters** - Safe housing options
7. **Mental Health** - Counseling and therapy
8. **Financial Help** - SASSA and grants
9. **Safety Tips** - Safety planning advice
10. **About SafeSupport** - Platform information
11. **Confidentiality** - Privacy assurance
12. **Gratitude** - Thank you responses
13. **Goodbye** - Conversation endings

## Improving the Model

### Add more training data:
- Add more patterns (questions users might ask)
- Add more responses (varied ways to answer)
- Add new intents for topics not covered

### Retrain:
```powershell
python train_model.py
```

### Monitor performance:
- Check confidence scores in console logs
- Add patterns for questions the bot doesn't understand well

## Troubleshooting

### Model files not found
Run `python train_model.py` first

### CORS errors
Make sure `flask-cors` is installed: `pip install flask-cors`

### Chatbot not responding
1. Check if chatbot server is running on port 5000
2. Check browser console for errors
3. Test API directly: `http://localhost:5000/api/chat/health`

### Low confidence predictions
Add more training patterns for that intent

## Production Deployment

For production:

1. **Use a production WSGI server:**
```powershell
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 chatbot_server:app
```

2. **Use environment variables:**
```python
PORT = os.environ.get('PORT', 5000)
```

3. **Add authentication** if needed
4. **Monitor API performance**
5. **Regularly update training data** based on user interactions

## Advanced: Using Transformers

To use more advanced models (BERT, GPT), replace the model in `train_model.py`:

```python
from transformers import pipeline

# Load pre-trained model
chatbot = pipeline("conversational", model="microsoft/DialoGPT-medium")
```

This requires more resources but provides better responses.

## Support

For questions or issues:
- Check console logs (both frontend and backend)
- Test API endpoints directly
- Review training data format

---

Built with ❤️ for SafeSupport
