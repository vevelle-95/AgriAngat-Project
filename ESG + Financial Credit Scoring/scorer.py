from typing import List, Dict, Tuple

CATEGORY_MAX: Dict[str, int] = {
    "Environmental": 30,
    "Social": 20,
    "Governance": 15,
    "Business": 15,
    "Financial": 20,
}

# lookup maps (answer -> points)
FM_MAP = {"Organic": 15, "Transitioning to Organic": 10, "Mixed": 7, "Conventional": 3}
IRR_MAP = {"Drip": 8, "Sprinkler": 8, "Flood": 4, "Rain-fed": 1}
FERT_MAP = {"Organic": 5, "Combination": 3, "Synthetic": 0}
SOIL_MAP = {"Crop Rotation": 3, "Composting": 3, "Mulching": 2, "Water-Saving": 3, "None": 0}
COMM_MAP = {"Coop Member": 5, "Supplier to community": 3, "Not involved": 0}
INCL_MAP = {"Female-led": 3, "Employs women": 2, "None": 0}
RK_MAP = {"Digital": 2, "Manual": 1, "None": 0}
BUS_COMP_MAP = {"Business Plan": 5, "Barangay Clearance": 5, "DTI": 5, "None": 0}
RF_MAP = {"Weekly": 4, "Monthly": 4, "Quarterly": 3, "Annually": 2, "Lump sum": 1}
CERT_CAP_PER = 2  # points per cert (capped inside scorer)

def _parse_multi(v) -> List[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return v
    return [x.strip() for x in str(v).split(",") if x.strip()]

def safe_int(v, default: int = 0) -> int:
    try:
        if v is None:
            return default
        return int(v)
    except Exception:
        try:
            return int(float(v))
        except Exception:
            return default

def safe_float(v, default: float = 0.0) -> float:
    try:
        if v is None:
            return default
        return float(v)
    except Exception:
        return default

def score_profile(p: Dict) -> Tuple[Dict[str, float], float, str, List[str]]:
    """
    Returns: (breakdown, agri_score, risk_bucket, tips)
    - breakdown: per-category points (0..category max)
    - agri_score: total 0..100
    - risk_bucket: "Low Risk / Sustainable" | "Medium Risk" | "High Risk"
    - tips: actionable improvement suggestions
    """
    # Environmental
    em = 0
    em += FM_MAP.get(p.get("Farming Method", ""), 0)
    em += IRR_MAP.get(p.get("Irrigation Practices", ""), 0)
    em += FERT_MAP.get(p.get("Fertilizer & Pesticide Use", ""), 0)
    soil_items = _parse_multi(p.get("Soil & Water Conservation", ""))
    soil_pts = sum(SOIL_MAP.get(s, 0) for s in soil_items)
    em += min(6, soil_pts)  # cap multi-select soil contribution
    em += 2 if p.get("Use of Renewable Energy") == "Yes" else 0
    env_score = min(CATEGORY_MAX["Environmental"], em)

    # Social
    so = 0
    so += 6 if p.get("Fair Wages") == "Yes" else 0
    so += COMM_MAP.get(p.get("Community Participation", ""), 0)
    so += 4 if p.get("Training & Education", "") == "Attended training" else 0
    so += INCL_MAP.get(p.get("Inclusivity", ""), 0)
    social_score = min(CATEGORY_MAX["Social"], so)

    # Governance
    gov = 0
    certs = [c for c in _parse_multi(p.get("Certifications", "")) if c.lower() != "none"]
    gov += min(6, len(certs) * CERT_CAP_PER)  # cap cert contribution
    gov += BUS_COMP_MAP.get(p.get("Business Compliance", "None"), 0)
    gov += 4 if p.get("Record-Keeping") == "Digital" else 2 if p.get("Record-Keeping") == "Manual" else 0
    governance_score = min(CATEGORY_MAX["Governance"], gov)

    # Business
    bus = 0
    years = safe_int(p.get("Years in Operation", 0))
    bus += min(5, max(0, (years // 6)))
    land = safe_float(p.get("Land Size (hectares)", 0))
    bus += min(4, int(land // 2))
    bus += 3 if p.get("Regular Buyers") and p.get("Regular Buyers") != "None" else 0
    bus += 3 if p.get("Registered Business Name") else 0
    business_score = min(CATEGORY_MAX["Business"], bus)

    # Financial
    fin = 0
    sales = safe_int(p.get("Annual Sales/Revenue", 0))
    if sales <= 100_000:
        fin += 2
    elif sales >= 1_000_000:
        fin += 8
    else:
        fin += 2 + int((sales - 100_000) * 7 / 900_000)
    loan = safe_int(p.get("Loan Amount Applied For", 0))
    if loan <= 50_000:
        fin += 5
    elif loan >= 500_000:
        fin += 0
    else:
        fin += max(0, 5 - int((loan - 50_000) * 5 / 450_000))
    workers = safe_int(p.get("Employment (Workers)", 0))
    fin += min(3, workers)
    fin += RF_MAP.get(p.get("Repayment Frequency", ""), 1)
    financial_score = min(CATEGORY_MAX["Financial"], fin)

    breakdown = {
        "Environmental": round(env_score, 2),
        "Social": round(social_score, 2),
        "Governance": round(governance_score, 2),
        "Business": round(business_score, 2),
        "Financial": round(financial_score, 2),
    }

    total = sum(breakdown.values())
    agri = round(total, 2)

    if agri >= 80:
        risk = "Low Risk / Sustainable"
    elif agri >= 50:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    tips: List[str] = []
    if breakdown["Environmental"] < CATEGORY_MAX["Environmental"]:
        tips.append("Use efficient irrigation (drip/sprinkler) or add composting/mulching.")
    if breakdown["Social"] < CATEGORY_MAX["Social"]:
        tips.append("Join a cooperative or attend training programs.")
    if breakdown["Governance"] < CATEGORY_MAX["Governance"]:
        tips.append("Obtain certifications and adopt digital record-keeping.")
    if breakdown["Business"] < CATEGORY_MAX["Business"]:
        tips.append("Formalize your business and secure regular buyers.")
    if breakdown["Financial"] < CATEGORY_MAX["Financial"]:
        tips.append("Grow revenue or request loan size aligned to revenue.")

    return breakdown, agri, risk, tips

__all__ = ["score_profile", "CATEGORY_MAX", "_parse_multi", "safe_int", "safe_float"]
