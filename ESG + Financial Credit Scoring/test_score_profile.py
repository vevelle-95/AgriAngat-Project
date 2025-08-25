# Unit tests for scorer.score_profile — run with: python -m pytest -q

import pytest
from scorer import score_profile, CATEGORY_MAX

def test_minimal_profile_high_risk():
    p = {}
    breakdown, agri, risk, tips = score_profile(p)
    assert isinstance(breakdown, dict)
    assert 0 <= agri <= 100
    assert risk == "High Risk"
    # With no inputs, most category scores should be 0 or minimal
    assert breakdown["Environmental"] >= 0
    assert breakdown["Social"] >= 0
    assert breakdown["Governance"] >= 0

def test_soil_and_cert_caps():
    p = {
        "Soil & Water Conservation": "Crop Rotation, Composting, Mulching, Water-Saving",
        "Certifications": "Organic, Fair Trade, GAP, Barangay Certificate",
        "Business Compliance": "None",
        "Record-Keeping": "None"
    }
    breakdown, agri, risk, tips = score_profile(p)
    # soil contribution sum = 3+3+2+3 = 11 -> capped to 6
    assert breakdown["Environmental"] == min(CATEGORY_MAX["Environmental"], 6)
    # certs len = 4 -> 4 * CERT_CAP_PER (2) = 8 -> capped to <= governance cap (function caps internally)
    assert breakdown["Governance"] <= CATEGORY_MAX["Governance"]

def test_financial_full_score():
    p = {
        "Annual Sales/Revenue": 1_000_000,
        "Loan Amount Applied For": 50_000,
        "Employment (Workers)": 3,
        "Repayment Frequency": "Weekly"
    }
    breakdown, agri, risk, tips = score_profile(p)
    assert breakdown["Financial"] == CATEGORY_MAX["Financial"]

def test_strong_profile_low_risk():
    p = {
        "Farming Method": "Organic",
        "Irrigation Practices": "Drip",
        "Fertilizer & Pesticide Use": "Organic",
        "Soil & Water Conservation": "Crop Rotation, Composting, Mulching",
        "Use of Renewable Energy": "Yes",
        "Fair Wages": "Yes",
        "Community Participation": "Coop Member",
        "Training & Education": "Attended training",
        "Inclusivity": "Female-led",
        "Record-Keeping": "Digital",
        "Certifications": "Organic, Fair Trade, GAP",
        "Business Compliance": "DTI",
        "Years in Operation": 30,
        "Land Size (hectares)": 10,
        "Regular Buyers": "Supermarket",
        "Registered Business Name": "Some Farm",
        "Annual Sales/Revenue": 1_000_000,
        "Loan Amount Applied For": 50_000,
        "Employment (Workers)": 10,
        "Repayment Frequency": "Monthly",
    }
    breakdown, agri, risk, tips = score_profile(p)
    assert agri >= 80
    assert risk == "Low Risk / Sustainable"

if __name__ == "__main__":
    pytest.main([__file__])
# To run the tests, execute: python -m pytest -q
