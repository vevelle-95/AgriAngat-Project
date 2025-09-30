"""
Minimal Flask API for Crop Advisor
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from crop_advisor import CropRAGChatbot

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global chatbot instance
chatbot = None

def initialize_chatbot():
    """Initialize the chatbot once at startup"""
    global chatbot
    try:
        logger.info("🌱 Initializing Kaagri-bot API...")
        chatbot = CropRAGChatbot()
        logger.info("✅ Kaagri-bot API ready!")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize chatbot: {e}")
        return False

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests from React Native"""
    try:
        if not chatbot:
            return jsonify({
                'error': 'Chatbot not initialized',
                'success': False
            }), 500
        
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message.strip():
            return jsonify({
                'error': 'Empty message',
                'success': False
            }), 400
        
        # Generate response
        response = chatbot.chat(user_message)
        
        return jsonify({
            'response': response,
            'success': True
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'chatbot_ready': chatbot is not None
    })

if __name__ == '__main__':
    # Initialize chatbot at startup
    if initialize_chatbot():
        logger.info("🚀 Starting API server on http://localhost:5000")
        app.run(host='0.0.0.0', port=5000, debug=False)
    else:
        logger.error("❌ Failed to start API server")
