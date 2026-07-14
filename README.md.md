# Student Placement Dashboard

A full-stack data analytics dashboard that explores what actually drives MBA campus placement outcomes — built with a FastAPI backend, a React + Recharts frontend, and a statistically validated data science pipeline.

**Live demo:** https://placement-dashboard-eta.vercel.app
**API:** https://placement-dashboard-f8z1.onrender.com

> Note: the backend runs on Render's free tier, which spins down after inactivity. The first load may take 30–50 seconds while it wakes up.

---

## The problem

Most student placement analyses stop at descriptive percentages — "specialisation X has a higher placement rate than Y" — without checking whether that difference is actually real or just noise from a small sample. This project goes a step further: every headline claim in the dashboard is backed by a statistical significance test (chi-square / t-test), and the app is transparent about which findings are statistically confirmed and which are not.

## Key findings

| Finding | Result | Statistically significant? |
|---|---|---|
| Overall placement rate | 68.8% | — |
| Work experience effect | 86.5% (with) vs 59.6% (without) | ✅ Yes (p = 0.0001) |
| Specialisation effect | Mkt&Fin 79.2% vs Mkt&HR 55.8% | ✅ Yes (p = 0.00042) |
| Salary gap by specialisation | ₹298,853 vs ₹270,377 | ✅ Yes (p = 0.035) |
| Degree score vs placement | 68.74% (placed) vs 61.13% (not placed) | ✅ Yes (p ≈ 0) |
| Gender gap | 71.9% vs 63.2% | ❌ No (p = 0.24) — likely sampling noise |

The gender gap finding is intentionally reported as non-significant rather than omitted — with only 215 students, the observed difference isn't strong enough to call it a real effect, and the dashboard says so rather than overstating it.

## Tech stack

**Backend**
- FastAPI (Python) — serves aggregated statistics via REST endpoints
- Pandas — data loading and aggregation
- Deployed on Render

**Frontend**
- React (Vite)
- Recharts — interactive bar charts
- Deployed on Vercel

**Data Science**
- Jupyter Notebook (`Placement_Analysis.ipynb`) — full pipeline: data cleaning validation, EDA, chi-square tests, t-tests
- scipy.stats for significance testing

## Dataset

[Factors Affecting Campus Placement](https://www.kaggle.com/datasets/benroshan/factors-affecting-campus-placement) (Kaggle) — 215 MBA student records including academic scores (10th, 12th, degree, MBA), work experience, specialisation, and placement outcome/salary.

## Project structure

```
placement-app/
├── backend/
│   ├── main.py                          # FastAPI app + endpoints
│   ├── requirements.txt
│   ├── runtime.txt
│   └── Placement_Data_Full_Class.csv
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Dashboard UI
│   │   └── App.css
│   └── package.json
└── Placement_Analysis.ipynb             # Full data science notebook
```

## API endpoints

| Endpoint | Description |
|---|---|
| `GET /api/summary` | Overall stats: total students, placement rate, avg/median salary |
| `GET /api/by-specialisation` | Placement rate and salary broken down by specialisation |
| `GET /api/by-workex` | Placement rate by work experience |
| `GET /api/by-gender` | Placement rate by gender |
| `GET /api/score-distribution` | Placement rate by degree score bucket |
| `GET /api/insights` | The 6 pre-computed, statistically validated findings |

## Running locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs on `http://127.0.0.1:8000`

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://127.0.0.1:5173`

**Notebook**
```bash
cd backend  # CSV lives here
jupyter notebook ../Placement_Analysis.ipynb
```

## What I'd improve next

- Add a filterable explorer view (select specialisation/gender/workex and see live-updating charts)
- Expand beyond MBA data to engineering/BCA placement datasets for closer relevance to my own academic background
- Add unit tests for the FastAPI endpoints

## Author

Built by [Aryan](https://github.com/aryanjn825-sys) — BCA student (Health Informatics), Jaipur.
