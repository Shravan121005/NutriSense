export default function RatingBadge({ rating }) {
    if (rating == null) return <span className="rating-badge na">N/A</span>;

    const r = parseFloat(rating);
    let cls = "good";
    if (r < 2) cls = "poor";
    else if (r < 3.5) cls = "average";

    const stars = "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

    return (
        <div className={`rating-badge ${cls}`}>
            <span className="rating-stars">{stars}</span>
            <span className="rating-num">{r.toFixed(1)}/5</span>
        </div>
    );
}
