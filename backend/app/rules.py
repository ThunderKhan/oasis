from .schemas import (
    Patient, OralInput, BreastInput, CervicalInput, CancerAssessment,
    Priority, Reason
)

SCORE_BY_PRIORITY = {
    Priority.ROUTINE: 15,
    Priority.SCREENING_DUE: 40,
    Priority.PRIORITY_SCREENING: 65,
    Priority.SPECIALIST_ASSESSMENT: 75,
    Priority.CLINICAL_FOLLOW_UP: 82,
    Priority.PROMPT_REFERRAL: 95,
}

def _due(age: int, applicable: bool, screened_before: bool, years: float | None,
         start_age: int = 30, interval: int = 5) -> bool:
    if not applicable or age < start_age:
        return False
    return (not screened_before) or years is None or years >= interval

def assess_oral(patient: Patient, x: OralInput) -> CancerAssessment:
    red=[]; reasons=[]
    red_map = {
        "Persistent/non-healing oral ulcer": x.non_healing_ulcer,
        "Persistent white oral patch": x.white_patch,
        "Persistent red oral patch": x.red_patch,
        "Oral growth or lump": x.oral_growth,
        "Unexplained oral bleeding": x.unexplained_bleeding,
        "Restricted mouth opening": x.restricted_mouth_opening,
        "Difficulty swallowing": x.difficulty_swallowing,
        "Neck lump": x.neck_lump,
        "Abnormal oral examination": x.abnormal_exam,
    }
    red=[k for k,v in red_map.items() if v]
    points=0
    exposures=[
        (x.smokeless_tobacco_current,3,"Current smokeless-tobacco exposure","ORAL_TOBACCO"),
        (x.areca_nut_current,3,"Current areca-nut/betel-quid exposure","ORAL_ARECA"),
        (x.smoking_current,2,"Current smoked-tobacco exposure","ORAL_TOBACCO"),
        (x.alcohol_high_exposure,2,"High alcohol exposure","ORAL_ALCOHOL"),
    ]
    for active,p,label,key in exposures:
        if active:
            points += p
            reasons.append(Reason(factor=label,effect="Raises oral screening priority",evidence_key=key))
    if x.exposure_years >= 10 and points:
        points += 2
        reasons.append(Reason(factor=f"Long exposure duration ({x.exposure_years:g} years)",effect="Raises priority",evidence_key="ORAL_DURATION"))
    if x.smoking_current and x.alcohol_high_exposure:
        points += 2
        reasons.append(Reason(factor="Combined tobacco and alcohol exposure",effect="Raises priority beyond either exposure alone",evidence_key="ORAL_COMBINED"))
    due=_due(patient.age,True,x.screened_before,x.years_since_screening)
    if red:
        priority=Priority.PROMPT_REFERRAL
        reasons.insert(0,Reason(factor=red[0],effect="Safety override: clinical evaluation should not be delayed",evidence_key="ORAL_RED_FLAG"))
    elif points >= 5:
        priority=Priority.PRIORITY_SCREENING
    elif due:
        priority=Priority.SCREENING_DUE
        reasons.append(Reason(factor="Population-screening interval",effect="Oral screening is due under configured programme rules",evidence_key="INDIA_PBS_30"))
    else: priority=Priority.ROUTINE
    action={
        Priority.PROMPT_REFERRAL:"Prompt clinical oral examination and referral according to local pathway.",
        Priority.PRIORITY_SCREENING:"Prioritise visual oral examination by a trained provider.",
        Priority.SCREENING_DUE:"Schedule routine visual oral examination.",
        Priority.ROUTINE:"Continue prevention counselling and screening according to programme schedule.",
    }[priority]
    return CancerAssessment(cancer_type="oral",priority=priority,priority_score=SCORE_BY_PRIORITY[priority],red_flags=red,reasons=reasons,recommended_action=action,screening_due=due,model_version="oral-hybrid-rules-v1.0",limitations=["Priority index is not cancer probability","Rules require local clinician/programme review"])

