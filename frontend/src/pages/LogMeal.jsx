import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMeals } from "../hooks/useMeals";
import RatingBadge from "../components/RatingBadge";

export default function LogMeal() {
    const { logMeal, loading, error } = useMeals();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        mealName: "",
        ingredientsRaw: "",
        calories: "",
        notes: "",
        dateTime: new Date().toISOString().slice(0, 16),
    });
    const [result, setResult] = useState(null);
    const [success, setSuccess] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ingredients = form.ingredientsRaw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        try {
            const meal = await logMeal({
                mealName: form.mealName,
                ingredients,
                calories: Number(form.calories),
                dateTime: form.dateTime,
                notes: form.notes,
            });
            setResult(meal);
            setSuccess(true);
        } catch {
            // error handled by hook
        }
    };

    if (success && result) {
        return (
            <div className="page-container">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h2>Meal Logged!</h2>
                    <h3>{result.mealName}</h3>
                    <div className="success-details">
                        <span>🔥 {result.calories} kcal</span>
                        <span>🕒 {new Date(result.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="success-rating">
                        <p>Health Rating</p>
                        <RatingBadge rating={result.healthRating} />
                    </div>
                    {result.healthRating == null && (
                        <p className="rating-note">No ingredients matched in our database — rating unavailable.</p>
                    )}
                    <div className="success-actions">
                        <button className="btn-primary" onClick={() => { setSuccess(false); setForm({ mealName: "", ingredientsRaw: "", calories: "", notes: "", dateTime: new Date().toISOString().slice(0, 16) }); }}>
                            Log Another
                        </button>
                        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Log a Meal</h1>
                    <p className="page-subtitle">Track what you eat and get a health rating</p>
                </div>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="log-meal-layout">
                <form onSubmit={handleSubmit} className="card log-meal-form">
                    <div className="form-group">
                        <label htmlFor="meal-name">Meal Name *</label>
                        <input
                            id="meal-name"
                            type="text"
                            value={form.mealName}
                            onChange={set("mealName")}
                            placeholder="e.g. Grilled Chicken Salad"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="meal-ingredients">
                            Ingredients
                            <span className="label-hint"> (comma-separated)</span>
                        </label>
                        <input
                            id="meal-ingredients"
                            type="text"
                            value={form.ingredientsRaw}
                            onChange={set("ingredientsRaw")}
                            placeholder="e.g. chicken, lettuce, olive oil, salt"
                        />
                        <p className="field-note">Ingredients are checked against our database to generate a health rating.</p>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="meal-calories">Calories (kcal) *</label>
                            <input
                                id="meal-calories"
                                type="number"
                                min="0"
                                value={form.calories}
                                onChange={set("calories")}
                                placeholder="e.g. 450"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="meal-datetime">Date & Time *</label>
                            <input
                                id="meal-datetime"
                                type="datetime-local"
                                value={form.dateTime}
                                onChange={set("dateTime")}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="meal-notes">Notes (optional)</label>
                        <textarea
                            id="meal-notes"
                            value={form.notes}
                            onChange={set("notes")}
                            placeholder="How did it taste? Any health notes..."
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? "Logging meal…" : "Log Meal & Get Rating"}
                    </button>
                </form>

                <div className="log-meal-info">
                    <div className="card info-card">
                        <h3>💡 How it works</h3>
                        <ul>
                            <li>Enter your meal name and ingredients</li>
                            <li>Our system checks each ingredient in the database</li>
                            <li>You instantly receive a <strong>Health Rating (0–5)</strong></li>
                            <li>Calories are added to your daily total</li>
                        </ul>
                    </div>
                    <div className="card info-card">
                        <h3>⭐ Rating Scale</h3>
                        <div className="rating-scale">
                            <div className="scale-item"><span className="good">4–5 ★</span> Excellent</div>
                            <div className="scale-item"><span className="average">2.5–3.9 ★</span> Moderate</div>
                            <div className="scale-item"><span className="poor">0–2.4 ★</span> Poor</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
