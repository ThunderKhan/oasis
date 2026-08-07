from pathlib import Path

from .schemas import CervicalInput, Patient


class CervicalModelService:
    def __init__(self, path: str):
        self.path = Path(path)
        self.artifact = None
        self.load_error: str | None = None

        if not self.path.exists():
            return

        try:
            import joblib

            self.artifact = joblib.load(self.path)
        except Exception as exc:
            self.load_error = f"{type(exc).__name__}: {exc}"
            self.artifact = None

    @property
    def available(self) -> bool:
        return self.artifact is not None

    def predict(
        self,
        patient: Patient,
        x: CervicalInput,
    ) -> tuple[float | None, float]:
        applicable = (
            x.applicable
            and patient.sex_at_birth in {"female", "intersex", "unknown"}
        )

        if not applicable or not self.artifact:
            return None, 0.20

        try:
            import pandas as pd

            row = {
                "Age": patient.age,
                "Number of sexual partners": x.number_of_sexual_partners,
                "First sexual intercourse": x.first_sexual_intercourse_age,
                "Num of pregnancies": x.number_of_pregnancies,
                "Smokes": None
                if x.smoking_current is None
                else int(x.smoking_current),
                "Smokes (years)": x.smoking_years,
                "Hormonal Contraceptives (years)": x.hormonal_contraceptive_years,
                "IUD (years)": x.iud_years,
                "STDs": None if x.std_history is None else int(x.std_history),
                "STDs (number)": x.std_diagnoses_count,
            }

            features = self.artifact["feature_names"]

            frame = pd.DataFrame(
                [{feature: row.get(feature) for feature in features}]
            )

            probability = float(
                self.artifact["model"]
                .predict_proba(frame)[:, 1][0]
            )

            threshold = float(
                self.artifact.get("threshold", 0.20)
            )

            return probability, threshold

        except Exception:
            return None, 0.20