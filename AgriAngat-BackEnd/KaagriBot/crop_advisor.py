"""
Optimized Crop Recommendation Chatbot
Streamlined for speed with minimal dependencies and reduced redundancy
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

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Check for CUDA availability (single check)
try:
    import torch
    CUDA_AVAILABLE = torch.cuda.is_available()
    GPU_NAME = torch.cuda.get_device_name(0) if CUDA_AVAILABLE else None
except ImportError:
    CUDA_AVAILABLE = False
    GPU_NAME = None

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Constants - centralized default values
DEFAULT_ENV_DATA = {
    'soil_ph': 6.0,
    'rainfall': 0.5,
    'temperature': 28.0,
    'ndvi': 0.75,
}

CROP_RANGES = """Rice: pH 5.5-6.5, rainfall 0.41-0.86mm/3h, temp 20-35°C
Coffee: pH 5.0-6.5, rainfall 0.41-0.68mm/3h, temp 18-28°C
Cacao: pH 5.5-7.0, rainfall 0.51-0.86mm/3h, temp 20-28°C
Banana: pH 5.5-7.0, rainfall 0.51-0.86mm/3h, temp 20-35°C
Corn: pH 5.5-7.5, rainfall 0.21-0.41mm/3h, temp 18-35°C
Tobacco: pH 5.5-7.5, rainfall 0.21-0.41mm/3h, temp 20-30°C
Cassava: pH 4.5-7.0, rainfall <0.41mm/3h, temp 25-35°C
Sweet potato: pH 5.0-6.5, rainfall 0.21-0.51mm/3h, temp 24-30°C"""

AGRI_KEYWORDS = [
    # English
    "agriculture", "farming", "farmer", "crop", "plant", "soil",
    "harvest", "irrigation", "fertilizer", "banana", "corn", "rice",
    "cassava", "sweet potato", "coffee", "cacao", "tobacco", "ndvi",
    # Filipino/Tagalog
    "agrikultura", "pagsasaka", "magsasaka", "pananim", "halaman", "lupa",
    "ani", "patubig", "abono", "saging", "mais", "palay", "bigas",
    "kamoteng kahoy", "kamote", "kape", "tsokolate", "tabako",
    # Bisaya
    "uma", "tubig", "tanom", "humay"
]


class CropRAGChatbot:
    """Dual-mode chatbot: General assistant + Agriculture specialist with environmental data"""
    
    def __init__(self, model_path: str = "kaagri-4B-q4_k_m.gguf"):
        """Initialize chatbot with GPU-accelerated model, environmental data, and RAG"""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(script_dir, model_path) if not os.path.isabs(model_path) else model_path
        self.conversation_history = []
        self.llm = None
        
        # Initialize environmental data fetcher
        self.env_fetcher = EnvironmentalDataFetcher()
        self.env_data = DEFAULT_ENV_DATA.copy()
        
        # Initialize RAG system
        try:
            self.rag_system = AgriculturalRAG()
            self.rag_system.load_and_embed_knowledge_base()
        except Exception as e:
            logger.warning(f"RAG system initialization failed: {e}")
            self.rag_system = None
        
        # Initialize model
        if not self._initialize_model():
            raise RuntimeError("Failed to load language model")
        
        # Fetch environmental data once on startup
        self._fetch_environmental_data_on_startup()
        
    def _initialize_model(self) -> bool:
        """Initialize the Kaagri model with GPU support"""
        try:
            if not os.path.exists(self.model_path):
                logger.error(f"❌ Model not found: {self.model_path}")
                return False
            
            logger.info(f"Loading model: {self.model_path}")
            
            # Dynamic GPU layer allocation
            n_gpu_layers = -1 if CUDA_AVAILABLE else 0
            if CUDA_AVAILABLE:
                logger.info(f"🚀 Using CUDA GPU: {GPU_NAME}")
            else:
                logger.info("⚠️ CUDA not available, using CPU")
            
            self.llm = Llama(
                model_path=self.model_path,
                n_gpu_layers=n_gpu_layers,
                n_ctx=4096,
                n_batch=512,
                verbose=False,
                n_threads=4,
                use_mlock=True,
                f16_kv=True,
                logits_all=False,
                use_mmap=True
            )
            
            logger.info("✅ Model loaded successfully")
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
            self.env_data = {**DEFAULT_ENV_DATA, 'last_updated': datetime.now().isoformat()}

    def _clean_response(self, text: str) -> str:
        """Centralized response cleaning to remove redundancy"""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Clean up excessive newlines (max 2 consecutive)
        text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
        # Clean up spaces/tabs but preserve newlines
        text = re.sub(r'[ \t]+', ' ', text)
        # Ensure proper spacing around emojis and section headers
        text = re.sub(r'([🌱🌾🛠️])\s*\*\*', r'\1 **', text)
        text = re.sub(r'\*\*([^*]+)\*\*', r'**\1**', text)
        return text.strip()

    def generate_response(self, user_input: str) -> str:
        """Generate response in dual-mode: Agriculture vs General chatbot"""
        try:
            if self._is_agriculture_related(user_input):
                return self._generate_agriculture_response(user_input)
            else:
                return self._generate_general_response(user_input)
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return f"Sorry, I encountered an error. Please try again. ({str(e)})"
    
    def _is_agriculture_related(self, user_input: str) -> bool:
        """Check if user input contains agriculture-related keywords"""
        user_input_lower = user_input.lower()
        return any(keyword in user_input_lower for keyword in AGRI_KEYWORDS)
    
    def _generate_agriculture_response(self, user_input: str) -> str:
        """Generate agriculture-focused response with environmental data and RAG"""
        # Extract environmental data
        soil_ph = self.env_data.get('soil_ph', DEFAULT_ENV_DATA['soil_ph'])
        rainfall = self.env_data.get('rainfall', DEFAULT_ENV_DATA['rainfall'])
        temp = self.env_data.get('temperature', DEFAULT_ENV_DATA['temperature'])
        ndvi = self.env_data.get('ndvi', DEFAULT_ENV_DATA['ndvi'])
        
        # Get relevant knowledge from RAG
        rag_context = ""
        if self.rag_system:
            try:
                rag_context = self.rag_system.retrieve_relevant_knowledge(user_input)
            except Exception as e:
                logger.warning(f"RAG retrieval failed: {e}")
        
        context_section = f"\n\n**Relevant Knowledge:**\n{rag_context}\n" if rag_context else ""
        
        # Streamlined prompt with anti-repetition instructions
        prompt = f"""<|user|>You are Kaagri-bot, an expert agricultural advisor for Philippine farming.

