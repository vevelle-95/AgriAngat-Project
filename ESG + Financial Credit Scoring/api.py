from typing import Optional, List
from fastapi import FastAPI
from pydantic import BaseModel, Field, validator
from scorer import score_profile

app = FastAPI(title="AgriScore API", version="0.1")

class Profile(BaseModel):
    Farming_Method: Optional[str] = Field(None, alias="Farming Method")
    Irrigation_Practices: Optional[str] = Field(None, alias="Irrigation Practices")
    Fertilizer_Use: Optional[str] = Field(None, alias="Fertilizer & Pesticide Use")
    Soil_Water_Conservation: Optional[str] = Field(None, alias="Soil & Water Conservation")
    Use_of_Renewable_Energy: Optional[str] = Field(None, alias="Use of Renewable Energy")
    Fair_Wages: Optional[str] = Field(None, alias="Fair Wages")
    Community_Participation: Optional[str] = Field(None, alias="Community Participation")
    Training_Education: Optional[str] = Field(None, alias="Training & Education")
    Inclusivity: Optional[str] = Field(None, alias="Inclusivity")
    Record_Keeping: Optional[str] = Field(None, alias="Record-Keeping")
    Certifications: Optional[str] = Field(None, alias="Certifications")
    Business_Compliance: Optional[str] = Field(None, alias="Business Compliance")
    Years_in_Operation: Optional[int] = Field(None, alias="Years in Operation")
    Land_Size: Optional[float] = Field(None, alias="Land Size (hectares)")
    Regular_Buyers: Optional[str] = Field(None, alias="Regular Buyers")
    Registered_Business_Name: Optional[str] = Field(None, alias="Registered Business Name")
    Annual_Sales_Revenue: Optional[int] = Field(None, alias="Annual Sales/Revenue")
    Loan_Amount: Optional[int] = Field(None, alias="Loan Amount Applied For")
    Employment_Workers: Optional[int] = Field(None, alias="Employment (Workers)")
    Repayment_Frequency: Optional[str] = Field(None, alias="Repayment Frequency")
    Primary_Crop_Type: Optional[str] = Field(None, alias="Primary Crop Type")

    @validator("Soil_Water_Conservation", "Certifications", pre=True)
    def ensure_comma_list(cls, v):
        if v is None:
            return ""
        if isinstance(v, list):
            return ", ".join(str(x) for x in v)
        return str(v)

    class Config:
        allow_population_by_field_name = True
        extra = "ignore"

class ScoreOut(BaseModel):
    breakdown: dict
    agri_score: float
    risk: str
    tips: List[str]

@app.post("/score", response_model=ScoreOut)
def score_single(profile: Profile):
    mapping = {
        "Farming Method": profile.Farming_Method,
        "Irrigation Practices": profile.Irrigation_Practices,
        "Fertilizer & Pesticide Use": profile.Fertilizer_Use,
        "Soil & Water Conservation": profile.Soil_Water_Conservation,
        "Use of Renewable Energy": profile.Use_of_Renewable_Energy,
        "Fair Wages": profile.Fair_Wages,
        "Community Participation": profile.Community_Participation,
        "Training & Education": profile.Training_Education,
        "Inclusivity": profile.Inclusivity,
        "Record-Keeping": profile.Record_Keeping,
        "Certifications": profile.Certifications,
        "Business Compliance": profile.Business_Compliance,
        "Years in Operation": profile.Years_in_Operation,
        "Land Size (hectares)": profile.Land_Size,
        "Regular Buyers": profile.Regular_Buyers,
        "Registered Business Name": profile.Registered_Business_Name,
        "Annual Sales/Revenue": profile.Annual_Sales_Revenue,
        "Loan Amount Applied For": profile.Loan_Amount,
        "Employment (Workers)": profile.Employment_Workers,
        "Repayment Frequency": profile.Repayment_Frequency,
        "Primary Crop Type": profile.Primary_Crop_Type,
    }
    p = {k: v for k, v in mapping.items() if v is not None}
    breakdown, agri, risk, tips = score_profile(p)
    return {"breakdown": breakdown, "agri_score": agri, "risk": risk, "tips": tips}

@app.post("/batch-score", response_model=List[ScoreOut])
def score_batch(profiles: List[Profile]):
    results = []
    for prof in profiles:
        # Reuse single logic
        mapping = {
            "Farming Method": prof.Farming_Method,
            "Irrigation Practices": prof.Irrigation_Practices,
            "Fertilizer & Pesticide Use": prof.Fertilizer_Use,
            "Soil & Water Conservation": prof.Soil_Water_Conservation,
            "Use of Renewable Energy": prof.Use_of_Renewable_Energy,
            "Fair Wages": prof.Fair_Wages,
            "Community Participation": prof.Community_Participation,
            "Training & Education": prof.Training_Education,
            "Inclusivity": prof.Inclusivity,
            "Record-Keeping": prof.Record_Keeping,
            "Certifications": prof.Certifications,
            "Business Compliance": prof.Business_Compliance,
            "Years in Operation": prof.Years_in_Operation,
            "Land Size (hectares)": prof.Land_Size,
            "Regular Buyers": prof.Regular_Buyers,
            "Registered Business Name": prof.Registered_Business_Name,
            "Annual Sales/Revenue": prof.Annual_Sales_Revenue,
            "Loan Amount Applied For": prof.Loan_Amount,
            "Employment (Workers)": prof.Employment_Workers,
            "Repayment Frequency": prof.Repayment_Frequency,
            "Primary Crop Type": prof.Primary_Crop_Type,
        }
        p = {k: v for k, v in mapping.items() if v is not None}
        breakdown, agri, risk, tips = score_profile(p)
        results.append({"breakdown": breakdown, "agri_score": agri, "risk": risk, "tips": tips})
    return results

@app.get("/health")
def health():
    return {"status": "ok"}
