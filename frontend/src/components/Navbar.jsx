import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: "⊞" },
    { to: "/log-meal", label: "Log Meal", icon: "✚" },
    { to: "/history", label: "History", icon: "☰" },
    { to: "/analytics", label: "Analytics", icon: "◈" },
    { to: "/profile", label: "Profile", icon: "⊙" },
];

export default function Navbar() {
    const { user, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-icon">🥦</span>
                <span className="brand-name">NutriSense</span>
            </div>
            <div className="navbar-links">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon">{icon}</span>
                        <span className="nav-label">{label}</span>
                    </NavLink>
                ))}
            </div>
            <div className="navbar-user">
                <span className="user-name">
                    {userProfile?.displayName || user?.email?.split("@")[0] || "User"}
                </span>
                <button className="logout-btn" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
