import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "./App.css";

// IMPORTANT: change this to your deployed backend URL once you deploy (e.g. Render URL)
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function InsightRow({ insight }) {
  const badge =
    insight.significant === true ? "sig-yes"
    : insight.significant === false ? "sig-no"
    : "sig-neutral";
  const badgeText =
    insight.significant === true ? "Statistically significant"
    : insight.significant === false ? "Not statistically significant"
    : "";
  return (
    <div className="insight-row">
      <div>
        <div className="insight-title">{insight.title}</div>
        <div className="insight-value">{insight.value}</div>
      </div>
      {badgeText && <span className={`badge ${badge}`}>{badgeText}</span>}
    </div>
  );
}

export default function App() {
  const [summary, setSummary] = useState(null);
  const [bySpec, setBySpec] = useState([]);
  const [byWorkex, setByWorkex] = useState([]);
  const [byGender, setByGender] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/summary`).then((r) => r.json()),
      fetch(`${API_BASE}/api/by-specialisation`).then((r) => r.json()),
      fetch(`${API_BASE}/api/by-workex`).then((r) => r.json()),
      fetch(`${API_BASE}/api/by-gender`).then((r) => r.json()),
      fetch(`${API_BASE}/api/insights`).then((r) => r.json()),
    ])
      .then(([s, spec, we, g, ins]) => {
        setSummary(s);
        setBySpec(spec);
        setByWorkex(we);
        setByGender(g);
        setInsights(ins);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div className="app">
      <header>
        <h1>Student Placement Dashboard</h1>
        <p className="subtitle">
          Analysis of 215 MBA student placement outcomes — academics, work experience, and specialisation
        </p>
      </header>

      {summary && (
        <div className="stats-grid">
          <StatCard label="Total Students" value={summary.total_students} />
          <StatCard label="Placement Rate" value={`${summary.placement_rate}%`} />
          <StatCard label="Avg Salary" value={`₹${summary.avg_salary.toLocaleString()}`} />
          <StatCard label="Median Salary" value={`₹${summary.median_salary.toLocaleString()}`} />
        </div>
      )}

      <section className="chart-section">
        <h2>Placement Rate by Specialisation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bySpec}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="specialisation" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="placement_rate" fill="#4C72B0" name="Placement Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h2>Placement Rate by Work Experience</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byWorkex}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="workex" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="placement_rate" fill="#55A868" name="Placement Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="chart-section">
        <h2>Placement Rate by Gender</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byGender}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="gender" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="placement_rate" fill="#C44E52" name="Placement Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="insights-section">
        <h2>Key Insights (Statistically Validated)</h2>
        {insights.map((ins, i) => (
          <InsightRow key={i} insight={ins} />
        ))}
      </section>

      <footer>
        <p>Built with FastAPI + React · Data: Kaggle Campus Placement Dataset</p>
      </footer>
    </div>
  );
}
