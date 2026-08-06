# PPT-ready Mathematical Models and Equations

## 1. Hybrid decision equation

For cancer pathway c:

**D_c(x) = max_rank { R_c(x), G_c(x), M_c(x) }**

- R_c: red-flag rule output
- G_c: guideline/screening-eligibility output
- M_c: optional model-based priority
- `max_rank` means the most urgent category wins.

Defensible claim: a low statistical score cannot suppress a clinical red flag.

## 2. Logistic regression for experimental cervical history risk

**p(y=1|x) = sigma(beta_0 + sum_j beta_j x_j)**

where **sigma(z)=1/(1+e^{-z})**.

Use: interpretable baseline classifier mapping demographic/history variables to an experimental probability. Do not call it a diagnosis.

## 3. Weighted binary cross-entropy

**L = - sum_i [ w_1 y_i log(p_i) + w_0(1-y_i)log(1-p_i) ]**

Use: class weighting penalises mistakes on the minority positive class more strongly.

## 4. Decision threshold

**ŷ_i(t)=1[p_i >= t]**

Choose t on validation data to satisfy a clinically chosen minimum sensitivity, then maximise specificity:

**t* = argmax_t Specificity(t), subject to Sensitivity(t) >= S_min**

This is more defensible for screening than automatically using t=0.5.

## 5. Sensitivity and specificity

**Sensitivity = TP/(TP+FN)**

**Specificity = TN/(TN+FP)**

Primary screening emphasis: reduce false negatives while maintaining workable referral volume.

## 6. Precision and F1

**Precision = TP/(TP+FP)**

**F1 = 2(Precision×Recall)/(Precision+Recall)**

Use alongside sensitivity because accuracy is misleading under class imbalance.

## 7. Brier score for calibration

**BS = (1/N) sum_i (p_i-y_i)^2**

Lower is better. It evaluates whether predicted probabilities are probabilistically calibrated, not only correctly ranked.

## 8. Screening-priority index

For explainable rule prioritisation:

**S_c = clip(0,100, b_c + sum_j w_cj I_j + gamma_c F_c)**

- I_j is a present/absent risk indicator.
- F_c is a red-flag indicator.
- gamma_c is deliberately dominant.

In O.A.S.I.S. this is presented only as an ordinal priority index—not a disease probability. The MVP implementation maps final categories to stable display values rather than claiming learned clinical weights.

## 9. Random forest comparison model

**p_RF(y=1|x) = (1/B) sum_b h_b(x)**

Each h_b is a tree probability/vote; B is the number of trees. Use as a benchmark against logistic regression, not automatically as the deployed winner.

## 10. SHAP explanation equation (optional)

**f(x) = phi_0 + sum_j phi_j**

phi_j is the contribution of feature j to the prediction relative to a baseline. Use only for the experimental ML component; rule explanations should come directly from triggered logic.

## PPT wording you can use

“O.A.S.I.S. uses a safety-first hybrid inference architecture. Red-flag rules and screening eligibility are evaluated before a calibrated statistical model. The final recommendation is the highest-urgency result, preventing algorithmic reassurance when clinically concerning symptoms are present.”

“Model thresholds are selected using sensitivity-constrained validation rather than default accuracy maximisation, because missing a screen-positive patient is more consequential than generating a manageable additional referral.”
