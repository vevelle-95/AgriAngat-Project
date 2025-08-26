#!/usr/bin/env python3
"""
CUDA-Accelerated Phi-4 Chatbot API Server
Flask API server that wraps the full RAG-based crop recommendation system
with CUDA-accelerated Phi-4 model for frontend integration
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import json
import uuid
import threading
import queue
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging
from concurrent.futures import ThreadPoolExecutor
import asyncio

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Global variables for model management
model_instance = None
model_lock = threading.Lock()
model_loaded = False
loading_status = {"status": "not_loaded", "progress": 0, "error": None}

# Add parent directory to path for imports
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

class AsyncCropRAGChatbot:
    """Async wrapper for CropRAGChatbot to handle concurrent requests"""
    
    def __init__(self, model_path: str = "../../../../microsoft_Phi-4-mini-instruct-Q4_K_M.gguf"):
        self.model_path = model_path
        self.chatbot = None
        self.request_queue = queue.Queue()
        self.response_cache = {}
        self.executor = ThreadPoolExecutor(max_workers=2)  # Limit concurrent model usage
        
    def initialize_chatbot(self) -> bool:
        """Initialize the chatbot with progress tracking"""
        global loading_status, model_loaded
        
        try:
            loading_status["status"] = "loading"
            loading_status["progress"] = 10
            
            # Import the RAG chatbot classes
            logger.info("Importing RAG chatbot modules...")
            from crop_advisor import CropKnowledgeBase, CropRAGChatbot
            loading_status["progress"] = 30
            
            # Initialize knowledge base
            logger.info("Loading crop knowledge base...")
            kb = CropKnowledgeBase()
            
            if not kb.load_data():
                raise Exception("Failed to load crop data")
            loading_status["progress"] = 50
            
            logger.info("Creating vector database...")
            if not kb.create_vector_db():
                raise Exception("Failed to create vector database")
            loading_status["progress"] = 70
            
            # Initialize chatbot with CUDA acceleration
            logger.info("Loading Phi-4 model with CUDA acceleration...")
            self.chatbot = CropRAGChatbot(
                knowledge_base=kb,
                model_path=self.model_path,
                fetch_environmental_data=True,
                default_location="manila"
            )
            loading_status["progress"] = 100
            loading_status["status"] = "loaded"
            model_loaded = True
            
            logger.info("✅ CUDA Phi-4 chatbot initialized successfully")
            return True
            
        except Exception as e:
            error_msg = f"Failed to initialize chatbot: {str(e)}"
            logger.error(f"❌ {error_msg}")
            loading_status["status"] = "error"
            loading_status["error"] = error_msg
            return False
    
    async def generate_response_async(self, user_input: str, conversation_id: str = None) -> Dict[str, Any]:
        """Generate response asynchronously"""
        if not self.chatbot:
            return {
                "success": False,
                "error": "Chatbot not initialized",
                "response": "Sorry, the AI model is not ready. Please wait for initialization to complete."
            }
        
        try:
            # Generate cache key
            cache_key = f"{conversation_id}_{hash(user_input)}" if conversation_id else hash(user_input)
            
            # Check cache first
            if cache_key in self.response_cache:
                logger.info("Returning cached response")
                return self.response_cache[cache_key]
            
            # Generate response using thread executor
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                self.executor, 
                self._generate_sync_response, 
                user_input
            )
            
            # Cache the response
            self.response_cache[cache_key] = response
            
            # Limit cache size
            if len(self.response_cache) > 100:
                oldest_key = next(iter(self.response_cache))
                del self.response_cache[oldest_key]
            
            return response
            
        except Exception as e:
            logger.error(f"❌ Error generating async response: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I encountered an error processing your request. Please try again."
            }
    
    def _generate_sync_response(self, user_input: str) -> Dict[str, Any]:
        """Generate response synchronously (called by thread executor)"""
        try:
            with model_lock:  # Ensure thread-safe model access
                start_time = time.time()
                response_text = self.chatbot.chat(user_input)
                processing_time = time.time() - start_time
                
                return {
                    "success": True,
                    "response": response_text,
                    "processing_time": round(processing_time, 2),
                    "environmental_data": self.chatbot.current_environmental_data,
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            logger.error(f"❌ Error in sync response generation: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I'm having trouble processing your request. Please try rephrasing or try again later."
            }
    
    def update_environmental_data(self, location: str = "manila") -> bool:
        """Update environmental data"""
        if not self.chatbot:
            return False
        return self.chatbot.update_environmental_data(location)
    
    def get_conversation_history(self) -> List[Dict]:
        """Get conversation history"""
        if not self.chatbot:
            return []
        return self.chatbot.conversation_history
    
    def clear_conversation_history(self):
        """Clear conversation history"""
        if self.chatbot:
            self.chatbot.conversation_history = []

class ConversationManager:
    """Manage multiple conversation sessions"""
    
    def __init__(self):
        self.conversations = {}
        self.cleanup_interval = 3600  # 1 hour
        self.max_conversations = 100
    
    def create_conversation(self) -> str:
        """Create new conversation session"""
        conversation_id = str(uuid.uuid4())
        self.conversations[conversation_id] = {
            "id": conversation_id,
            "created_at": datetime.now(),
            "last_activity": datetime.now(),
            "messages": []
        }
        
        # Cleanup old conversations if needed
        if len(self.conversations) > self.max_conversations:
            self._cleanup_old_conversations()
        
        return conversation_id
    
    def add_message(self, conversation_id: str, message: Dict[str, Any]):
        """Add message to conversation"""
        if conversation_id in self.conversations:
            self.conversations[conversation_id]["messages"].append(message)
            self.conversations[conversation_id]["last_activity"] = datetime.now()
    
    def get_conversation(self, conversation_id: str) -> Optional[Dict]:
        """Get conversation by ID"""
        return self.conversations.get(conversation_id)
    
    def _cleanup_old_conversations(self):
        """Remove old inactive conversations"""
        current_time = datetime.now()
        to_remove = []
        
        for conv_id, conv in self.conversations.items():
            if (current_time - conv["last_activity"]).seconds > self.cleanup_interval:
                to_remove.append(conv_id)
        
        for conv_id in to_remove:
            del self.conversations[conv_id]
        
        logger.info(f"Cleaned up {len(to_remove)} old conversations")

# Initialize global components
async_chatbot = AsyncCropRAGChatbot()
conversation_manager = ConversationManager()

def initialize_model_background():
    """Initialize model in background thread"""
    global model_instance
    model_instance = async_chatbot
    async_chatbot.initialize_chatbot()

# Start model loading in background
loading_thread = threading.Thread(target=initialize_model_background)
loading_thread.daemon = True
loading_thread.start()

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    global model_loaded, loading_status
    
    return jsonify({
        'success': True,
        'status': 'healthy',
        'service': 'CUDA Phi-4 Chatbot API',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': model_loaded,
        'loading_status': loading_status,
        'gpu_available': torch.cuda.is_available() if 'torch' in globals() else False,
        'active_conversations': len(conversation_manager.conversations)
    })

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """Get model loading status"""
    global loading_status
    
    return jsonify({
        'success': True,
        'loading_status': loading_status,
        'model_loaded': model_loaded
    })

@app.route('/api/conversation/new', methods=['POST'])
def new_conversation():
    """Create new conversation session"""
    try:
        conversation_id = conversation_manager.create_conversation()
        
        # Add welcome message
        welcome_message = {
            "id": 1,
            "text": "Hi! 👋 Ako si KaAgri, ang inyong AgriAngat AI assistant. Paano kita matutulungan ngayon?",
            "sender": "bot",
            "timestamp": datetime.now().strftime('%H:%M'),
            "environmental_data": async_chatbot.chatbot.current_environmental_data if async_chatbot.chatbot else None
        }
        
        conversation_manager.add_message(conversation_id, welcome_message)
        
        return jsonify({
            'success': True,
            'conversation_id': conversation_id,
            'welcome_message': welcome_message
        })
        
    except Exception as e:
        logger.error(f"❌ Error creating conversation: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint with async processing"""
    try:
        if not model_loaded:
            return jsonify({
                'success': False,
                'error': 'Model not ready',
                'message': 'The AI model is still loading. Please wait a moment and try again.',
                'loading_status': loading_status
            }), 503
        
        data = request.get_json()
        user_message = data.get('message', '').strip()
        conversation_id = data.get('conversation_id')
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        if not conversation_id:
            conversation_id = conversation_manager.create_conversation()
        
        # Add user message to conversation
        user_msg = {
            "id": len(conversation_manager.get_conversation(conversation_id)["messages"]) + 1,
            "text": user_message,
            "sender": "user",
            "timestamp": datetime.now().strftime('%H:%M')
        }
        conversation_manager.add_message(conversation_id, user_msg)
        
        # Generate response asynchronously
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        response_data = loop.run_until_complete(
            async_chatbot.generate_response_async(user_message, conversation_id)
        )
        loop.close()
        
        if response_data["success"]:
            # Add bot response to conversation
            bot_msg = {
                "id": len(conversation_manager.get_conversation(conversation_id)["messages"]) + 1,
                "text": response_data["response"],
                "sender": "bot",
                "timestamp": datetime.now().strftime('%H:%M'),
                "environmental_data": response_data.get("environmental_data"),
                "processing_time": response_data.get("processing_time")
            }
            conversation_manager.add_message(conversation_id, bot_msg)
            
            return jsonify({
                'success': True,
                'conversation_id': conversation_id,
                'user_message': user_msg,
                'bot_response': bot_msg,
                'environmental_data': response_data.get("environmental_data"),
                'processing_time': response_data.get("processing_time")
            })
        else:
            return jsonify(response_data), 500
            
    except Exception as e:
        logger.error(f"❌ Chat endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/conversation/<conversation_id>/history', methods=['GET'])
def get_conversation_history(conversation_id):
    """Get conversation history"""
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        
        if not conversation:
            return jsonify({
                'success': False,
                'error': 'Conversation not found'
            }), 404
        
        return jsonify({
            'success': True,
            'conversation_id': conversation_id,
            'messages': conversation["messages"],
            'created_at': conversation["created_at"].isoformat(),
            'last_activity': conversation["last_activity"].isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ History endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/conversation/<conversation_id>/clear', methods=['POST'])
def clear_conversation(conversation_id):
    """Clear conversation history"""
    try:
        if conversation_id in conversation_manager.conversations:
            conversation_manager.conversations[conversation_id]["messages"] = []
            
            # Add new welcome message
            welcome_message = {
                "id": 1,
                "text": "Hi! 👋 Ako si KaAgri, ang inyong AgriAngat AI assistant. Paano kita matutulungan ngayon?",
                "sender": "bot",
                "timestamp": datetime.now().strftime('%H:%M')
            }
            conversation_manager.add_message(conversation_id, welcome_message)
            
            return jsonify({
                'success': True,
                'message': 'Conversation cleared',
                'conversation_id': conversation_id,
                'welcome_message': welcome_message
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Conversation not found'
            }), 404
            
    except Exception as e:
        logger.error(f"❌ Clear endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/environmental-data', methods=['GET'])
def get_environmental_data():
    """Get current environmental data"""
    try:
        if not async_chatbot.chatbot:
            return jsonify({
                'success': False,
                'error': 'Chatbot not initialized'
            }), 503
        
        env_data = async_chatbot.chatbot.current_environmental_data
        env_summary = async_chatbot.chatbot.env_fetcher.get_environmental_summary(env_data)
        
        return jsonify({
            'success': True,
            'data': env_data,
            'summary': env_summary,
            'last_updated': env_data.get('timestamp')
        })
        
    except Exception as e:
        logger.error(f"❌ Environmental data endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/environmental-data/refresh', methods=['POST'])
def refresh_environmental_data():
    """Refresh environmental data"""
    try:
        data = request.get_json() or {}
        location = data.get('location', 'manila')
        
        success = async_chatbot.update_environmental_data(location)
        
        if success:
            env_data = async_chatbot.chatbot.current_environmental_data
            env_summary = async_chatbot.chatbot.env_fetcher.get_environmental_summary(env_data)
            
            return jsonify({
                'success': True,
                'message': f'Environmental data refreshed for {location}',
                'data': env_data,
                'summary': env_summary
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to refresh environmental data'
            }), 500
            
    except Exception as e:
        logger.error(f"❌ Refresh endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get API usage statistics"""
    try:
        return jsonify({
            'success': True,
            'stats': {
                'active_conversations': len(conversation_manager.conversations),
                'total_messages': sum(len(conv["messages"]) for conv in conversation_manager.conversations.values()),
                'model_loaded': model_loaded,
                'cache_size': len(async_chatbot.response_cache) if async_chatbot.response_cache else 0,
                'uptime': time.time() - start_time if 'start_time' in globals() else 0
            }
        })
        
    except Exception as e:
        logger.error(f"❌ Stats endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

@app.errorhandler(503)
def service_unavailable(error):
    return jsonify({
        'success': False,
        'error': 'Service temporarily unavailable',
        'loading_status': loading_status
    }), 503

if __name__ == '__main__':
    start_time = time.time()
    
    logger.info("🚀 Starting CUDA Phi-4 Chatbot API Server...")
    logger.info("🔥 CUDA acceleration enabled")
    logger.info("🧠 Loading Phi-4 model in background...")
    logger.info("📊 Environmental data integration enabled")
    logger.info("🌱 RAG-based crop knowledge system")
    
    # Import torch to check CUDA availability
    try:
        import torch
        if torch.cuda.is_available():
            logger.info(f"🎮 GPU detected: {torch.cuda.get_device_name(0)}")
        else:
            logger.warning("⚠️  No CUDA GPU detected, falling back to CPU")
    except ImportError:
        logger.warning("⚠️  PyTorch not available")
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5002,  # Different port to avoid conflicts
        debug=False,  # Disable debug mode for production
        threaded=True  # Enable threading for concurrent requests
    )