Current Environmental Data:
- Soil pH: {soil_ph:.2f}\n
- Rainfall: {rainfall:.2f}mm/3h\n
- Temperature: {temp:.2f}°C\n
- NDVI: {ndvi:.2f}\n

CRITICAL INSTRUCTIONS:
1. BE CONCISE - Keep total response under 400 words
2. NO REPETITION - Never repeat the same advice or information
3. STRUCTURE: Use this format ONLY:
   🌱 KONDISYON (Assessment with ✓/⚠/✗ - max 3-4 lines)
   🌾 REKOMENDASYON (1-2 crops with brief reason)
   🛠️ TIPS (2-3 actionable tips, numbered)
4. Match crops to actual data using these ranges:
{CROP_RANGES}
5. Use natural Taglish, proper line breaks
6. Respond in user's language
7. NEVER use asterisks (*) for emphasis

**User Question:** {user_input}{context_section}<|end|>
<|assistant|>"""

        # Generate with anti-repetition parameters
        response = self.llm(
            prompt,
            max_tokens=500,  # Reduced from 600
            temperature=0.7,
            top_p=0.9,
            top_k=40,
            repeat_penalty=1.15,  # Increased from 1.1 to reduce repetition
            frequency_penalty=0.3,  # Add frequency penalty
            presence_penalty=0.2,   # Add presence penalty
            stop=["<|end|>", "<|user|>", "\n\n\n"],  # Stop on excessive newlines
            echo=False
        )
        
        response_text = self._clean_response(response['choices'][0]['text'])
        
        # Track conversation (simplified - no full env_data storage)
        self.conversation_history.append({
            "user": user_input,
            "assistant": response_text,
            "mode": "agriculture"
        })
        
        return response_text
    
    def _generate_general_response(self, user_input: str) -> str:
        """Generate general chatbot response for non-agriculture topics"""
        prompt = f"""<|user|>You are KaAgri, a helpful AI assistant specializing in agriculture for Filipino farmers.

This question isn't about farming, so I'll help as a general assistant.

