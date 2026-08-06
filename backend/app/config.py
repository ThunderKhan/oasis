from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "O.A.S.I.S. API"
    api_prefix: str = "/api/v1"
    database_url: str = "sqlite:///./oasis.db"
    model_path: str = "models/cervical_history_model.joblib"

settings = Settings()
