"""
Optimized Crop Recommendation Chatbot
Streamlined for speed with minimal dependencies
"""

from llama_cpp import Llama
from typing import List, Dict, Any
import logging
import os
import re
import requests
from dotenv import load_dotenv
from datetime import datetime
from sentinelhub import (
    SHConfig, MimeType, CRS, BBox, SentinelHubRequest, DataCollection, bbox_to_dimensions
)
import json
import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer

# Load environment variables from AgriAngat-BackEnd directory
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Check for CUDA availability
try:
    import torch
    CUDA_AVAILABLE = torch.cuda.is_available()
    if CUDA_AVAILABLE:
        GPU_NAME = torch.cuda.get_device_name(0)
        logger_temp = logging.getLogger(__name__)
        logger_temp.info(f"🚀 CUDA detected: {GPU_NAME}")
except ImportError:
    CUDA_AVAILABLE = False

# Simplified logging setup
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)


class CropRAGChatbot:
    """Dual-mode chatbot: General assistant + Agriculture specialist with environmental data"""
    
    def __init__(self, model_path: str = "kaagri-4B-q4_k_m.gguf"):
        """Initialize chatbot with GPU-accelerated model, environmental data, and RAG"""
        # Resolve path relative to script location
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(script_dir, model_path) if not os.path.isabs(model_path) else model_path
        self.conversation_history = []
        self.llm = None
        
        # Initialize environmental data fetcher
        self.env_fetcher = EnvironmentalDataFetcher()
        self.env_data = {}
        
        # Initialize RAG system
        try:
            self.rag_system = AgriculturalRAG()
            self.rag_system.load_and_embed_knowledge_base()
        except Exception as e:
            logger.warning(f"RAG system initialization failed: {e}")
            self.rag_system = None
        
        # Initialize model on startup
        if not self._initialize_model():
            raise RuntimeError("Failed to load language model")
        
        # Fetch environmental data once on startup
        self._fetch_environmental_data_on_startup()
        
    def _initialize_model(self) -> bool:
        """Initialize the Kaagri model with GPU support"""
        try:
            # Check if model file exists
            if not os.path.exists(self.model_path):
                logger.error(f"❌ Model not found: {self.model_path}")
                return False
            
            logger.info(f"Loading model: {self.model_path}")
            
            # Determine GPU layers based on CUDA availability
            if CUDA_AVAILABLE:
                n_gpu_layers = -1  # Use all layers on GPU
                logger.info(f"🚀 Using CUDA GPU: {GPU_NAME}")
            else:
                n_gpu_layers = 0  # CPU only
                logger.info("⚠️ CUDA not available, using CPU")
            
            # Optimized GPU settings for Q4_K_M quantization
            self.llm = Llama(
                model_path=self.model_path,
                n_gpu_layers=n_gpu_layers,  # Dynamic GPU layer allocation
                n_ctx=4096,                 # Reduced context for faster inference
                n_batch=512,                # Optimal batch size for Q4_K_M
                verbose=False,
                n_threads=4,
                use_mlock=True,             # Keep model in RAM (faster repeated queries)
                # Additional CUDA optimizations
                f16_kv=True,                # Use float16 for key/value cache (faster on GPU)
                logits_all=False,           # Only compute logits for last token
                use_mmap=True               # Memory-map model file
            )
            
            logger.info("✅ Model loaded with GPU acceleration")
            return True
            
        except Exception as e:
            logger.error(f"❌ Model loading failed: {e}")
            return False
    
    def _fetch_environmental_data_on_startup(self):
        """Fetch environmental data once on server startup"""
        try:
            self.env_data = self.env_fetcher.fetch_all_environmental_data()
        except Exception as e:
            logger.error(f"❌ Failed to fetch environmental data: {e}")
            # Set default values if API calls fail
            self.env_data = {
                'soil_ph': 6.0,
                'rainfall': 0.5,
                'temperature': 28.0,
                'ndvi': 0.75,
                'last_updated': datetime.now().isoformat()
            }

    def generate_response(self, user_input: str) -> str:
        """Generate response in dual-mode: Agriculture vs General chatbot"""
        try:
            # Check if input is agriculture-related
            if is_agriculture_related(user_input):
                return self._generate_agriculture_response(user_input)
            else:
                return self._generate_general_response(user_input)
                
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return f"Sorry, I encountered an error. Please try again. ({str(e)})"
    
    def _generate_agriculture_response(self, user_input: str) -> str:
        """Generate agriculture-focused response with environmental data and RAG"""
        soil_ph = self.env_data.get('soil_ph', 6.0)
        rainfall = self.env_data.get('rainfall', 0.5)
        temp = self.env_data.get('temperature', 28.0)
        ndvi = self.env_data.get('ndvi', 0.75)
        
        # Get relevant knowledge from RAG system
        rag_context = ""
        if self.rag_system:
            try:
                rag_context = self.rag_system.retrieve_relevant_knowledge(user_input)
            except Exception as e:
                logger.warning(f"RAG retrieval failed: {e}")
        
        context_section = f"\n\n**Relevant Knowledge:**\n{rag_context}\n" if rag_context else ""
        
        prompt = f"""<|user|>You are Kaagri-bot, an expert agricultural advisor specializing in Philippine farming conditions. 
You help Filipino farmers by analyzing their soil and environmental data to recommend optimal crops, give advice on how to improve conditions, or how to maintain crops.

**Current Environmental Data:**
- Soil pH: {soil_ph:.2f}
- Rainfall: {rainfall:.2f}mm/3h
- Temperature: {temp:.2f}°C
- NDVI (Vegetation Health): {ndvi:.2f}

**IMPORTANT FORMATTING RULES:**
- USE line breaks and proper spacing for readability
- STRUCTURE your response with clear sections
- USE bullet points and numbered lists
- KEEP sentences concise and clear
- NO markdown formatting

**Your Response Structure:**
🌱 SURIIN NATIN ANG KONDISYON:
- Assess each parameter with ✓/⚠/✗ and brief explanation
- Use proper line breaks between each assessment
- Example format:
  ✓ pH 6.1 - Sakto, bahagyang acidic na bagay sa maraming pananim
  ⚠ Rainfall 0.5mm - Kulang, kailangan ng irrigation

🌾 MGA REKOMENDASYON:
- List 1-3 specific crop recommendations with clear reasoning
- Match crops to the actual data values (refer to these ranges):
    * Rice: pH 5.5-6.5, rainfall 0.41-0.86mm/3h, temp 20-35°C
    * Coffee: pH 5.0-6.5, rainfall 0.41-0.68mm/3h, temp 18-28°C
    * Cacao: pH 5.5-7.0, rainfall 0.51-0.86mm/3h, temp 20-28°C
    * Banana: pH 5.5-7.0, rainfall 0.51-0.86mm/3h, temp 20-35°C
    * Corn: pH 5.5-7.5, rainfall 0.21-0.41mm/3h, temp 18-35°C
    * Tobacco: pH 5.5-7.5, rainfall 0.21-0.41mm/3h, temp 20-30°C
    * Cassava: pH 4.5-7.0, rainfall <0.41mm/3h, temp 25-35°C (drought-tolerant)
    * Sweet potato: pH 5.0-6.5, rainfall 0.21-0.51mm/3h, temp 24-30°C

🛠️ TIPS SA PAG-AALAGA:
- Provide 2-4 practical, actionable tips
- Use numbered list format (1. 2. 3.)
- Address any problematic parameters
- Include specific solutions

Communication Style:
- Use natural Taglish (mixing Tagalog and English technical terms)
- Be conversational and supportive
- Use proper formatting with line breaks
- Keep NDVI values rounded to 2 decimal places for readability

**User Question:** {user_input}{context_section}

Respond in the same language as the user's question. Use proper formatting with clear sections and line breaks. Use the relevant knowledge to provide accurate information.<|end|>
<|assistant|>"""

        # Generate response
        response = self.llm(
            prompt,
            max_tokens=600,
            temperature=0.7,
            top_p=0.9,
            top_k=40,
            repeat_penalty=1.1,
            stop=["<|end|>", "<|user|>"],
            echo=False
        )
        
        response_text = response['choices'][0]['text'].strip()
        
        # Clean up HTML tags but preserve line breaks and formatting
        response_text = re.sub(r'<[^>]+>', '', response_text)
        
        # Preserve intentional line breaks but clean up excessive whitespace
        response_text = re.sub(r'\n\s*\n\s*\n+', '\n\n', response_text)  # Max 2 consecutive newlines
        response_text = re.sub(r'[ \t]+', ' ', response_text)  # Clean up spaces/tabs but keep newlines
        response_text = response_text.strip()
        
        # Ensure proper spacing around emojis and section headers
        response_text = re.sub(r'([🌱🌾🛠️])\s*\*\*', r'\1 **', response_text)
        response_text = re.sub(r'\*\*([^*]+)\*\*', r'**\1**', response_text)
        
        # Track conversation
        self.conversation_history.append({
            "user": user_input,
            "assistant": response_text,
            "mode": "agriculture",
            "env_data": self.env_data.copy()
        })
        
        return response_text
    
    def _generate_general_response(self, user_input: str) -> str:
        """Generate general chatbot response for non-agriculture topics"""
        prompt = f"""<|user|>You are KaAgri, a helpful and friendly AI assistant. You can help with various topics and questions, but you specialize in agricultural and farming-related advice for Filipino farmers.

Since this question doesn't seem to be about agriculture, farming, or crops, I'll help you as a general assistant.

**Guidelines:**
- Be helpful, friendly, and informative
- Provide accurate and useful information
- If the user asks about agriculture later, I can provide specialized farming advice
- Respond in the same language as the user (English, Filipino, or Bisaya)
- Keep responses concise but comprehensive

**User Question:** {user_input}

Please provide a helpful response.<|end|>
<|assistant|>"""

        # Generate response
        response = self.llm(
            prompt,
            max_tokens=400,
            temperature=0.7,
            top_p=0.9,
            stop=["<|end|>", "<|user|>"],
            echo=False
        )
        
        response_text = response['choices'][0]['text'].strip()
        response_text = re.sub(r'<[^>]+>', '', response_text)
        response_text = re.sub(r'\s+', ' ', response_text)
        response_text = response_text.strip()
        
        # Track conversation
        self.conversation_history.append({
            "user": user_input,
            "assistant": response_text,
            "mode": "general"
        })
        
        return response_text
    
    def chat(self, user_input: str) -> str:
        """Main chat interface"""
        return self.generate_response(user_input)
    
    def clear_history(self):
        """Clear conversation history to free memory"""
        self.conversation_history.clear()

