import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAnalytics } from "../hooks/useAnalytics";
import { useMeals } from "../hooks/useMeals";
import CalorieProgress from "../components/CalorieProgress";
import MealCard from "../components/MealCard";
import InsightCard from "../components/InsightCard";
import Spinner from "../components/Spinner";
import { useNotifications } from "../hooks/useNotifications";

const generateInsights = (today, userProfile, meals) => {
    const insights = [];
    const goal = userProfile?.dailyCalorieGoal || 2000;
    const cal = today?.totalCalories || 0;
    const rating = today?.averageRating;

    if (cal > goal) {
        insights.push({ icon: "⚠️", title: "Over Daily Goal", message: `You've consumed ${cal - goal} kcal more than your goal today.`, type: "warning" });
    } else if (cal < goal * 0.5 && today?.mealsCount > 0) {
        insights.push({ icon: "💡", title: "Low Intake", message: "You've eaten less than 50% of your calorie goal. Stay fueled!", type: "info" });
    }

    if (rating != null && rating >= 4) {
        insights.push({ icon: "🌟", title: "Great Food Choices!", message: `Your average meal rating today is ${rating}/5. Keep it up!`, type: "success" });
    } else if (rating != null && rating < 2.5) {
        insights.push({ icon: "🥦", title: "Improve Your Diet", message: "Your meal ratings are low. Try adding more whole foods.", type: "warning" });
    }

    if (today?.mealsCount === 0) {
        insights.push({ icon: "🍽️", title: "No Meals Logged", message: "You haven't logged any meals yet today. Start tracking!", type: "info" });
    }

    return insights;
};

export default function Dashboard() {
    const { userProfile } = useAuth();
    const { fetchTodaySummary, data } = useAnalytics();
    const { meals, fetchMeals, deleteMeal, loading } = useMeals();
    useNotifications();

    const today = data.today;
    const goal = userProfile?.dailyCalorieGoal || 2000;

    useEffect(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        fetchTodaySummary();
        fetchMeals({ start: start.toISOString(), end: end.toISOString(), limit: 5 });
    }, []);

    const insights = generateInsights(today, userProfile, meals);

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Good {getGreeting()}, {userProfile?.displayName?.split(" ")[0] || "there"}! 👋</h1>
                    <p className="page-subtitle">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                </div>
                <Link to="/log-meal" className="btn-primary">+ Log Meal</Link>
            </div>

            <div className="dashboard-grid">
                <div className="card span-2">
                    <h2 className="card-title">Today's Calories</h2>
                    <CalorieProgress consumed={today?.totalCalories || 0} goal={goal} />
                </div>

                <div className="card">
                    <h2 className="card-title">Meals Today</h2>
                    <div className="stat-big">{today?.mealsCount || 0}</div>
                    <p className="stat-label">meals logged</p>
                </div>

                <div className="card">
                    <h2 className="card-title">Avg. Health Rating</h2>
                    <div className="stat-big green">
                        {today?.averageRating != null ? `${today.averageRating}/5` : "–"}
                    </div>
                    <p className="stat-label">today's score</p>
                </div>
            </div>

            {insights.length > 0 && (
                <section className="section">
                    <h2 className="section-title">💡 Insights</h2>
                    <div className="insights-grid">
                        {insights.map((ins, i) => <InsightCard key={i} {...ins} />)}
                    </div>
                </section>
            )}

            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Recent Meals</h2>
                    <Link to="/history" className="link-muted">View all →</Link>
                </div>
                {loading ? <Spinner /> : meals.length === 0 ? (
                    <div className="empty-state">
                        <p>No meals logged today.</p>
                        <Link to="/log-meal" className="btn-primary">Log your first meal</Link>
                    </div>
                ) : (
                    <div className="meals-list">
                        {meals.map((m) => <MealCard key={m._id} meal={m} onDelete={deleteMeal} />)}
                    </div>
                )}
            </section>
        </div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "morning";
    if (h < 17) return "afternoon";
    return "evening";
}
