import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import AssessmentRecord, init_db, list_records, save
from .model_service import CervicalModelService
from .rules import assess_breast, assess_cervical, assess_oral
from .schemas import AssessmentRequest, AssessmentResponse, PRIORITY_RANK

model_service = CervicalModelService(settings.model_path)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://oasis-opal-nine.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "cervical_model_loaded": model_service.available}

@app.post(f"{settings.api_prefix}/assessments", response_model=AssessmentResponse)
def create_assessment(req: AssessmentRequest):
    probability, threshold = model_service.predict(req.patient, req.cervical)
    results = {
        "oral": assess_oral(req.patient, req.oral),
        "breast": assess_breast(req.patient, req.breast),
        "cervical": assess_cervical(req.patient, req.cervical, probability, threshold),
    }
    overall = max(
        (result.priority for result in results.values()),
        key=lambda priority: PRIORITY_RANK[priority],
    )
    response = AssessmentResponse(
        assessment_id=f"AST-{uuid.uuid4().hex[:10].upper()}",
        patient_code=req.patient.patient_code,
        overall_priority=overall,
        results=results,
        disclaimer="O.A.S.I.S. supports screening and referral decisions; it does not diagnose or exclude cancer.",
    )
    save(
        AssessmentRecord(
            id=response.assessment_id,
            patient_code=req.patient.patient_code,
            overall_priority=overall.value,
            payload_json=response.model_dump_json(),
        )
    )
    return response

@app.get(f"{settings.api_prefix}/assessments")
def assessments(limit: int = Query(default=100, ge=1, le=500)):
    return [
        {
            "assessment_id": record.id,
            "patient_code": record.patient_code,
            "overall_priority": record.overall_priority,
            "created_at": record.created_at,
        }
        for record in list_records(limit)
    ]
