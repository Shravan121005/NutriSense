export default function CalorieProgress({ consumed, goal }) {
    const pct = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
    const remaining = Math.max(goal - consumed, 0);
    const over = consumed > goal;

    return (
        <div className="calorie-progress">
            <div className="calorie-stats">
                <div className="cal-stat">
                    <span className="cal-value">{consumed.toLocaleString()}</span>
                    <span className="cal-label">Consumed</span>
                </div>
                <div className="cal-stat center">
                    <span className="cal-value goal">{goal.toLocaleString()}</span>
                    <span className="cal-label">Daily Goal</span>
                </div>
                <div className="cal-stat">
                    <span className={`cal-value ${over ? "over" : "remaining"}`}>
                        {over ? `+${(consumed - goal).toLocaleString()}` : remaining.toLocaleString()}
                    </span>
                    <span className="cal-label">{over ? "Over Goal" : "Remaining"}</span>
                </div>
            </div>
            <div className="progress-bar-track">
                <div
                    className={`progress-bar-fill ${over ? "over" : ""}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="progress-label">{pct.toFixed(0)}% of daily goal</p>
        </div>
    );
}
