"""
Quick test script to verify the chatbot is working
"""
import requests
import json

API_URL = "http://localhost:5000/api/chat"

def test_chatbot():
    print("🤖 Testing SafeSupport Chatbot\n")
    print("="*50)
    
    # Test messages
    test_messages = [
        "Hello",
        "I need help urgently",
        "Where can I get legal advice?",
        "I need a safe place to stay",
        "Mental health support",
        "Thank you"
    ]
    
    for message in test_messages:
        print(f"\n👤 User: {message}")
        
        try:
            response = requests.post(
                API_URL,
                json={"message": message},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"🤖 Bot: {data['response']}\n")
            else:
                print(f"❌ Error: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Error: Cannot connect to chatbot server")
            print("   Make sure the server is running: python chatbot_server.py")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("="*50)

if __name__ == "__main__":
    test_chatbot()
