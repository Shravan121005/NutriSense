export default function InsightCard({ icon, title, message, type = "info" }) {
    return (
        <div className={`insight-card insight-${type}`}>
            <span className="insight-icon">{icon}</span>
            <div className="insight-content">
                <h4 className="insight-title">{title}</h4>
                <p className="insight-message">{message}</p>
            </div>
        </div>
    );
}
