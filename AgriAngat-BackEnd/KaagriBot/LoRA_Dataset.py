# make_ft_data.py
import pandas as pd
import json
from pathlib import Path
import chardet

CSV_PATH = "ecocrop.csv"
OUT_JSONL = "finetune_pairs.jsonl"

def detect_encoding(file_path):
    with open(file_path, "rb") as f:
        raw = f.read(100000)  # read first 100KB
    result = chardet.detect(raw)
    return result["encoding"] or "utf-8"

COLS = {
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
    "cliz": "CLIZ",
}

def row_to_pair(row):
    # Create a synthetic "input" from plausible API signals
    # (You can sample ranges; here we take midpoints if available.)
    def mid(a, b):
        try:
            a = float(a); b = float(b)
            return round((a+b)/2, 2)
        except:
            return None

    ph  = mid(row.get(COLS["ph_opt_min"]), row.get(COLS["ph_opt_max"])) or mid(row.get(COLS["ph_min"]), row.get(COLS["ph_max"])) or 6.5
    rain= mid(row.get(COLS["rain_opt_min"]), row.get(COLS["rain_opt_max"])) or mid(row.get(COLS["rain_min"]), row.get(COLS["rain_max"])) or 1500
    temp= mid(row.get(COLS["t_opt_min"]), row.get(COLS["t_opt_max"])) or 27
    ndvi= 0.7  # healthy vegetation context; you may randomize if desired

    inp = f"Soil pH: {ph}, Bulk Density: unknown, Rainfall: {rain} mm/year, Temperature: {temp} °C, NDVI: {ndvi}"
    # Output recommends THIS crop (single-label) with explicit factor citations.
    # In production, your model will see multiple candidates via RAG and rank them;
    # Here we just show the pattern.
    name = row.get(COLS["name"]) or row.get(COLS["sci"]) or "unknown"

    # Build explanation that cites factors
    expl_bits = []
    if pd.notna(row.get(COLS["ph_opt_min"])) and pd.notna(row.get(COLS["ph_opt_max"])):
        expl_bits.append(f"soil pH within optimal [{row[COLS['ph_opt_min']]}, {row[COLS['ph_opt_max']]}]")
    if pd.notna(row.get(COLS["rain_opt_min"])) and pd.notna(row.get(COLS["rain_opt_max"])):
        expl_bits.append(f"rainfall within optimal [{row[COLS['rain_opt_min']]}, {row[COLS['rain_opt_max']]}] mm/year")
    if pd.notna(row.get(COLS["t_opt_min"])) and pd.notna(row.get(COLS["t_opt_max"])):
        expl_bits.append(f"temperature within optimal [{row[COLS['t_opt_min']]}, {row[COLS['t_opt_max']]}] °C")

    explanation = " ; ".join(expl_bits) if expl_bits else "unknown"

    out = {
        "recommended_crops": [name] if name != "unknown" else [],
        "explanation": explanation,
        "sources": ["FAO/EcoCrop"]
    }

    return {"input": inp, "output": out}

def main():
    encoding = detect_encoding(CSV_PATH)
    print(f"Detected encoding: {encoding}")
    df = pd.read_csv(CSV_PATH, encoding=encoding)

    with open(OUT_JSONL, "w", encoding="utf-8") as f:
        for _, row in df.iterrows():
            pair = row_to_pair(row)
            f.write(json.dumps(pair, ensure_ascii=False) + "\n")
    print(f"Wrote {OUT_JSONL}")

if __name__ == "__main__":
    main()