def assess_breast(patient: Patient, x: BreastInput) -> CancerAssessment:
    applicable=x.applicable and patient.sex_at_birth in {"female","intersex","unknown"}
    red_map={
        "New breast lump":x.new_breast_lump,"Axillary lump":x.axillary_lump,
        "Bloody nipple discharge":x.bloody_nipple_discharge,"New nipple inversion":x.new_nipple_inversion,
        "Skin dimpling or peau d'orange":x.skin_dimpling_or_peau_dorange,
        "Breast ulceration":x.breast_ulceration,"Abnormal clinical breast examination":x.abnormal_cbe,
    }
    red=[k for k,v in red_map.items() if v]
    reasons=[]
    hereditary=any([x.previous_breast_cancer,x.known_pathogenic_variant,x.previous_chest_radiation,x.atypical_hyperplasia_or_lcis,x.first_degree_relatives>=2,x.relative_diagnosed_before_50])
    due=_due(patient.age,applicable,x.screened_before,x.years_since_cbe)
    if red:
        priority=Priority.PROMPT_REFERRAL
        reasons.append(Reason(factor=red[0],effect="Safety override: diagnostic clinical evaluation is required",evidence_key="BREAST_RED_FLAG"))
    elif hereditary:
        priority=Priority.SPECIALIST_ASSESSMENT
        reasons.append(Reason(factor="High-risk personal/family-history feature",effect="Requires specialist risk assessment rather than a generic population score",evidence_key="BREAST_HIGH_RISK"))
    elif due:
        priority=Priority.SCREENING_DUE
        reasons.append(Reason(factor="Population-screening interval",effect="Clinical breast examination is due under configured programme rules",evidence_key="INDIA_PBS_30"))
    else: priority=Priority.ROUTINE
    action={
        Priority.PROMPT_REFERRAL:"Prompt clinical evaluation through the breast referral pathway.",
        Priority.SPECIALIST_ASSESSMENT:"Refer for specialist hereditary/high-risk assessment.",
        Priority.SCREENING_DUE:"Schedule clinical breast examination by a trained provider.",
        Priority.ROUTINE:"Continue breast-awareness counselling and programme screening.",
    }[priority]
    return CancerAssessment(cancer_type="breast",priority=priority,priority_score=SCORE_BY_PRIORITY[priority],red_flags=red,reasons=reasons,recommended_action=action,screening_due=due,model_version="breast-hybrid-rules-v1.0",limitations=["Not a Gail/BCRAT probability estimate","No mammography image model is used"])

def assess_cervical(patient: Patient, x: CervicalInput, probability: float|None=None, threshold: float=0.20) -> CancerAssessment:
    applicable=x.applicable and patient.sex_at_birth in {"female","intersex","unknown"}
    red_map={"Postcoital bleeding":x.postcoital_bleeding,"Postmenopausal bleeding":x.postmenopausal_bleeding,"Unexplained persistent bleeding":x.unexplained_persistent_bleeding,"Persistent foul discharge":x.persistent_foul_discharge,"Pelvic pain":x.pelvic_pain,"Abnormal cervical examination":x.abnormal_cervical_exam}
    red=[k for k,v in red_map.items() if v]
    reasons=[]
    start=25 if x.living_with_hiv else 30
    interval=3 if x.living_with_hiv else 5
    due=_due(patient.age,applicable,x.screened_before,x.years_since_screening,start,interval)
    if red:
        priority=Priority.PROMPT_REFERRAL
        reasons.append(Reason(factor=red[0],effect="Safety override: symptoms require clinical evaluation",evidence_key="CERVICAL_RED_FLAG"))
    elif x.previous_positive_hpv or x.previous_abnormal_via_or_cytology:
        priority=Priority.CLINICAL_FOLLOW_UP
        reasons.append(Reason(factor="Previous abnormal cervical screening result",effect="Requires follow-up under the local screening algorithm",evidence_key="CERVICAL_ABNORMAL_PRIOR"))
    elif due:
        priority=Priority.SCREENING_DUE
        reasons.append(Reason(factor="Configured age/interval eligibility",effect="Cervical screening is due",evidence_key="WHO_CERVICAL_SCREENING"))
    elif probability is not None and probability >= threshold:
        priority=Priority.PRIORITY_SCREENING
        reasons.append(Reason(factor="Experimental history-model output",effect="Raises priority; does not diagnose cancer",evidence_key="CERVICAL_ML"))
    else: priority=Priority.ROUTINE
    action={
        Priority.PROMPT_REFERRAL:"Prompt clinical evaluation; do not delay because of a model score.",
        Priority.CLINICAL_FOLLOW_UP:"Route to the configured follow-up/triage pathway.",
        Priority.SCREENING_DUE:"Schedule cervical screening using the locally approved test and pathway.",
        Priority.PRIORITY_SCREENING:"Prioritise screening; clinician review remains required.",
        Priority.ROUTINE:"Continue screening according to age, risk, and programme interval.",
    }[priority]
    return CancerAssessment(cancer_type="cervical",priority=priority,priority_score=SCORE_BY_PRIORITY[priority],red_flags=red,reasons=reasons,recommended_action=action,screening_due=due,experimental_model_probability=probability,model_version="cervical-hybrid-v1.0",limitations=["Experimental model is not externally validated in the target population","Sensitive history variables require consent and privacy safeguards"])
