import random
import pandas as pd
from faker import Faker
from scorer import score_profile

fake = Faker("en_PH")

def generate_ph_mobile(fake):
    # prefer msisdn() if available, else try phone_number(), else fallback
    if hasattr(fake, "msisdn"):
        try:
            return fake.msisdn()
        except Exception:
            pass
    if hasattr(fake, "phone_number"):
        pn = fake.phone_number()
        digits = "".join(ch for ch in pn if ch.isdigit())
        if digits.startswith("09") and len(digits) >= 11:
            return digits[:11]
    # fallback: generate 09 + 9 digits (PH mobile format)
    return "09" + "".join(str(random.randint(0, 9)) for _ in range(9))

# --- categorical options ---
civil_statuses = ["Single", "Married", "Separated", "Widow/er", "Annulled"]
address_ownerships = ["Owned (unencumbered)", "Owned (mortgaged)", "Rented", "Living with relatives"]
loan_facilities = ["Credit line", "Term Loan"]
loan_purposes = [
    "Working capital", "Construction/Development of real estate",
    "Acquisition of real estate", "Loan takeout/refinancing",
    "Business expansion", "Purchase of equipment/motor vehicles",
    "Purchase of biological asset"
]
repayment_frequencies = ["Weekly", "Monthly", "Quarterly", "Annually", "Lump sum"]
loan_types = ["Unsecured Loan", "Secured Loan"]
collaterals = ["Farm lot title", "Tractor", "Warehouse receipt", "None", "Others"]
sources_of_funds = ["Revenue", "Asset Sale", "Savings", "Inheritance", "Salary/Allowance", "Others"]

# ESG options
crops = ["Rice (Irrigated)", "Rice (Rain-fed)", "Vegetables", "Fruits", "Corn", "Coconut"]
farming_methods = ["Conventional", "Organic", "Mixed", "Transitioning to Organic"]
irrigation_types = ["Rain-fed", "Flood", "Drip", "Sprinkler"]
fertilizers = ["Organic", "Synthetic", "Combination"]
soil_practices = ["Crop Rotation", "Composting", "Mulching", "Water-Saving", "None"]
renewable_energy = ["Yes", "No"]
community_participation = ["Coop Member", "Supplier to community", "Not involved"]
record_keeping = ["Manual", "Digital", "None"]
certifications = ["Organic", "Fair Trade", "GAP", "Barangay Certificate", "None"]

# --- generate synthetic dataset ---
def generate_dataset(n=100, seed=None):
    if seed is not None:
        random.seed(seed)
        Faker.seed(seed)
    data = []
    used_names = set()
    for _ in range(n):
        # ensure unique name
        name = fake.name()
        while name in used_names:
            name = fake.name()
        used_names.add(name)

        profile = {
            "Name of Borrower": name,
            "Civil Status": random.choice(civil_statuses),
            "Date of Birth": fake.date_of_birth(minimum_age=25, maximum_age=65).strftime("%m/%d/%Y"),
            "Place of Birth": fake.city(),
            "Citizenship": "Filipino",
            "Home Address": fake.address().replace("\n", ", "),
            "Home Address Ownership": random.choice(address_ownerships),
            "Government Issued ID": f"PhilSys-{random.randint(1000,9999)}-{random.randint(1000,9999)}",
            "Mobile No.": generate_ph_mobile(fake),
            "Email": fake.email(),
            "Mother’s Maiden Name": fake.last_name(),
            "Registered Business Name": f"{fake.last_name()} Farm",
            "Principal Business Address": fake.address().replace("\n", ", "),
            "Business Address Ownership": random.choice(address_ownerships),
            "Years in Operation": random.randint(1, 30),
            "Website/Social Media": f"facebook.com/{fake.last_name().lower()}farm",
            "Land Size (hectares)": round(random.uniform(1, 10), 2),
            "Annual Sales/Revenue": random.randint(100000, 1000000),
            "Loan Amount Applied For": random.randint(50000, 500000),
            "Tenor (months)": random.choice([12, 24, 36, 48]),
            "Repayment Frequency": random.choice(repayment_frequencies),
            "Loan Facility": random.choice(loan_facilities),
            "Loan Purpose": random.choice(loan_purposes),
            "Type of Loan": random.choice(loan_types),
            "Collateral": random.choice(collaterals),
            "Source of Funds": random.choice(sources_of_funds),
            "Primary Crop Type": random.choice(crops),
            "Farming Method": random.choice(farming_methods),
            "Irrigation Practices": random.choice(irrigation_types),
            "Fertilizer & Pesticide Use": random.choice(fertilizers),
            "Soil & Water Conservation": random.choice(soil_practices),
            "Use of Renewable Energy": random.choice(renewable_energy),
            "Employment (Workers)": random.randint(0, 10),
            "Fair Wages": random.choice(["Yes", "No"]),
            "Community Participation": random.choice(community_participation),
            "Training & Education": random.choice(["Attended training", "No training"]),
            "Inclusivity": random.choice(["Female-led", "Employs women", "None"]),
            "Record-Keeping": random.choice(record_keeping),
            "Certifications": random.choice(certifications),
            "Regular Buyers": random.choice(["Local sari-sari stores", "Rice mill", "Supermarket", "None"]),
            "Business Compliance": random.choice(["Business Plan", "Barangay Clearance", "DTI", "None"])
        }
        data.append(profile)
    return data

# --- scoring / dataframe helpers ---
def build_and_score(profiles):
    scored = []
    for p in profiles:
        breakdown, agri, risk, tips = score_profile(p)
        p.update({
            "Environmental Score": breakdown["Environmental"],
            "Social Score": breakdown["Social"],
            "Governance Score": breakdown["Governance"],
            "Business Score": breakdown["Business"],
            "Financial Score": breakdown["Financial"],
            "AgriScore": agri,
            "Risk Category": risk,
            "Improvement Tips": "; ".join(tips)
        })
        scored.append(p)
    return pd.DataFrame(scored)

def portfolio_summary(df):
    avg_score = round(df["AgriScore"].mean(), 2)
    dist = df["Risk Category"].value_counts().to_dict()
    by_crop = df.groupby("Primary Crop Type")["AgriScore"].mean().round(2).to_dict()
    return {"Average AgriScore": avg_score, "Risk Distribution": dist, "Avg Score by Crop": by_crop}

# --- main execution ---
if __name__ == "__main__":
    data = generate_dataset(n=100, seed=42)
    df = build_and_score(data)
    summary = portfolio_summary(df)
    print(df.head(10))
    print("Portfolio summary:", summary)
    df.to_csv("farmer_dataset_scored.csv", index=False)
    print("✅ farmer_dataset_scored.csv has been saved!")
