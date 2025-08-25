# rag_build.py
print("🚀 Starting EcoCrop database builder...")

print("📦 Importing pandas...")
import pandas as pd
print("📦 Importing numpy...")
import numpy as np
print("📦 Importing chromadb...")
import chromadb
print("📦 Importing embedding functions...")
from chromadb.utils import embedding_functions
print("📦 Importing pathlib...")
from pathlib import Path

print("✅ All imports successful!")

# ---------- CONFIG ----------
CSV_PATH = "ecocrop.csv"   # your EcoCrop-like CSV
DB_DIR   = "kb_chroma"
COLS = {
    "name": "COMNAME",             # fallback to ScientificName if NaN
    "sci": "ScientificName",
    "ph_min": "PHMIN",
    "ph_max": "PHMAX",
    "ph_opt_min": "PHOPMN",
    "ph_opt_max": "PHOPMX",
    "rain_min": "RMIN",
    "rain_max": "RMAX",
    "rain_opt_min": "ROPMN",
    "rain_opt_max": "ROPMX",
    "t_min": "TMIN",
    "t_max": "TMAX",
    "t_opt_min": "TOPMN",
    "t_opt_max": "TOPMX",
    "cat": "CAT",
    "life": "LIFO",
    "notes": "PLAT",               # or any descriptive field(s)
    "cliz": "CLIZ",
}

# Sentence-transformers (local, no API)
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def coerce_float(x):
    try:
        return float(x)
    except:
        return np.nan

def load_and_normalize(csv_path=CSV_PATH):
    # Try different encodings to handle Unicode issues
    encodings_to_try = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'utf-16']
    
    df = None
    for encoding in encodings_to_try:
        try:
            print(f"Trying encoding: {encoding}")
            df = pd.read_csv(csv_path, encoding=encoding)
            print(f"✅ Successfully loaded CSV with {encoding} encoding")
            break
        except UnicodeDecodeError as e:
            print(f"❌ Failed with {encoding}: {e}")
            continue
        except Exception as e:
            print(f"❌ Other error with {encoding}: {e}")
            continue
    
    if df is None:
        raise ValueError("Could not read CSV file with any of the attempted encodings")
    
    print(f"📊 Loaded {len(df)} rows and {len(df.columns)} columns")
    print(f"📋 Columns: {list(df.columns)[:10]}...")  # Show first 10 columns
    
    # Check which expected columns are missing
    missing_cols = []
    for key, col_name in COLS.items():
        if col_name not in df.columns:
            missing_cols.append(f"{key} -> {col_name}")
    
    if missing_cols:
        print(f"⚠️ Missing expected columns: {missing_cols}")
        print(f"📋 Available columns: {sorted(df.columns.tolist())}")
    
    # Normalize key numeric fields
    for k in ["ph_min","ph_max","ph_opt_min","ph_opt_max",
              "rain_min","rain_max","rain_opt_min","rain_opt_max",
              "t_min","t_max","t_opt_min","t_opt_max"]:
        col = COLS[k]
        if col in df.columns:
            df[col] = df[col].apply(coerce_float)
            print(f"✅ Normalized {col} ({k})")
        else:
            print(f"⚠️ Column {col} not found for {k}")
            df[col] = np.nan

    # Name fallback
    df["name_norm"] = df.get(COLS["name"], pd.Series([None]*len(df)))
    df["name_norm"] = df["name_norm"].fillna(df.get(COLS["sci"], "Unknown"))
    return df

def row_to_text(row):
    # A compact description to embed and show
    parts = [
        f"Common name: {row['name_norm']}",
        f"Scientific name: {row.get(COLS['sci'],'')}",
        f"Category: {row.get(COLS['cat'],'')}, Life form: {row.get(COLS['life'],'')}",
        f"pH range: {row.get(COLS['ph_min'])}–{row.get(COLS['ph_max'])} (opt {row.get(COLS['ph_opt_min'])}–{row.get(COLS['ph_opt_max'])})",
        f"Rainfall (mm/yr): {row.get(COLS['rain_min'])}–{row.get(COLS['rain_max'])} (opt {row.get(COLS['rain_opt_min'])}–{row.get(COLS['rain_opt_max'])})",
        f"Temperature (°C): {row.get(COLS['t_min'])}–{row.get(COLS['t_max'])} (opt {row.get(COLS['t_opt_min'])}–{row.get(COLS['t_opt_max'])})",
        f"Climate zones: {row.get(COLS['cliz'],'')}",
        f"Notes: {row.get(COLS['notes'],'')}"
    ]
    return "\n".join(parts)

