import { useEffect } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useAnalytics } from "../hooks/useAnalytics";
import Spinner from "../components/Spinner";

const COLORS = ["#4ade80", "#60a5fa", "#f472b6", "#fb923c", "#a78bfa", "#facc15", "#34d399", "#f87171"];

const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function Analytics() {
    const { data, loading, fetchWeeklyTrend, fetchTopFoods, fetchAvgRating, fetchDailyCalories } = useAnalytics();

    useEffect(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        fetchDailyCalories(start.toISOString().split("T")[0], end.toISOString().split("T")[0]);
        fetchWeeklyTrend();
        fetchTopFoods();
        fetchAvgRating();
    }, []);

    const barData = (data.daily || []).map((d) => ({
        date: formatDate(d.date),
        Calories: d.totalCalories,
    }));

    const lineData = (data.avgRating || []).map((d) => ({
        date: formatDate(d.date),
        Rating: d.averageRating,
    }));

    const pieData = (data.topFoods || []).map((f) => ({
        name: f.name,
        value: f.count,
    }));

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Analytics</h1>
                    <p className="page-subtitle">Visualize your nutrition habits over time</p>
                </div>
            </div>

            {loading && <Spinner />}

            <div className="analytics-grid">
                {/* Bar Chart – Daily Calories */}
                <div className="card chart-card span-2">
                    <h2 className="card-title">Daily Calorie Intake (Last 30 Days)</h2>
                    {barData.length === 0 ? (
                        <p className="no-data">No data yet. Log some meals to see your calorie intake.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                                <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: "#1e1e3a", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#86efac" }} />
                                <Bar dataKey="Calories" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Line Chart – Avg Rating */}
                <div className="card chart-card span-2">
                    <h2 className="card-title">Average Health Rating (Last 30 Days)</h2>
                    {lineData.length === 0 ? (
                        <p className="no-data">No rating data yet. Log meals with ingredients to see trends.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                                <YAxis domain={[0, 5]} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: "#1e1e3a", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "8px" }} labelStyle={{ color: "#86efac" }} />
                                <Line type="monotone" dataKey="Rating" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: "#a78bfa" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pie Chart – Top Foods */}
                <div className="card chart-card">
                    <h2 className="card-title">Most Eaten Meals</h2>
                    {pieData.length === 0 ? (
                        <p className="no-data">No meals logged yet.</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#1e1e3a", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "8px" }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Weekly summary table */}
                <div className="card chart-card">
                    <h2 className="card-title">This Week's Summary</h2>
                    {!data.weekly || data.weekly.length === 0 ? (
                        <p className="no-data">No data for this week.</p>
                    ) : (
                        <div className="weekly-table">
                            <div className="weekly-header">
                                <span>Date</span>
                                <span>Meals</span>
                                <span>Calories</span>
                                <span>Rating</span>
                            </div>
                            {data.weekly.map((d) => (
                                <div className="weekly-row" key={d.date}>
                                    <span>{formatDate(d.date)}</span>
                                    <span>{d.mealsCount}</span>
                                    <span>{d.totalCalories} kcal</span>
                                    <span>{d.averageRating != null ? `${d.averageRating}/5` : "–"}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
