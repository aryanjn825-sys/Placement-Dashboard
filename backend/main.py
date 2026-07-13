from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI(title="Placement Dashboard API")

# --- CORS: allow your deployed frontend to call this API ---
# Replace "*" with your actual Vercel URL once deployed, e.g. "https://your-app.vercel.app"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

df = pd.read_csv("Placement_Data_Full_Class.csv")
df.columns = df.columns.str.strip().str.lower()


@app.get("/")
def root():
    return {"status": "ok", "message": "Placement Dashboard API is running"}


@app.get("/api/summary")
def summary():
    placed = df[df["status"] == "Placed"]
    return {
        "total_students": len(df),
        "placed_count": len(placed),
        "placement_rate": round((df["status"] == "Placed").mean() * 100, 1),
        "avg_salary": round(placed["salary"].mean(), 0),
        "median_salary": round(placed["salary"].median(), 0),
    }


@app.get("/api/by-specialisation")
def by_specialisation():
    result = []
    for spec, group in df.groupby("specialisation"):
        placed = group[group["status"] == "Placed"]
        result.append({
            "specialisation": spec,
            "placement_rate": round((group["status"] == "Placed").mean() * 100, 1),
            "avg_salary": round(placed["salary"].mean(), 0) if len(placed) else None,
            "count": len(group),
        })
    return result


@app.get("/api/by-workex")
def by_workex():
    result = []
    for we, group in df.groupby("workex"):
        result.append({
            "workex": we,
            "placement_rate": round((group["status"] == "Placed").mean() * 100, 1),
            "count": len(group),
        })
    return result


@app.get("/api/by-gender")
def by_gender():
    result = []
    for g, group in df.groupby("gender"):
        result.append({
            "gender": g,
            "placement_rate": round((group["status"] == "Placed").mean() * 100, 1),
            "count": len(group),
        })
    return result


@app.get("/api/score-distribution")
def score_distribution():
    # bucket degree_p into ranges for a histogram-style chart
    bins = [0, 50, 60, 70, 80, 90, 100]
    labels = ["<50", "50-60", "60-70", "70-80", "80-90", "90-100"]
    df["degree_bucket"] = pd.cut(df["degree_p"], bins=bins, labels=labels, right=False)
    result = []
    for bucket, group in df.groupby("degree_bucket", observed=True):
        result.append({
            "range": str(bucket),
            "placement_rate": round((group["status"] == "Placed").mean() * 100, 1) if len(group) else 0,
            "count": len(group),
        })
    return result


@app.get("/api/insights")
def insights():
    # the pre-computed, statistically validated findings from the notebook
    return [
        {"title": "Overall placement rate", "value": "68.8%", "significant": None},
        {"title": "Work experience effect", "value": "86.5% vs 59.6%", "p_value": 0.0001, "significant": True},
        {"title": "Specialisation effect", "value": "Mkt&Fin 79.2% vs Mkt&HR 55.8%", "p_value": 0.00042, "significant": True},
        {"title": "Salary gap by specialisation", "value": "₹298,853 vs ₹270,377", "p_value": 0.035, "significant": True},
        {"title": "Degree score vs placement", "value": "68.74% vs 61.13%", "p_value": 0.0000, "significant": True},
        {"title": "Gender gap", "value": "71.9% vs 63.2%", "p_value": 0.24, "significant": False},
    ]
