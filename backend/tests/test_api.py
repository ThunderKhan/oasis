from fastapi.testclient import TestClient
from app.main import app

def payload(patient_code: str = "API-TEST"):
    return {
        "patient": {"patient_code": patient_code, "age": 42, "sex_at_birth": "female", "consent_given": True},
        "oral": {
            "screened_before": True, "years_since_screening": 1, "smoking_current": False,
            "smokeless_tobacco_current": False, "areca_nut_current": False, "alcohol_high_exposure": False,
            "exposure_years": 0, "non_healing_ulcer": False, "white_patch": False, "red_patch": False,
            "oral_growth": False, "unexplained_bleeding": False, "restricted_mouth_opening": False,
            "difficulty_swallowing": False, "neck_lump": False, "abnormal_exam": False
        },
        "breast": {
            "applicable": True, "screened_before": True, "years_since_cbe": 1, "new_breast_lump": False,
            "axillary_lump": False, "bloody_nipple_discharge": False, "new_nipple_inversion": False,
            "skin_dimpling_or_peau_dorange": False, "breast_ulceration": False, "abnormal_cbe": False,
            "previous_breast_cancer": False, "known_pathogenic_variant": False, "previous_chest_radiation": False,
            "atypical_hyperplasia_or_lcis": False, "first_degree_relatives": 0,
            "relative_diagnosed_before_50": False
        },
        "cervical": {
            "applicable": True, "screened_before": True, "years_since_screening": 1, "living_with_hiv": None,
            "previous_positive_hpv": False, "previous_abnormal_via_or_cytology": False,
            "postcoital_bleeding": False, "postmenopausal_bleeding": False,
            "unexplained_persistent_bleeding": False, "persistent_foul_discharge": False,
            "pelvic_pain": False, "abnormal_cervical_exam": False, "number_of_sexual_partners": None,
            "first_sexual_intercourse_age": None, "number_of_pregnancies": None, "smoking_current": None,
            "smoking_years": None, "hormonal_contraceptive_years": None, "iud_years": None,
            "std_history": None, "std_diagnoses_count": None
        },
    }

def test_health():
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert isinstance(body["cervical_model_loaded"], bool)

def test_missing_consent_returns_422():
    body = payload()
    del body["patient"]["consent_given"]
    with TestClient(app) as client:
        response = client.post("/api/v1/assessments", json=body)
    assert response.status_code == 422

def test_post_then_history_contains_assessment():
    body = payload("API-HISTORY")
    with TestClient(app) as client:
        created = client.post("/api/v1/assessments", json=body)
        assert created.status_code == 200
        created_body = created.json()
        assert created_body["patient_code"] == "API-HISTORY"
        assert set(created_body["results"]) == {"oral", "breast", "cervical"}
        history = client.get("/api/v1/assessments?limit=500")
        assert history.status_code == 200
    assert any(row["assessment_id"] == created_body["assessment_id"] for row in history.json())

def test_history_limit_bounds():
    with TestClient(app) as client:
        assert client.get("/api/v1/assessments?limit=0").status_code == 422
        assert client.get("/api/v1/assessments?limit=501").status_code == 422
