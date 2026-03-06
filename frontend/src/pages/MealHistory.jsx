import { useEffect, useState } from "react";
import { useMeals } from "../hooks/useMeals";
import MealCard from "../components/MealCard";
import Spinner from "../components/Spinner";

export default function MealHistory() {
    const { meals, loading, fetchMeals, deleteMeal } = useMeals();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchMeals({ limit: 100 });
    }, []);

    const handleFilter = (e) => {
        e.preventDefault();
        const params = { limit: 100 };
        if (startDate) params.start = new Date(startDate).toISOString();
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            params.end = end.toISOString();
        }
        fetchMeals(params);
    };

    const filtered = meals.filter((m) =>
        m.mealName.toLowerCase().includes(search.toLowerCase())
    );

    const totalCal = filtered.reduce((s, m) => s + m.calories, 0);
    const rated = filtered.filter((m) => m.healthRating != null);
    const avgRating = rated.length
        ? (rated.reduce((s, m) => s + m.healthRating, 0) / rated.length).toFixed(2)
        : null;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Meal History</h1>
                    <p className="page-subtitle">All your logged meals in one place</p>
                </div>
            </div>

            <div className="card filter-bar">
                <form onSubmit={handleFilter} className="filter-form">
                    <div className="form-group">
                        <label>From</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Search</label>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search meals…" />
                    </div>
                    <button type="submit" className="btn-secondary">Apply Filter</button>
                    <button type="button" className="btn-ghost" onClick={() => { setStartDate(""); setEndDate(""); setSearch(""); fetchMeals({ limit: 100 }); }}>
                        Clear
                    </button>
                </form>
            </div>

            <div className="history-summary">
                <div className="summary-chip">📋 {filtered.length} meals</div>
                <div className="summary-chip">🔥 {totalCal.toLocaleString()} kcal total</div>
                {avgRating && <div className="summary-chip">⭐ Avg Rating: {avgRating}/5</div>}
            </div>

            {loading ? (
                <Spinner />
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <p>No meals found for the selected filters.</p>
                </div>
            ) : (
                <div className="meals-list">
                    {filtered.map((m) => (
                        <MealCard key={m._id} meal={m} onDelete={deleteMeal} />
                    ))}
                </div>
            )}
        </div>
    );
}
