# AgriScore — Project Overview

Short: AgriScore computes an explainable ESG + financial score for farmer profiles, exposes a FastAPI for real-time scoring and submission, and provides batch generation and CSV export via MAIN.py. Scoring logic is in `scorer.py` and unit-tested.

## Repository layout
- MAIN.py  
  - Generates synthetic farmer data, calls scorer, builds DataFrame, saves CSV.
- scorer.py  
  - Pure scoring logic: `score_profile(p)` → (breakdown, agri_score, risk, tips).
- api.py  
  - FastAPI app exposing:
    - POST /score — returns score for a single profile (no persistence).
    - POST /batch-score — score many profiles.
    - POST /submit-profile — validate, compute, persist to Firestore (if enabled).
    - GET /health — simple health check.
- tests/test_score_profile.py  
  - Pytest unit tests for edge cases.
- requirements.txt (recommended)  
  - List of Python deps (fastapi, uvicorn, pydantic, firebase-admin, pandas, faker, pytest, etc.)

## Design principles
- Single source of truth for scoring (scorer.py) used by MAIN.py, api.py and tests.
- Explainable breakdown across five categories: Environmental, Social, Governance, Business, Financial (total = 100).
- Caps for multi-select fields and certs to avoid score gaming.
- Input sanitization via Pydantic + safe_int/safe_float helpers.

## Quick setup (Windows PowerShell)
1. Create and activate venv:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
2. Install deps:
   ```powershell
   pip install -r requirements.txt
   # or
   pip install fastapi uvicorn pydantic firebase-admin pandas faker pytest
   ```
3. (Optional) Set Firebase service account:
   - Download service account JSON from Firebase Console.
   - Set env var (PowerShell):
     ```powershell
     $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\serviceAccountKey.json"
     ```

## Run locally
- API:
  ```powershell
  python -m uvicorn api:app --reload --port 8000
  ```
  - Health: GET http://127.0.0.1:8000/health

- MAIN.py (batch CSV generation):
  ```powershell
  python "d:\BPI 2025\Girl gumana ka\MAIN.py"
  # generates farmer_dataset_scored.csv
  ```

- Tests:
  ```powershell
  python -m pytest -q
  ```

## API usage examples

- Score single profile (no persistence)
  ```bash
  curl -X POST "http://127.0.0.1:8000/score" \
    -H "Content-Type: application/json" \
    -d '{
          "Farming Method":"Organic",
          "Irrigation Practices":"Drip",
          "Annual Sales/Revenue":1000000,
          "Loan Amount Applied For":50000
        }'
  ```

- Submit profile (validate + compute + persist to Firestore)
  ```bash
  curl -X POST "http://127.0.0.1:8000/submit-profile" \
    -H "Content-Type: application/json" \
    -d '{
          "Farming Method":"Organic",
          "Irrigation Practices":"Drip",
          "Annual Sales/Revenue":1000000,
          "Loan Amount Applied For":50000,
          "uid":"<optional-firebase-uid>"
        }'
  ```

Response contains:
- id (Firestore doc id or uid)
- score: { breakdown, agri_score, risk, tips }

## Firestore document shape (example)
- Collection: `farmers`
- Document:
  ```json
  {
    "profile": { /* submitted fields */ },
    "score": {
      "breakdown": { "Environmental": 24, "Social": 14, ... },
      "agri_score": 78.0,
      "risk": "Medium Risk",
      "tips": ["Use efficient irrigation...", "..."]
    },
    "created_at": "...",
    "updated_at": "..."
  }
  ```

## Security & best practices
- Use Firebase Auth to tie records to `uid`. Do not store passwords in Firestore.
- Enforce Firestore rules so only owners and bank officers can read/write.
- Rate-limit and add CAPTCHA/recaptcha for public signup endpoints.
- Validate inputs strictly (use enums for fixed choices) to prevent garbage data.
- Consider Cloud Function trigger on write to recompute AgriScore if scoring logic moves/changes.

## Troubleshooting
- ModuleNotFoundError: ensure venv activated and packages installed.
- Uvicorn immediately shuts down: run without `--reload` to isolate, or check for import errors/tracebacks above INFO logs.
- Firebase init error: confirm `GOOGLE_APPLICATION_CREDENTIALS` path and permissions.

## Next recommended steps (prioritized)
1. Add `requirements.txt` and lock versions.
2. Add Firestore security rules example and integrate Firebase Auth endpoints (signup/login).
3. Add CI (GitHub Actions) to run tests and lint on PRs.
4. Expose configurable scoring weights (JSON) and admin UI for BPI stakeholders to tune.
5. Implement history/versioning of scores and a dashboard for portfolio analytics.

## Contacts / notes
- Scoring is deterministic and reusable — use `scorer.score_profile(p)` in backend flows.
- For any change requests (weights, caps, new fields), update `scorer.py`, add unit tests, and run