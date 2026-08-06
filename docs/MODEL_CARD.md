# O.A.S.I.S. Model Card

## Intended use
Clinician-facing screening eligibility, prioritisation, referral support, and follow-up demonstration.

## Not intended use
Diagnosis, exclusion of cancer, treatment recommendation, autonomous clinical decision-making, or unsupervised public self-diagnosis.

## Components
1. Safety override rules for symptoms and abnormal examination findings.
2. Configured screening eligibility rules.
3. Ordinal screening-priority index.
4. Optional calibrated logistic-regression cervical history model.

## Known limitations
- Oral and breast priority values are not validated cancer probabilities.
- The public cervical dataset is small, incomplete, imbalanced, and not locally representative.
- No prospective or external clinical validation has been performed.
- Sensitive reproductive/sexual history requires informed consent and strong access controls.
- Local programmes may use different tests, age bands, and intervals.
