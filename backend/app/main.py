import json, uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI
from .config import settings
from .schemas import AssessmentRequest, AssessmentResponse, PRIORITY_RANK
from .rules import assess_oral, assess_breast, assess_cervical
from .model_service import CervicalModelService
from .database import init_db, save, list_records, AssessmentRecord
from fastapi.middleware.cors import CORSMiddleware

model_service=CervicalModelService(settings.model_path)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db(); yield

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health(): return {"status":"ok","cervical_model_loaded":model_service.available}

@app.post(f"{settings.api_prefix}/assessments",response_model=AssessmentResponse)
def create_assessment(req: AssessmentRequest):
    p,threshold=model_service.predict(req.patient,req.cervical)
    results={
        "oral":assess_oral(req.patient,req.oral),
        "breast":assess_breast(req.patient,req.breast),
        "cervical":assess_cervical(req.patient,req.cervical,p,threshold),
    }
    overall=max((r.priority for r in results.values()),key=lambda x:PRIORITY_RANK[x])
    response=AssessmentResponse(
        assessment_id=f"AST-{uuid.uuid4().hex[:10].upper()}",patient_code=req.patient.patient_code,
        overall_priority=overall,results=results,
        disclaimer="O.A.S.I.S. supports screening and referral decisions; it does not diagnose or exclude cancer."
    )
    save(AssessmentRecord(id=response.assessment_id,patient_code=req.patient.patient_code,overall_priority=overall.value,payload_json=response.model_dump_json()))
    return response

@app.get(f"{settings.api_prefix}/assessments")
def assessments(limit:int=100):
    return [{"assessment_id":r.id,"patient_code":r.patient_code,"overall_priority":r.overall_priority,"created_at":r.created_at} for r in list_records(limit)]