from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, create_engine, Session, select
from .config import settings

class AssessmentRecord(SQLModel, table=True):
    id: str = Field(primary_key=True)
    patient_code: str = Field(index=True)
    overall_priority: str
    payload_json: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

engine=create_engine(settings.database_url,connect_args={"check_same_thread":False})

def init_db(): SQLModel.metadata.create_all(engine)

def save(record: AssessmentRecord):
    with Session(engine) as s: s.add(record); s.commit()

def list_records(limit:int=100):
    with Session(engine) as s:
        return s.exec(select(AssessmentRecord).order_by(AssessmentRecord.created_at.desc()).limit(limit)).all()
