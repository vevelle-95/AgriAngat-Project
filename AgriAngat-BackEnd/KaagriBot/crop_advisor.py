"""
RAG-based Crop Recommendation System
Combines crop knowledge database with LLM reasoning for conversational crop suggestions
"""

import pandas as pd
import numpy as np
import json
import chromadb
from llama_cpp import Llama
from typing import List, Dict, Any, Optional
import logging
import os

# Set environment variable to avoid transformers compatibility issues
os.environ['SENTENCE_TRANSFORMERS_HOME'] = './models'

# Import with error handling for GPU compatibility
try:
    import torch
    print("PyTorch version:", torch.__version__)
    print("CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("GPU:", torch.cuda.get_device_name(0))
        device = "cuda"
    else:
        device = "cpu"
        print("Using CPU")
except ImportError as e:
    print(f"PyTorch import error: {e}")
    device = "cpu"

try:
    from sentence_transformers import SentenceTransformer
    TRANSFORMERS_AVAILABLE = True
except ImportError as e:
    print(f"SentenceTransformers import error: {e}")
    print("Falling back to basic text matching...")
    TRANSFORMERS_AVAILABLE = False

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CropKnowledgeBase:
    """Manages crop data and vector database for RAG retrieval"""
    
    def __init__(self, csv_path: str = None, db_path: str = "./chroma_db"):
        # Get the directory where this script is located
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Set default CSV path relative to script location
        if csv_path is None:
            self.csv_path = os.path.join(script_dir, "ecocrop.csv")
        else:
            self.csv_path = csv_path
            
        self.db_path = db_path
        self.df = None
        self.client = None
        self.collection = None
        
        # ✅ Load model on GPU if available, with fallback
        if TRANSFORMERS_AVAILABLE:
            try:
                self.encoder = SentenceTransformer('all-MiniLM-L6-v2', device=device)
                logger.info(f"SentenceTransformer loaded on {device}")
            except Exception as e:
                logger.warning(f"Failed to load SentenceTransformer on {device}: {e}")
                try:
                    self.encoder = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
                    logger.info("SentenceTransformer loaded on CPU as fallback")
                except Exception as e2:
                    logger.error(f"Failed to load SentenceTransformer on CPU: {e2}")
                    self.encoder = None
        else:
            self.encoder = None
        
        # Column mappings from your existing code
        self.cols = {
            "name": "COMNAME",
            "sci": "ScientificName", 
            "ph_min": "PHMIN",
            "ph_max": "PHMAX",
            "ph_opt_min": "PHOPMN",
            "ph_opt_max": "PHOPMX",
            "rain_min": "RMIN",
            "rain_max": "RMAX",
            "rain_opt_min": "ROPMN",
            "rain_opt_max": "ROPMX",
            "t_opt_min": "TOPMN",
            "t_opt_max": "TOPMX",
            "temp_min": "TMIN",
            "temp_max": "TMAX",
            "cliz": "CLIZ",
            "cat": "CAT",
            "lifo": "LIFO",
            "habi": "HABI"
        }
        
    def load_data(self):
        """Load crop data from CSV"""
        try:
            # Try multiple encodings for Windows compatibility
            encodings_to_try = ['utf-8', 'utf-8-sig', 'latin1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings_to_try:
                try:
                    logger.info(f"Trying encoding: {encoding}")
                    self.df = pd.read_csv(self.csv_path, encoding=encoding)
                    logger.info(f"Successfully loaded {len(self.df)} crop records with {encoding}")
                    return True
                except UnicodeDecodeError:
                    continue
                except Exception as e:
                    logger.warning(f"Failed with {encoding}: {e}")
                    continue
            
            # If all encodings fail, try chardet
            try:
                import chardet
                with open(self.csv_path, "rb") as f:
                    raw = f.read(100000)
                result = chardet.detect(raw)
                detected_encoding = result["encoding"]
                
                if detected_encoding:
                    logger.info(f"Chardet detected encoding: {detected_encoding}")
                    self.df = pd.read_csv(self.csv_path, encoding=detected_encoding)
                    logger.info(f"Loaded {len(self.df)} crop records with detected encoding")
                    return True
            except Exception as e:
                logger.warning(f"Chardet failed: {e}")
            
            logger.error("Could not load CSV with any encoding")
            return False
            
        except Exception as e:
            logger.error(f"Error loading crop data: {e}")
            return False
    
    def create_vector_db(self):
        """Create ChromaDB vector database from crop data"""
        if self.df is None:
            logger.error("No data loaded. Call load_data() first.")
            return False
            
        try:
            # Initialize ChromaDB
            self.client = chromadb.PersistentClient(path=self.db_path)
            
            # Create or get collection
            collection_name = "crop_knowledge"
            try:
                # Try to get existing collection
                self.collection = self.client.get_collection(collection_name)
                logger.info("Using existing vector database")
                return True
            except Exception:
                # Collection doesn't exist, create new one
                try:
                    self.collection = self.client.create_collection(
                        name=collection_name,
                        metadata={"description": "Crop knowledge base for RAG"}
                    )
                    logger.info("Creating new vector database")
                except Exception as e:
                    # If create fails, try to delete and recreate
                    logger.warning(f"Collection creation failed, trying to reset: {e}")
                    try:
                        self.client.delete_collection(collection_name)
                    except:
                        pass
                    self.collection = self.client.create_collection(
                        name=collection_name,
                        metadata={"description": "Crop knowledge base for RAG"}
                    )
                    logger.info("Reset and created new vector database")
            
            # Process each crop
            documents = []
            metadatas = []
            ids = []
            
            for idx, row in self.df.iterrows():
                crop_doc = self._create_crop_document(row)
                if crop_doc:
                    documents.append(crop_doc["text"])
                    metadatas.append(crop_doc["metadata"])
                    ids.append(f"crop_{idx}")
            
            # Add to vector database in batches
            batch_size = 100
            for i in range(0, len(documents), batch_size):
                batch_docs = documents[i:i+batch_size]
                batch_meta = metadatas[i:i+batch_size]
                batch_ids = ids[i:i+batch_size]
                
                self.collection.add(
                    documents=batch_docs,
                    metadatas=batch_meta,
                    ids=batch_ids
                )
            
            logger.info(f"Added {len(documents)} crop documents to vector database")
            return True
            
        except Exception as e:
            logger.error(f"Error creating vector database: {e}")
            return False
    
    def _create_crop_document(self, row: pd.Series) -> Optional[Dict]:
        """Create searchable document from crop row"""
        try:
            # Get crop names
            common_name = str(row.get(self.cols["name"], "")).strip()
            sci_name = str(row.get(self.cols["sci"], "")).strip()
            
            if not common_name or common_name == "nan":
                if not sci_name or sci_name == "nan":
                    return None
                crop_name = sci_name
            else:
                crop_name = common_name
            
            # Build descriptive text for vector search
            text_parts = [f"Crop: {crop_name}"]
            
            if sci_name and sci_name != "nan" and sci_name != common_name:
                text_parts.append(f"Scientific name: {sci_name}")
            
            # Add category information
            category = str(row.get(self.cols["cat"], "")).strip()
            if category and category != "nan":
                text_parts.append(f"Category: {category}")
            
            life_form = str(row.get(self.cols["lifo"], "")).strip()
            if life_form and life_form != "nan":
                text_parts.append(f"Life form: {life_form}")
            
            habit = str(row.get(self.cols["habi"], "")).strip()
            if habit and habit != "nan":
                text_parts.append(f"Growth habit: {habit}")
            
            # Add environmental requirements
            self._add_range_info(text_parts, row, "pH", "ph_opt_min", "ph_opt_max", "ph_min", "ph_max")
            self._add_range_info(text_parts, row, "rainfall", "rain_opt_min", "rain_opt_max", "rain_min", "rain_max", "mm/year")
            self._add_range_info(text_parts, row, "temperature", "t_opt_min", "t_opt_max", "temp_min", "temp_max", "°C")
            
            # Climate zones
            climate = str(row.get(self.cols["cliz"], "")).strip()
            if climate and climate != "nan":
                text_parts.append(f"Climate zones: {climate}")
            
            document_text = ". ".join(text_parts)
            
            # Create metadata for filtering and retrieval
            metadata = {
                "crop_name": crop_name,
                "scientific_name": sci_name if sci_name != "nan" else "",
                "category": category if category != "nan" else "",
                "life_form": life_form if life_form != "nan" else "",
                "ph_opt_min": self._safe_float(row.get(self.cols["ph_opt_min"])),
                "ph_opt_max": self._safe_float(row.get(self.cols["ph_opt_max"])),
                "rain_opt_min": self._safe_float(row.get(self.cols["rain_opt_min"])),
                "rain_opt_max": self._safe_float(row.get(self.cols["rain_opt_max"])),
                "temp_opt_min": self._safe_float(row.get(self.cols["t_opt_min"])),
                "temp_opt_max": self._safe_float(row.get(self.cols["t_opt_max"])),
                "climate": climate if climate != "nan" else ""
            }
            
            return {"text": document_text, "metadata": metadata}
            
        except Exception as e:
            logger.warning(f"Error processing crop row: {e}")
            return None
    
    def _add_range_info(self, text_parts: List[str], row: pd.Series, param_name: str, 
                       opt_min_col: str, opt_max_col: str, abs_min_col: str, abs_max_col: str, unit: str = ""):
        """Add parameter range information to text"""
        opt_min = self._safe_float(row.get(self.cols[opt_min_col]))
        opt_max = self._safe_float(row.get(self.cols[opt_max_col]))
        abs_min = self._safe_float(row.get(self.cols[abs_min_col]))
        abs_max = self._safe_float(row.get(self.cols[abs_max_col]))
        
        if opt_min is not None and opt_max is not None:
            text_parts.append(f"Optimal {param_name}: {opt_min}-{opt_max} {unit}".strip())
        elif abs_min is not None and abs_max is not None:
            text_parts.append(f"{param_name.title()} range: {abs_min}-{abs_max} {unit}".strip())
    
    def _safe_float(self, value) -> Optional[float]:
        """Safely convert value to float"""
        try:
            if pd.isna(value):
                return None
            return float(value)
        except (ValueError, TypeError):
            return None
    
    def search_crops(self, query: str, n_results: int = 10) -> List[Dict]:
        """Search for relevant crops using vector similarity or text matching fallback"""
        if not self.collection:
            logger.error("Vector database not initialized")
            return self._fallback_text_search(query, n_results)
        
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            crops = []
            if results["documents"] and results["documents"][0]:
                for i, doc in enumerate(results["documents"][0]):
                    crop_info = {
                        "document": doc,
                        "metadata": results["metadatas"][0][i],
                        "distance": results["distances"][0][i] if "distances" in results else None
                    }
                    crops.append(crop_info)
            
            return crops
            
        except Exception as e:
            logger.error(f"Error searching crops: {e}")
            return self._fallback_text_search(query, n_results)
    
    def _fallback_text_search(self, query: str, n_results: int = 10) -> List[Dict]:
        """Fallback text-based search when vector search fails"""
        if self.df is None:
            return []
        
        query_lower = query.lower()
        matches = []
        
        for idx, row in self.df.iterrows():
            score = 0
            doc = self._create_crop_document(row)
            if not doc:
                continue
                
            # Simple text matching
            text_lower = doc["text"].lower()
            crop_name = doc["metadata"]["crop_name"].lower()
            
            # Score based on keyword matches
            for word in query_lower.split():
                if word in crop_name:
                    score += 3
                elif word in text_lower:
                    score += 1
            
            if score > 0:
                matches.append({
                    "document": doc["text"],
                    "metadata": doc["metadata"],
                    "distance": 1.0 / (score + 1)  # Lower distance = better match
                })
        
        # Sort by score (lower distance = better match)
        matches.sort(key=lambda x: x["distance"])
        return matches[:n_results]

class CropRAGChatbot:
    """RAG-based chatbot for crop recommendations using Phi-4-mini-flash-reasoning"""
    
    def __init__(self, knowledge_base: CropKnowledgeBase, model_path: str = "../../../../microsoft_Phi-4-mini-instruct-Q4_K_M.gguf"):
        self.kb = knowledge_base
        self.model_path = model_path
        self.conversation_history = []
        self.llm = None
        self._initialize_model()
        
    def _initialize_model(self) -> bool:
        """Initialize the Phi-4 model with GPU support"""
        try:
            if not os.path.exists(self.model_path):
                logger.error(f"Model file not found at: {self.model_path}")
                return False
                
            logger.info(f"Loading Phi-4 model from: {self.model_path}")
            
            # Initialize with GPU support (n_gpu_layers=-1 uses all available GPU layers)
            self.llm = Llama(
                model_path=self.model_path,
                n_gpu_layers=-1,  # Use all GPU layers for maximum acceleration
                n_ctx=8192,      # Context length for long conversations
                n_batch=512,     # Batch size for processing
                verbose=False,   # Reduce output verbosity
                n_threads=4      # Number of CPU threads for parts not on GPU
            )
            
            logger.info("✅ Phi-4 model loaded successfully with GPU acceleration")
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.llm = None
            return False
    
    def extract_environmental_conditions(self, user_input: str) -> Dict[str, Any]:
        """Extract environmental conditions from user input using LLM"""
        if not self.llm:
            logger.warning("Model not loaded, skipping condition extraction")
            return {}
            
        extraction_prompt = f"""<|user|>Extract environmental conditions from this text: "{user_input}"
        
Return ONLY a JSON object with these fields (use null for missing values):
{{
    "soil_ph": number or null,
    "rainfall_mm": number or null, 
    "temperature_c": number or null,
    "climate_type": "string or null",
    "location": "string or null",
    "crop_category": "string or null"
}}

Examples:
- "pH 6.5" → "soil_ph": 6.5
- "1200mm rainfall" → "rainfall_mm": 1200
- "25 degrees" → "temperature_c": 25
- "rizal" → "location": "rizal"
- "tropical climate" → "climate_type": "tropical"<|end|><|assistant|>"""
        
        try:
            response = self.llm(
                extraction_prompt,
                max_tokens=200,
                temperature=0.1,
                stop=["<|end|>", "<|user|"],
                echo=False
            )
            
            response_text = response['choices'][0]['text'].strip()
            
            # Parse JSON response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
        except Exception as e:
            logger.warning(f"Error extracting conditions: {e}")
        
        return {}
    
    def filter_crops_by_conditions(self, crops: List[Dict], conditions: Dict[str, Any]) -> List[Dict]:
        """Filter crops based on environmental conditions"""
        filtered_crops = []
        
        for crop in crops:
            metadata = crop["metadata"]
            suitable = True
            reasons = []
            
            # Check pH compatibility
            if conditions.get("soil_ph"):
                ph = conditions["soil_ph"]
                ph_min = metadata.get("ph_opt_min")
                ph_max = metadata.get("ph_opt_max")
                
                if ph_min is not None and ph_max is not None:
                    if ph_min <= ph <= ph_max:
                        reasons.append(f"pH {ph} within optimal range [{ph_min}-{ph_max}]")
                    else:
                        suitable = False
                        reasons.append(f"pH {ph} outside optimal range [{ph_min}-{ph_max}]")
            
            # Check rainfall compatibility
            if conditions.get("rainfall_mm"):
                rainfall = conditions["rainfall_mm"]
                rain_min = metadata.get("rain_opt_min")
                rain_max = metadata.get("rain_opt_max")
                
                if rain_min is not None and rain_max is not None:
                    if rain_min <= rainfall <= rain_max:
                        reasons.append(f"rainfall {rainfall}mm within optimal range [{rain_min}-{rain_max}]mm")
                    else:
                        suitable = False
                        reasons.append(f"rainfall {rainfall}mm outside optimal range [{rain_min}-{rain_max}]mm")
            
            # Check temperature compatibility
            if conditions.get("temperature_c"):
                temp = conditions["temperature_c"]
                temp_min = metadata.get("temp_opt_min")
                temp_max = metadata.get("temp_opt_max")
                
                if temp_min is not None and temp_max is not None:
                    if temp_min <= temp <= temp_max:
                        reasons.append(f"temperature {temp}°C within optimal range [{temp_min}-{temp_max}]°C")
                    else:
                        suitable = False
                        reasons.append(f"temperature {temp}°C outside optimal range [{temp_min}-{temp_max}]°C")
            
            if suitable:
                crop["suitability_reasons"] = reasons
                filtered_crops.append(crop)
        
        return filtered_crops
    
    def generate_response(self, user_input: str) -> str:
        """Generate conversational response with crop recommendations"""
        try:
            # Extract environmental conditions
            conditions = self.extract_environmental_conditions(user_input)
            logger.info(f"Extracted conditions: {conditions}")
            
            # Search for relevant crops
            search_query = f"{user_input} crop agriculture farming"
            crops = self.kb.search_crops(search_query, n_results=15)
            
            # Filter crops by environmental conditions
            if conditions:
                suitable_crops = self.filter_crops_by_conditions(crops, conditions)
                if suitable_crops:
                    crops = suitable_crops[:8]  # Top 8 suitable crops
                else:
                    crops = crops[:5]  # Fallback to similarity search
            else:
                crops = crops[:8]
            
            # Build context for LLM
            context = self._build_context(crops, conditions, user_input)
            
            # Generate reasoning response
            response_prompt = f"""<|user|>You are Kaagri-bot, an expert agricultural advisor helping well-seasoned farmers choose the best crops based on environmental conditions and available crop data. You speak the language of the user input (English, Filipino, or Bisaya). If you cannot understand their language, inform them and default to Filipino.

Your goal is to help farmers maximize crop success and improve their financial situation, including tips that could help them secure loans or reduce financial burdens.

User question: "{user_input}"

Environmental conditions detected: {json.dumps(conditions, indent=2)}

Available crop information:
{context}

For only the FIRST query, be concise and follow this structure if there are environmental conditions mentioned:

THIS STRUCTURE: Provide a helpful, conversational response that:
1. Acknowledges their question/situation
2. Recommends 1 - 3 most suitable crops with clear reasoning
3. Explains WHY each crop is suitable based on environmental factors
4. Reminds them to regularly maintain the crops
5. Gives practical growing tips if relevant
6. Asks a follow-up question to better help them
7. If the user uses profane or offensive language, politely discourage it or redirect the conversation.

GUIDELINES:
For the ENTIRE conversation, be friendly, knowledgeable, and specific about giving crop-related advice.
If you are unsure about something, answer but clearly say so.<|end|><|assistant|>"""
            
            if not self.llm:
                return "Sorry, the language model is not available. Please check the model setup."
            
            response = self.llm(
                response_prompt,
                max_tokens=800,
                temperature=0.7,
                stop=["<|end|>", "<|user|"],
                echo=False
            )
            
            response_text = response['choices'][0]['text'].strip()
            
            # Store conversation
            self.conversation_history.append({
                "user": user_input,
                "assistant": response_text,
                "conditions": conditions,
                "crops_considered": len(crops)
            })
            
            return response_text
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return f"I apologize, but I encountered an error while processing your request. Please try again or contact support. Error: {str(e)}"
    
    def _build_context(self, crops: List[Dict], conditions: Dict[str, Any], user_input: str) -> str:
        """Build context string for LLM from crop data"""
        if not crops:
            return "No specific crop data found for this query."
        
        context_parts = []
        for i, crop in enumerate(crops, 1):
            metadata = crop["metadata"]
            
            crop_info = [f"{i}. {metadata['crop_name']}"]
            
            if metadata.get("scientific_name"):
                crop_info.append(f"   Scientific name: {metadata['scientific_name']}")
            
            if metadata.get("category"):
                crop_info.append(f"   Category: {metadata['category']}")
            
            # Environmental requirements
            env_reqs = []
            if metadata.get("ph_opt_min") and metadata.get("ph_opt_max"):
                env_reqs.append(f"pH: {metadata['ph_opt_min']}-{metadata['ph_opt_max']}")
            
            if metadata.get("rain_opt_min") and metadata.get("rain_opt_max"):
                env_reqs.append(f"rainfall: {metadata['rain_opt_min']}-{metadata['rain_opt_max']}mm")
            
            if metadata.get("temp_opt_min") and metadata.get("temp_opt_max"):
                env_reqs.append(f"temperature: {metadata['temp_opt_min']}-{metadata['temp_opt_max']}°C")
            
            if env_reqs:
                crop_info.append(f"   Optimal conditions: {', '.join(env_reqs)}")
            
            # Suitability reasoning if available
            if "suitability_reasons" in crop:
                crop_info.append(f"   Suitability: {'; '.join(crop['suitability_reasons'])}")
            
            context_parts.append("\n".join(crop_info))
        
        return "\n\n".join(context_parts)
    
    def chat(self, user_input: str) -> str:
        """Main chat interface"""
        if not self.llm:
            if not self._initialize_model():
                return "Sorry, I can't load the Phi-4 language model. Please check that the model file exists and you have sufficient GPU memory."
        
        return self.generate_response(user_input)

def main():
    """Initialize and test the RAG system"""
    # Initialize knowledge base
    kb = CropKnowledgeBase()
    
    print("Loading crop data...")
    if not kb.load_data():
        print("Failed to load crop data")
        return
    
    print("Creating vector database...")
    if not kb.create_vector_db():
        print("Failed to create vector database")
        return
    
    # Initialize chatbot
    chatbot = CropRAGChatbot(kb)
    
    print("\n🌱 Crop Recommendation Chatbot Ready!")
    print("Ask me about crop suggestions based on your environmental conditions.")
    print("Type 'quit' to exit.\n")
    
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Goodbye! Happy farming! 🌾")
            break
        
        if user_input:
            print("\nBot: ", end="")
            response = chatbot.chat(user_input)
            print(response)
            print("\n" + "-"*50 + "\n")

if __name__ == "__main__":
    main()