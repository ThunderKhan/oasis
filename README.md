# O.A.S.I.S.

**Oncology Assessment & Screening Information System**

A hackathon prototype for explainable, clinician-facing screening and referral prioritisation across oral, breast, and cervical cancer pathways.

> O.A.S.I.S. supports screening and referral decisions. It does not diagnose or exclude cancer and must not replace clinical examination, diagnostic testing, local protocols, or professional judgement.

## Architecture

- `frontend`: Next.js, TypeScript, and Tailwind CSS
- `backend`: FastAPI, Pydantic, and SQLModel/SQLite
- `training`: optional experimental cervical history-model training with scikit-learn
- Hybrid decision pipeline: red-flag safety rules, programme screening eligibility, optional statistical support, and explainable referral-priority recommendations

## Backend setup

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs` for the FastAPI documentation.

### Frontend setup

Use Node.js 20 or later with npm.

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the FastAPI origin, for example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Open `http://localhost:3000`.

### Frontend routes

- `/` — product overview, workflow, safety principles, and research positioning
- `/assessment` — six-step oral, breast, and cervical assessment workflow
- `/results` — persisted result summary, pathway priorities, reasons, and referral print view
- `/dashboard` — operational counts derived from completed assessment summaries
- `/referrals` — searchable and sortable assessment/referral-priority history
- `/about` — intended use, decision model, evidence basis, limitations, and roadmap

### Backend dependency

The frontend expects the FastAPI backend configured by `NEXT_PUBLIC_API_URL`. It uses:

- `GET /health` — service health check
- `POST /api/v1/assessments` — submit an assessment
- `GET /api/v1/assessments` — list completed assessment summaries

### Demo scenarios

The assessment demo scenarios are synthetic demonstration data. They are not real patients, patient records, clinicians, facilities, or referrals.

### Clinical disclaimer

O.A.S.I.S. supports screening and referral decisions; it does not diagnose or exclude cancer. The Screening Priority Index represents screening and referral urgency, not a probability of cancer, and a low index does not rule cancer out.

### Known limitations

- O.A.S.I.S. is a research prototype.
- It has not undergone prospective or external clinical validation.
- Local screening eligibility, intervals, tests, and referral protocols may differ.
- The optional experimental cervical model is limited by its source data, representativeness, missingness, and potential bias.
- Assessment-detail retrieval and referral-completion tracking may be unavailable when the backend does not expose those capabilities.

## Demo request

```bash
curl -X POST http://localhost:8000/api/v1/assessments \
  -H "Content-Type: application/json" \
  --data @sample_assessment.json
```

## Scientific positioning

- `priority_score` is an ordinal Screening Priority Index, not a probability of cancer.
- Any experimental model probability is separately named `experimental_model_probability`.
- Symptoms and abnormal examinations override a low experimental model output.
- Thresholds and rules are configuration-backed and require clinician and local-programme review before deployment.

See `docs/PPT_MATHEMATICAL_MODELS.md`, `docs/EVIDENCE_MATRIX.md`, and `docs/MODEL_CARD.md`.
