# O.A.S.I.S.

**Oncology Assessment & Screening Information System**

A hackathon MVP for explainable, clinician-facing screening and referral prioritisation for oral, breast, and cervical cancer.

> O.A.S.I.S. is a decision-support prototype, not a diagnostic device. It must not replace clinical examination, screening tests, or specialist judgement.

## Architecture

- `frontend`: Next.js + TypeScript + Tailwind
- `backend`: FastAPI + Pydantic + SQLModel/SQLite
- `training`: optional cervical history-model training with scikit-learn
- Hybrid decision pipeline:
  1. red-flag safety override,
  2. programme screening eligibility,
  3. risk prioritisation,
  4. explainable recommendation,
  5. referral tracking.

## Run backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs`.

## Run frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Demo request

```bash
curl -X POST http://localhost:8000/api/v1/assessments \
  -H "Content-Type: application/json" \
  --data @sample_assessment.json
```

## Scientific positioning

- The displayed `priority_score` is an ordinal **screening-priority index**, not a probability of cancer.
- Any model probability is separately named `experimental_model_probability`.
- Symptoms and abnormal examinations always override a low model output.
- Thresholds and rules are configuration-backed and require clinician/local-programme review before deployment.

See `docs/PPT_MATHEMATICAL_MODELS.md`, `docs/EVIDENCE_MATRIX.md`, and `docs/MODEL_CARD.md`.