AGRI_KEYWORDS = [
    # English terms
    "agriculture", "farming", "farmer", "crop", "plant", "soil",
    "harvest", "irrigation", "fertilizer", "banana", "corn", "rice",
    "cassava", "sweet potato", "coffee", "cacao", "tobacco", "ndvi",
    
    # Filipino / Tagalog terms
    "agrikultura", "pagsasaka", "magsasaka", "pananim", "halaman", "lupa",
    "ani", "patubig", "abono", "saging", "mais", "palay", "bigas",
    "kamoteng kahoy", "kamote", "kape", "tsokolate", "tabako", "halaman",

    # Some common Bisaya terms (optional, useful in PH context)
    "uma", "tubig", "tanom", "abono", "saging", "mais", "humay"
]

def is_agriculture_related(user_input: str) -> bool:
    """Check if user input contains agriculture-related keywords"""
    user_input_lower = user_input.lower()
    return any(keyword in user_input_lower for keyword in AGRI_KEYWORDS)

class AgriculturalRAG:
    """RAG system for agricultural knowledge using ChromaDB"""
    
    def __init__(self, csv_path: str = "agricultural_knowledge_base.csv", collection_name: str = "agricultural_knowledge"):
        """Initialize RAG system with ChromaDB"""
        self.csv_path = csv_path
        self.collection_name = collection_name
        
        # Initialize ChromaDB client
        script_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(script_dir, "chroma_db")
        self.client = chromadb.PersistentClient(path=db_path)
        
        # Initialize embedding model (optimized for Filipino and English)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Agricultural knowledge base for RAG in Filipino"}
        )
        
        logger.info(f"Initialized ChromaDB collection: {collection_name}")
    
    def load_and_embed_knowledge_base(self) -> bool:
        """Load CSV data and create embeddings in ChromaDB"""
        try:
            # Check if collection already has data
            if self.collection.count() > 0:
                logger.info(f"Collection already contains {self.collection.count()} documents")
                return True
            
            # Load CSV data
            csv_full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), self.csv_path)
            if not os.path.exists(csv_full_path):
                logger.error(f"CSV file not found: {csv_full_path}")
                return False
            
            df = pd.read_csv(csv_full_path)
            logger.info(f"Loaded {len(df)} knowledge entries from CSV")
            
            # Prepare data for ChromaDB
            documents = []
            metadatas = []
            ids = []
            
            for _, row in df.iterrows():
                # Use the text content for embedding
                documents.append(row['text'])
                
                # Store metadata (category, source, etc.)
                metadatas.append({
                    'category': row['category'],
                    'source': row['source'],
                    'original_id': str(row['id'])
                })
                
                # Use string IDs for ChromaDB
                ids.append(f"doc_{row['id']}")
            
            # Add documents to collection in batches
            batch_size = 50
            for i in range(0, len(documents), batch_size):
                batch_docs = documents[i:i+batch_size]
                batch_metas = metadatas[i:i+batch_size]
                batch_ids = ids[i:i+batch_size]
                
                self.collection.add(
                    documents=batch_docs,
                    metadatas=batch_metas,
                    ids=batch_ids
                )
                
                logger.info(f"Added batch {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1}")
            
            logger.info(f"✅ Successfully embedded {len(documents)} documents")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading knowledge base: {e}")
            return False
    
    def retrieve_relevant_knowledge(self, query: str, n_results: int = 3) -> str:
        """Retrieve most relevant knowledge for a query and format as context"""
        try:
            # Query the collection
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            # Format results as context
            if results['documents'] and len(results['documents'][0]) > 0:
                context_parts = []
                for i, doc in enumerate(results['documents'][0]):
                    category = results['metadatas'][0][i]['category']
                    # Format: [category] knowledge_text
                    context_parts.append(f"[{category}] {doc}")
                
                context = "\n\n".join(context_parts)
                logger.info(f"Retrieved {len(context_parts)} relevant documents for query")
                return context
            
            return ""
            
        except Exception as e:
            logger.error(f"Error retrieving knowledge: {e}")
            return ""

