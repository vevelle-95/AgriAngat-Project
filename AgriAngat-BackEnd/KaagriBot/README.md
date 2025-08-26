# 🌱 Crop RAG Chatbot

An intelligent crop recommendation system that combines Retrieval-Augmented Generation (RAG) with Meta Llama 3.1 8B for conversational agricultural guidance.

## Features

- **🤖 Conversational AI**: Natural language interface for crop recommendations
- **📊 RAG Technology**: Retrieves relevant crop data for accurate suggestions
- **🧠 LLM Reasoning**: Meta Llama 3.1 8B provides intelligent explanations
- **🌾 Comprehensive Database**: 2500+ crop varieties from FAO EcoCrop
- **🌐 Web Interface**: Beautiful Streamlit dashboard
- **📱 CLI Interface**: Terminal-based chat for developers

## System Architecture

```
User Query → Environmental Extraction → Vector Search → Crop Filtering → LLM Reasoning → Response
```

### Components

1. **CropKnowledgeBase**: Manages crop data and vector database
2. **CropRAGChatbot**: Orchestrates RAG retrieval and LLM reasoning
3. **Vector Database**: ChromaDB for semantic crop search
4. **LLM Integration**: Ollama with Meta Llama 3.1 8B

## Installation

### Prerequisites

- Python 3.8+
- [Ollama](https://ollama.com/download) installed and running
- Git (for cloning)

### Quick Setup

1. **Clone/Download the project files**

2. **Run the setup script**:
   ```bash
   python setup.py
   ```

3. **Manual setup (if needed)**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Install and start Ollama
   # Visit: https://ollama.com/download
   
   # Pull Llama 3.1 8B model
   ollama pull llama3.1:8b
   ```

## Usage

### Web Interface (Recommended)

```bash
streamlit run streamlit_app.py
```

Open your browser to `http://localhost:8501`

### Terminal Interface

```bash
python crop_rag_system.py
```

### Example Conversations

**Environmental Conditions:**
```
User: I have soil with pH 6.5, get 1200mm rainfall annually, and temperature around 25°C. What crops should I grow?

Bot: Based on your excellent growing conditions, I'd recommend several crops that thrive in your environment:

🌾 **Top Recommendations:**
1. **Okra** - Perfect match! pH 6.5 is within optimal range [5.5-7.0], rainfall 1200mm fits [600-1200mm], and 25°C is ideal [20-30°C]
2. **Bush Spinach** - Excellent choice for your conditions with optimal rainfall [1200-2000mm]
3. **Sweet Acacia** - Very adaptable, handles your pH and rainfall well

**Why these work:**
- Your soil pH of 6.5 is in the sweet spot for most vegetables
- 1200mm rainfall provides adequate moisture without oversaturation
- 25°C temperature supports active growth for tropical/subtropical crops

**Growing Tips:**
- Consider succession planting for continuous harvest
- Your conditions support year-round growing
- Monitor drainage to prevent waterlogging during heavy rains

What type of crops are you most interested in? Vegetables, fruits, or perhaps cash crops?
```

**Location-Based Query:**
```
User: What vegetables grow well in tropical climate?

Bot: Tropical climates offer excellent opportunities for diverse vegetable production! Here are my top recommendations:

🥬 **Leafy Greens:**
- **Island Cabbage** - Heat-tolerant, thrives in tropical humidity
- **Bush Spinach** - Continuous harvest, loves warm weather

🍅 **Fruiting Vegetables:**
- **Okra** - Classic tropical vegetable, very productive
- **Musk Okra** - Aromatic variety, excellent for tropical zones

🌿 **Considerations for Tropical Growing:**
- High humidity can increase disease pressure - ensure good airflow
- Intense sun may require partial shade for sensitive varieties
- Year-round growing season allows multiple plantings

What's your specific location? Rainfall patterns and elevation can help me give more targeted advice!
```

## Data Sources

- **EcoCrop Database**: FAO's ecological crop requirements database
- **Crop Parameters**: pH tolerance, rainfall needs, temperature ranges, climate zones
- **Training Data**: 2500+ crop-condition pairs for fine-tuning

## Technical Details

### Vector Database
- **Engine**: ChromaDB with persistence
- **Embeddings**: SentenceTransformer ('all-MiniLM-L6-v2')
- **Search**: Semantic similarity + metadata filtering

### LLM Configuration
- **Model**: Meta Llama 3.1 8B (via Ollama)
- **Temperature**: 0.7 for conversational responses
- **Context**: Crop data + environmental conditions

### Environmental Extraction
- Automated parsing of pH, rainfall, temperature, climate type
- Fuzzy matching for location and crop categories
- Fallback to similarity search when conditions unclear

## Project Structure

```
1_AI/
├── crop_rag_system.py      # Core RAG system
├── streamlit_app.py        # Web interface
├── setup.py               # Installation script
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── ecocrop.csv           # Crop database
├── finetune_pairs.jsonl  # Training data
└── chroma_db/            # Vector database (created on first run)
```

## Configuration

### Model Selection
Change the model in `crop_rag_system.py`:
```python
chatbot = CropRAGChatbot(kb, model_name="llama3.1:8b")
```

### Database Path
Modify vector database location:
```python
kb = CropKnowledgeBase(db_path="./custom_chroma_db")
```

### Search Parameters
Adjust retrieval settings:
```python
crops = kb.search_crops(query, n_results=15)  # More results
suitable_crops = chatbot.filter_crops_by_conditions(crops, conditions)
```

## Troubleshooting

### Common Issues

1. **"Model not found" error**:
   ```bash
   ollama pull llama3.1:8b
   ```

2. **"ChromaDB error"**:
   - Delete `chroma_db/` folder and restart
   - Check disk space

3. **"No crop data" error**:
   - Ensure `ecocrop.csv` is in the same directory
   - Check file permissions

4. **Slow responses**:
   - Reduce `n_results` in search
   - Use smaller model (llama3.1:3b)

### Performance Optimization

- **Memory**: 8GB+ RAM recommended for smooth operation
- **Storage**: 5GB+ free space for models and database
- **CPU**: Multi-core processor improves response time

## Development

### Adding New Crop Data
1. Update `ecocrop.csv` with new entries
2. Delete `chroma_db/` folder
3. Restart application (rebuilds vector database)

### Customizing Prompts
Edit prompts in `crop_rag_system.py`:
- `extraction_prompt`: For parsing environmental conditions
- `response_prompt`: For generating final responses

### Adding New Features
- Extend `CropKnowledgeBase` for new data sources
- Modify `CropRAGChatbot` for additional reasoning
- Update Streamlit interface in `streamlit_app.py`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Submit pull request with clear description

## License

This project is open source. See individual component licenses:
- EcoCrop data: FAO license
- Code: MIT license (add LICENSE file as needed)

## Support

For issues and questions:
1. Check troubleshooting section
2. Review Ollama documentation
3. Open GitHub issue with system details

## Acknowledgments

- **FAO EcoCrop**: Comprehensive crop ecological database
- **Meta**: Llama 3.1 language model
- **Ollama**: Local LLM deployment platform
- **ChromaDB**: Vector database technology
- **Streamlit**: Web application framework

---

**Happy Farming! 🌾**
