import RatingBadge from "./RatingBadge";

export default function MealCard({ meal, onDelete }) {
    const date = new Date(meal.dateTime);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });

    return (
        <div className="meal-card">
            <div className="meal-card-header">
                <div className="meal-info">
                    <h3 className="meal-name">{meal.mealName}</h3>
                    <span className="meal-time">{dateStr} · {timeStr}</span>
                </div>
                <RatingBadge rating={meal.healthRating} />
            </div>
            <div className="meal-card-body">
                <div className="meal-meta">
                    <span className="meal-calories">🔥 {meal.calories} kcal</span>
                    {meal.ingredients?.length > 0 && (
                        <span className="meal-ingredients">
                            🥗 {meal.ingredients.slice(0, 4).join(", ")}
                            {meal.ingredients.length > 4 ? ` +${meal.ingredients.length - 4} more` : ""}
                        </span>
                    )}
                </div>
                {meal.notes && <p className="meal-notes">"{meal.notes}"</p>}
            </div>
            {onDelete && (
                <button
                    className="meal-delete-btn"
                    onClick={() => onDelete(meal._id)}
                    aria-label="Delete meal"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