class EnvironmentalDataFetcher:
    """Fetches environmental data from various APIs"""
    
    def __init__(self):
        self.openweather_api_key = os.getenv('OWM_API_KEY')
        # Use the actual variable names from your .env file
        self.sentinel_client_id = os.getenv('CONFIG.SH_CLIENT_ID')
        self.sentinel_client_secret = os.getenv('CONFIG.SH_CLIENT_SECRET')
        self.sentinel_instance_id = os.getenv('CONFIG.INSTANCE_ID')
        # Use Baguio coordinates as default
        self.default_lat = float(os.getenv('DEFAULT_LOCATION_LAT', '13.1022'))
        self.default_lon = float(os.getenv('DEFAULT_LOCATION_LON', '121.0583'))
        self.env_data = {}
        
    def fetch_soil_ph(self, lat: float = None, lon: float = None) -> float:
        """Fetch soil pH from SoilGrids API using correct endpoint"""
        try:
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            
            # Use the correct ISRIC endpoint (same as your working 2_soilAPI.py)
            url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}"
            
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            # Extract pH from the response structure
            if "properties" in data and "layers" in data["properties"]:
                layers = data["properties"]["layers"]
                for layer in layers:
                    if layer.get("name") == "phh2o":
                        depths = layer.get("depths", [])
                        for depth in depths:
                            if depth.get("label") == "0-5cm" and "values" in depth:
                                ph_value = depth["values"].get("mean")
                                if ph_value is not None:
                                    return ph_value / 10  # Convert from mapped units
                                    
            logger.warning("No pH data found in SoilGrids response")
            return 6.0  # Default pH value
                
        except Exception as e:
            logger.error(f"Error fetching soil pH: {e}")
            return 6.0  # Default pH value
    
    def fetch_weather_data(self, lat: float = None, lon: float = None) -> Dict[str, float]:
        """Fetch rainfall and temperature from OpenWeatherMap"""
        try:
            if not self.openweather_api_key or self.openweather_api_key == 'your_owm_api_key_here':
                logger.warning("OpenWeather API key not configured")
                return {'rainfall': 0.5, 'temperature': 28.0}  # Default values
                
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            
            url = f"https://api.openweathermap.org/data/2.5/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.openweather_api_key,
                'units': 'metric'
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                rainfall = data.get('rain', {}).get('3h', 0.0)  # 3-hour rainfall
                temperature = data['main']['temp']
                return {'rainfall': rainfall, 'temperature': temperature}
            else:
                logger.warning(f"OpenWeather API error: {response.status_code}")
                return {'rainfall': 0.5, 'temperature': 28.0}  # Default values
                
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            return {'rainfall': 0.5, 'temperature': 28.0}  # Default values
    
    def fetch_ndvi(self, lat: float = None, lon: float = None) -> float:
        """Fetch NDVI from Sentinel Hub"""
        try:
            if not self.sentinel_client_id or not self.sentinel_client_secret or not self.sentinel_instance_id:
                logger.info("Sentinel Hub credentials not configured, using mock NDVI data")
                logger.debug(f"Missing credentials - client_id: {bool(self.sentinel_client_id)}, client_secret: {bool(self.sentinel_client_secret)}, instance_id: {bool(self.sentinel_instance_id)}")
                return 0.75  # Default NDVI value
                
            # Import Sentinel Hub dependencies
            try:
                from sentinelhub import SHConfig, MimeType, CRS, BBox, SentinelHubRequest, DataCollection, bbox_to_dimensions
            except ImportError:
                logger.warning("sentinelhub package not installed, using mock NDVI data")
                return 0.75
                
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            
            # Configure Sentinel Hub
            config = SHConfig()
            config.instance_id = self.sentinel_instance_id
            config.sh_client_id = self.sentinel_client_id
            config.sh_client_secret = self.sentinel_client_secret
            
            # Create bounding box around the coordinates (small area)
            bbox_size = 0.01  # ~1km area
            bbox = BBox(bbox=[lon - bbox_size, lat - bbox_size, lon + bbox_size, lat + bbox_size], crs=CRS.WGS84)
            
            # NDVI calculation evalscript
            evalscript = """
            //VERSION=3
            function setup() {
                return {
                    input: [{
                        bands: ["B04", "B08"]
                    }],
                    output: {
                        bands: 1,
                        sampleType: "FLOAT32"
                    }
                };
            }

            function evaluatePixel(sample) {
                let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
                return [ndvi];
            }
            """
            
            # Create request
            request = SentinelHubRequest(
                evalscript=evalscript,
                input_data=[
                    SentinelHubRequest.input_data(
                        data_collection=DataCollection.SENTINEL2_L1C,
                        time_interval=('2024-01-01', '2024-12-31'),
                    )
                ],
                responses=[
                    SentinelHubRequest.output_response('default', MimeType.TIFF)
                ],
                bbox=bbox,
                size=bbox_to_dimensions(bbox, resolution=10),
                config=config
            )
            
            # Get NDVI data
            ndvi_data = request.get_data()
            
            if ndvi_data and len(ndvi_data) > 0:
                # Calculate mean NDVI value
                import numpy as np
                ndvi_array = np.array(ndvi_data[0])
                mean_ndvi = np.nanmean(ndvi_array)
                
                # Ensure NDVI is within valid range (-1 to 1)
                if -1 <= mean_ndvi <= 1:
                    return float(mean_ndvi)
                else:
                    logger.warning(f"Invalid NDVI value: {mean_ndvi}, using default")
                    return 0.75
            else:
                logger.warning("No NDVI data received from Sentinel Hub")
                return 0.75
                
        except Exception as e:
            logger.error(f"Error fetching NDVI from Sentinel Hub: {e}")
            return 0.75  # Default NDVI value
    
    def fetch_all_environmental_data(self, lat: float = None, lon: float = None) -> Dict[str, float]:
        """Fetch all environmental data and store in dictionary"""
        logger.info("🌍 Fetching environmental data...")
        
        # Fetch all data
        soil_ph = self.fetch_soil_ph(lat, lon)
        weather_data = self.fetch_weather_data(lat, lon)
        ndvi = self.fetch_ndvi(lat, lon)
        
        self.env_data = {
            'soil_ph': soil_ph,
            'rainfall': weather_data['rainfall'],
            'temperature': weather_data['temperature'],
            'ndvi': ndvi,
            'last_updated': datetime.now().isoformat()
        }
        
        logger.info(f"✅ Environmental data fetched: pH={soil_ph:.1f}, Rainfall={weather_data['rainfall']:.1f}mm, Temp={weather_data['temperature']:.1f}°C, NDVI={ndvi:.2f}")
        return self.env_data



def main():
    """Initialize and run the chatbot"""
    try:
        print("🌱 Initializing Kaagri-bot...")
        chatbot = CropRAGChatbot()
        
        print("\n✅ Crop Recommendation Chatbot Ready!")
        print("Ask me about crop suggestions and farming advice.")
        print("Type 'quit' to exit, 'clear' to reset conversation.\n")
        
        while True:
            user_input = input("You: ").strip()
            
            # Handle commands
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("Goodbye! Happy farming! 🌾")
                break
            
            if user_input.lower() == 'clear':
                chatbot.clear_history()
                print("✨ Conversation history cleared.\n")
                continue
            
            if user_input:
                print("\nBot: ", end="", flush=True)
                response = chatbot.chat(user_input)
                print(response)
                print("\n" + "-"*50 + "\n")
    
    except KeyboardInterrupt:
        print("\n\nGoodbye! 🌾")
    except Exception as e:
        logger.error(f"Fatal error: {e}")


if __name__ == "__main__":
    main()