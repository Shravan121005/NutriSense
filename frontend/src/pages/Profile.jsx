import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
    const { user, userProfile, refreshProfile } = useAuth();
    const [form, setForm] = useState({ displayName: "", dailyCalorieGoal: 2000 });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (userProfile) {
            setForm({
                displayName: userProfile.displayName || "",
                dailyCalorieGoal: userProfile.dailyCalorieGoal || 2000,
            });
        }
    }, [userProfile]);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSaved(false);
        try {
            await api.put("/users/profile", {
                displayName: form.displayName,
                dailyCalorieGoal: Number(form.dailyCalorieGoal),
            });
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const CALORIE_PRESETS = [1500, 1800, 2000, 2200, 2500, 3000];

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Profile & Settings</h1>
                    <p className="page-subtitle">Manage your account and nutrition goals</p>
                </div>
            </div>

            <div className="profile-grid">
                <div className="card profile-card">
                    <div className="profile-avatar">
                        {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="Profile" className="avatar-img" />
                        ) : (
                            <div className="avatar-placeholder">
                                {(userProfile?.displayName || user?.email || "?")[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="profile-meta">
                        <h3>{userProfile?.displayName || "User"}</h3>
                        <p>{user?.email}</p>
                        <p className="profile-since">Member since {new Date(userProfile?.createdAt || Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-title">Edit Profile</h2>

                    {error && <div className="alert-error">{error}</div>}
                    {saved && <div className="alert-success">✓ Profile saved successfully!</div>}

                    <form onSubmit={handleSave} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="profile-name">Display Name</label>
                            <input
                                id="profile-name"
                                type="text"
                                value={form.displayName}
                                onChange={set("displayName")}
                                placeholder="Your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile-email">Email</label>
                            <input id="profile-email" type="email" value={user?.email || ""} disabled className="disabled-input" />
                            <p className="field-note">Email cannot be changed here.</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile-calories">Daily Calorie Goal (kcal)</label>
                            <input
                                id="profile-calories"
                                type="number"
                                min="500"
                                max="10000"
                                value={form.dailyCalorieGoal}
                                onChange={set("dailyCalorieGoal")}
                                required
                            />
                            <div className="calorie-presets">
                                {CALORIE_PRESETS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        className={`preset-btn ${Number(form.dailyCalorieGoal) === p ? "active" : ""}`}
                                        onClick={() => setForm((f) => ({ ...f, dailyCalorieGoal: p }))}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