def ingest_to_chroma(df):
    client = chromadb.PersistentClient(path=DB_DIR)

    # Local embedding function
    sentence_embedder = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    col = client.get_or_create_collection(
        name="ecocrop",
        embedding_function=sentence_embedder,
        metadata={"hnsw:space": "cosine"},
    )

    ids, docs, metas = [], [], []
    for i, row in df.iterrows():
        doc_id = f"crop_{i}"
        text = row_to_text(row)
        meta = {
            "name": row["name_norm"],
            "sci": row.get(COLS["sci"], None),
            "cat": row.get(COLS["cat"], None),
            "life": row.get(COLS["life"], None),
            # Numeric ranges for hard filtering
            "ph_min": row.get(COLS["ph_min"]),
            "ph_max": row.get(COLS["ph_max"]),
            "rain_min": row.get(COLS["rain_min"]),
            "rain_max": row.get(COLS["rain_max"]),
            "t_min": row.get(COLS["t_min"]),
            "t_max": row.get(COLS["t_max"]),
            "ph_opt_min": row.get(COLS["ph_opt_min"]),
            "ph_opt_max": row.get(COLS["ph_opt_max"]),
            "rain_opt_min": row.get(COLS["rain_opt_min"]),
            "rain_opt_max": row.get(COLS["rain_opt_max"]),
            "t_opt_min": row.get(COLS["t_opt_min"]),
            "t_opt_max": row.get(COLS["t_opt_max"]),
            "source": "FAO/EcoCrop"
        }
        ids.append(doc_id)
        docs.append(text)
        metas.append(meta)

        # Batch every ~500 for speed
        if len(ids) % 500 == 0:
            col.add(ids=ids, documents=docs, metadatas=metas)
            ids, docs, metas = [], [], []

    if ids:
        col.add(ids=ids, documents=docs, metadatas=metas)
    return client

def hard_filter(df, ph=None, rain_mm_yr=None, temp_c=None, climate_code=None):
    keep = pd.Series([True]*len(df))
    if ph is not None and "PHMIN" in df and "PHMAX" in df:
        keep &= (df[COLS["ph_min"]].le(ph) | df[COLS["ph_min"]].isna()) & \
                (df[COLS["ph_max"]].ge(ph) | df[COLS["ph_max"]].isna())
    if rain_mm_yr is not None and "RMIN" in df and "RMAX" in df:
        keep &= (df[COLS["rain_min"]].le(rain_mm_yr) | df[COLS["rain_min"]].isna()) & \
                (df[COLS["rain_max"]].ge(rain_mm_yr) | df[COLS["rain_max"]].isna())
    if temp_c is not None and "TMIN" in df and "TMAX" in df:
        keep &= (df[COLS["t_min"]].le(temp_c) | df[COLS["t_min"]].isna()) & \
                (df[COLS["t_max"]].ge(temp_c) | df[COLS["t_max"]].isna())
    if climate_code is not None and COLS["cliz"] in df:
        keep &= df[COLS["cliz"]].fillna("").str.contains(climate_code, case=False)
    return df[keep]

def query(ph, rain_mm_yr, temp_c, ndvi=None, climate_code="Af", top_k=10):
    # Load data frame for hard filter
    df = load_and_normalize(CSV_PATH)
    short = hard_filter(df, ph=ph, rain_mm_yr=rain_mm_yr, temp_c=temp_c, climate_code=climate_code)
    if len(short) == 0:
        return []

    # Build a semantic query string (this helps rank among the filtered set)
    query_text = f"""Find crops suitable for:
    pH ~ {ph}, rainfall ~ {rain_mm_yr} mm/year, temp ~ {temp_c}°C, climate = {climate_code}.
    {'Prefer dense vegetation (NDVI high).' if ndvi is not None and ndvi > 0.5 else ''}"""

    # Query only the shortlisted IDs
    client = chromadb.PersistentClient(path=DB_DIR)
    sentence_embedder = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )
    col = client.get_collection(name="ecocrop", embedding_function=sentence_embedder)

    id_subset = [f"crop_{i}" for i in short.index.tolist()]
    res = col.query(
        query_texts=[query_text],
        n_results=min(top_k, len(id_subset)),
        where={"$or": [{"_id": _id} for _id in id_subset]}  # limit search to shortlisted
    )

    out = []
    for doc, meta in zip(res["documents"][0], res["metadatas"][0]):
        reasons = []
        if not np.isnan(meta.get("ph_opt_min", np.nan)) and not np.isnan(meta.get("ph_opt_max", np.nan)):
            if meta["ph_opt_min"] <= ph <= meta["ph_opt_max"]:
                reasons.append(f"pH {ph} within optimal [{meta['ph_opt_min']}, {meta['ph_opt_max']}]")
        if not np.isnan(meta.get("rain_opt_min", np.nan)) and not np.isnan(meta.get("rain_opt_max", np.nan)):
            if meta["rain_opt_min"] <= rain_mm_yr <= meta["rain_opt_max"]:
                reasons.append(f"Rainfall {rain_mm_yr} within optimal [{meta['rain_opt_min']}, {meta['rain_opt_max']}]")
        if not np.isnan(meta.get("t_opt_min", np.nan)) and not np.isnan(meta.get("t_opt_max", np.nan)):
            if meta["t_opt_min"] <= temp_c <= meta["t_opt_max"]:
                reasons.append(f"Temperature {temp_c}°C within optimal [{meta['t_opt_min']}, {meta['t_opt_max']}]")
        if ndvi is not None:
            reasons.append(f"NDVI {ndvi} (context-only; not used for EcoCrop matching)")
        out.append({
            "name": meta["name"],
            "scientific_name": meta.get("sci"),
            "source": meta.get("source"),
            "why": reasons if reasons else ["Matched by tolerance ranges."],
            "document": doc
        })
    return out

if __name__ == "__main__":
    df = load_and_normalize()
    ingest_to_chroma(df)
    # Example query (plug your API outputs here)
    results = query(ph=6.2, rain_mm_yr=1800, temp_c=27, ndvi=0.7, climate_code="Af", top_k=5)
    for r in results:
        print(r["name"], "—", "; ".join(r["why"]))
