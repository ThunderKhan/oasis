"""Train an experimental history-only cervical prioritisation model.

Expected source: UCI Cervical Cancer (Risk Factors) CSV.
Never use downstream diagnostic/screening-result columns as predictors.
"""
from pathlib import Path
import joblib, pandas as pd, numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

DATA=Path("data/risk_factors_cervical_cancer.csv")
OUT=Path("models/cervical_history_model.joblib")
TARGET="Biopsy"
LEAKAGE=["Hinselmann","Schiller","Citology","Dx:Cancer","Dx:CIN","Dx:HPV","Dx"]
FEATURES=["Age","Number of sexual partners","First sexual intercourse","Num of pregnancies","Smokes","Smokes (years)","Hormonal Contraceptives (years)","IUD (years)","STDs","STDs (number)"]

def choose_threshold(y,probs,min_sensitivity=0.80):
    best=(0.20,-1.0)
    for t in np.arange(.05,.81,.01):
        tn,fp,fn,tp=confusion_matrix(y,probs>=t,labels=[0,1]).ravel()
        sens=tp/(tp+fn) if tp+fn else 0
        spec=tn/(tn+fp) if tn+fp else 0
        if sens>=min_sensitivity and spec>best[1]: best=(float(t),float(spec))
    return best[0]

def main():
    df=pd.read_csv(DATA,na_values=["?"])
    y=pd.to_numeric(df[TARGET],errors="coerce")
    keep=y.notna(); y=y[keep].astype(int); X=df.loc[keep,FEATURES].apply(pd.to_numeric,errors="coerce")
    Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.20,stratify=y,random_state=42)
    prep=ColumnTransformer([("num",Pipeline([("imputer",SimpleImputer(strategy="median")),("scale",StandardScaler())]),FEATURES)])
    base=Pipeline([("prep",prep),("clf",LogisticRegression(class_weight="balanced",max_iter=5000,random_state=42))])
    model=CalibratedClassifierCV(base,method="sigmoid",cv=5).fit(Xtr,ytr)
    probs=model.predict_proba(Xte)[:,1]; threshold=choose_threshold(yte,probs)
    print({"roc_auc":roc_auc_score(yte,probs),"pr_auc":average_precision_score(yte,probs),"brier":brier_score_loss(yte,probs),"threshold":threshold,"confusion_matrix":confusion_matrix(yte,probs>=threshold).tolist()})
    OUT.parent.mkdir(exist_ok=True)
    joblib.dump({"model":model,"feature_names":FEATURES,"threshold":threshold,"target":TARGET,"version":"cervical-history-lr-v1.0"},OUT)
if __name__=="__main__": main()
