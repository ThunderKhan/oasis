from pathlib import Path
import joblib
import pandas as pd
from .schemas import Patient, CervicalInput

class CervicalModelService:
    def __init__(self, path: str):
        self.path=Path(path); self.artifact=None
        if self.path.exists():
            self.artifact=joblib.load(self.path)

    @property
    def available(self)->bool: return self.artifact is not None

    def predict(self, patient: Patient, x: CervicalInput)->tuple[float|None,float]:
        if not self.artifact: return None,0.20
        row={
            "Age":patient.age,
            "Number of sexual partners":x.number_of_sexual_partners,
            "First sexual intercourse":x.first_sexual_intercourse_age,
            "Num of pregnancies":x.number_of_pregnancies,
            "Smokes":None if x.smoking_current is None else int(x.smoking_current),
            "Smokes (years)":x.smoking_years,
            "Hormonal Contraceptives (years)":x.hormonal_contraceptive_years,
            "IUD (years)":x.iud_years,
            "STDs":None if x.std_history is None else int(x.std_history),
            "STDs (number)":x.std_diagnoses_count,
        }
        features=self.artifact["feature_names"]
        frame=pd.DataFrame([{f:row.get(f) for f in features}])
        p=float(self.artifact["model"].predict_proba(frame)[:,1][0])
        return p,float(self.artifact.get("threshold",0.20))