INSTRUCTIONS:
- Be helpful and concise (under 50 words)
- Introduce yourself as KaAgri concisely
- NO repetition of information
- Respond in user's language (English/Filipino/Bisaya)
- If user asks about agriculture later, provide specialized advice

**User Question:** {user_input}<|end|>
<|assistant|>"""

        response = self.llm(
            prompt,
            max_tokens=350,  # Reduced from 400
            temperature=0.7,
            top_p=0.9,
            repeat_penalty=1.15,  # Increased
            frequency_penalty=0.3,
            presence_penalty=0.2,
            stop=["<|end|>", "<|user|>"],
            echo=False
        )
        
        response_text = self._clean_response(response['choices'][0]['text'])
        
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


class AgriculturalRAG:
    """RAG system for agricultural knowledge using ChromaDB"""
    
    def __init__(self, csv_path: str = "agricultural_knowledge_base.csv", collection_name: str = "agricultural_knowledge"):
        self.csv_path = csv_path
        self.collection_name = collection_name
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        db_path = os.path.join(script_dir, "chroma_db")
        self.client = chromadb.PersistentClient(path=db_path)
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Agricultural knowledge base for RAG"}
        )
        
        logger.info(f"Initialized ChromaDB collection: {collection_name}")
    
    def load_and_embed_knowledge_base(self) -> bool:
        """Load CSV data and create embeddings in ChromaDB"""
        try:
            if self.collection.count() > 0:
                logger.info(f"Collection already contains {self.collection.count()} documents")
                return True
            
            csv_full_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), self.csv_path)
            if not os.path.exists(csv_full_path):
                logger.error(f"CSV file not found: {csv_full_path}")
                return False
            
            df = pd.read_csv(csv_full_path)
            logger.info(f"Loaded {len(df)} knowledge entries from CSV")
            
            documents = df['text'].tolist()
            metadatas = [{'category': row['category'], 'source': row['source'], 'original_id': str(row['id'])} 
                        for _, row in df.iterrows()]
            ids = [f"doc_{row['id']}" for _, row in df.iterrows()]
            
            # Batch processing
            batch_size = 50
            for i in range(0, len(documents), batch_size):
                self.collection.add(
                    documents=documents[i:i+batch_size],
                    metadatas=metadatas[i:i+batch_size],
                    ids=ids[i:i+batch_size]
                )
                logger.info(f"Added batch {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1}")
            
            logger.info(f"✅ Successfully embedded {len(documents)} documents")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error loading knowledge base: {e}")
            return False
    
    def retrieve_relevant_knowledge(self, query: str, n_results: int = 3) -> str:
        """Retrieve most relevant knowledge for a query"""
        try:
            results = self.collection.query(query_texts=[query], n_results=n_results)
            
            if results['documents'] and len(results['documents'][0]) > 0:
                context_parts = [f"[{results['metadatas'][0][i]['category']}] {doc}" 
                               for i, doc in enumerate(results['documents'][0])]
                logger.info(f"Retrieved {len(context_parts)} relevant documents")
                return "\n\n".join(context_parts)
            return ""
            
        except Exception as e:
            logger.error(f"Error retrieving knowledge: {e}")
            return ""


class EnvironmentalDataFetcher:
    """Fetches environmental data from various APIs"""
    
    def __init__(self):
        self.openweather_api_key = os.getenv('OWM_API_KEY')
        self.sentinel_client_id = os.getenv('CONFIG.SH_CLIENT_ID')
        self.sentinel_client_secret = os.getenv('CONFIG.SH_CLIENT_SECRET')
        self.sentinel_instance_id = os.getenv('CONFIG.INSTANCE_ID')
        self.default_lat = float(os.getenv('DEFAULT_LOCATION_LAT', '14.631044'))
        self.default_lon = float(os.getenv('DEFAULT_LOCATION_LON', '121.240553'))
        
    def fetch_soil_ph(self, lat: float = None, lon: float = None) -> float:
        """Fetch soil pH from SoilGrids API"""
        try:
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}"
            
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if "properties" in data and "layers" in data["properties"]:
                for layer in data["properties"]["layers"]:
                    if layer.get("name") == "phh2o":
                        for depth in layer.get("depths", []):
                            if depth.get("label") == "0-5cm" and "values" in depth:
                                ph_value = depth["values"].get("mean")
                                if ph_value is not None:
                                    return ph_value / 10
                                    
            logger.warning("No pH data found in SoilGrids response")
            return DEFAULT_ENV_DATA['soil_ph']
                
        except Exception as e:
            logger.error(f"Error fetching soil pH: {e}")
            return DEFAULT_ENV_DATA['soil_ph']
    
    def fetch_weather_data(self, lat: float = None, lon: float = None) -> Dict[str, float]:
        """Fetch rainfall and temperature from OpenWeatherMap"""
        try:
            if not self.openweather_api_key or self.openweather_api_key == 'your_owm_api_key_here':
                logger.warning("OpenWeather API key not configured")
                return {'rainfall': DEFAULT_ENV_DATA['rainfall'], 
                       'temperature': DEFAULT_ENV_DATA['temperature']}
                
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            
            url = f"https://api.openweathermap.org/data/2.5/weather"
            params = {'lat': lat, 'lon': lon, 'appid': self.openweather_api_key, 'units': 'metric'}
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'rainfall': data.get('rain', {}).get('3h', 0.0),
                    'temperature': data['main']['temp']
                }
            else:
                logger.warning(f"OpenWeather API error: {response.status_code}")
                return {'rainfall': DEFAULT_ENV_DATA['rainfall'], 
                       'temperature': DEFAULT_ENV_DATA['temperature']}
                
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            return {'rainfall': DEFAULT_ENV_DATA['rainfall'], 
                   'temperature': DEFAULT_ENV_DATA['temperature']}
    
    def fetch_ndvi(self, lat: float = None, lon: float = None) -> float:
        """Fetch NDVI from Sentinel Hub"""
        try:
            if not all([self.sentinel_client_id, self.sentinel_client_secret, self.sentinel_instance_id]):
                logger.info("Sentinel Hub credentials not configured")
                return DEFAULT_ENV_DATA['ndvi']
                
            lat = lat or self.default_lat
            lon = lon or self.default_lon
            
            config = SHConfig()
            config.instance_id = self.sentinel_instance_id
            config.sh_client_id = self.sentinel_client_id
            config.sh_client_secret = self.sentinel_client_secret
            
            bbox_size = 0.01
            bbox = BBox(bbox=[lon - bbox_size, lat - bbox_size, lon + bbox_size, lat + bbox_size], crs=CRS.WGS84)
            
            evalscript = """
            //VERSION=3
            function setup() {
                return {
                    input: [{bands: ["B04", "B08"]}],
                    output: {bands: 1, sampleType: "FLOAT32"}
                };
            }
            function evaluatePixel(sample) {
                let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
                return [ndvi];
            }
            """
            
            request = SentinelHubRequest(
                evalscript=evalscript,
                input_data=[SentinelHubRequest.input_data(
                    data_collection=DataCollection.SENTINEL2_L1C,
                    time_interval=('2024-01-01', '2024-12-31'),
                )],
                responses=[SentinelHubRequest.output_response('default', MimeType.TIFF)],
                bbox=bbox,
                size=bbox_to_dimensions(bbox, resolution=10),
                config=config
            )
            
            ndvi_data = request.get_data()
            
            if ndvi_data and len(ndvi_data) > 0:
                import numpy as np
                mean_ndvi = np.nanmean(np.array(ndvi_data[0]))
                if -1 <= mean_ndvi <= 1:
                    return float(mean_ndvi)
                    
            return DEFAULT_ENV_DATA['ndvi']
                
        except Exception as e:
            logger.error(f"Error fetching NDVI: {e}")
            return DEFAULT_ENV_DATA['ndvi']
    
    def fetch_all_environmental_data(self, lat: float = None, lon: float = None) -> Dict[str, float]:
        """Fetch all environmental data"""
        logger.info("🌍 Fetching environmental data...")
        
        soil_ph = self.fetch_soil_ph(lat, lon)
        weather_data = self.fetch_weather_data(lat, lon)
        ndvi = self.fetch_ndvi(lat, lon)
        
        env_data = {
            'soil_ph': soil_ph,
            'rainfall': weather_data['rainfall'],
            'temperature': weather_data['temperature'],
            'ndvi': ndvi,
            'last_updated': datetime.now().isoformat()
        }
        
        logger.info(f"✅ Data fetched: pH={soil_ph:.1f}, Rain={weather_data['rainfall']:.1f}mm, "
                   f"Temp={weather_data['temperature']:.1f}°C, NDVI={ndvi:.2f}")
        return env_data


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