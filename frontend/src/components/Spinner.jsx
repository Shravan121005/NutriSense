export default function Spinner({ size = "md", text = "Loading..." }) {
    const sz = size === "sm" ? "28px" : size === "lg" ? "60px" : "40px";
    return (
        <div className="spinner-wrap">
            <div className="spinner" style={{ width: sz, height: sz }} />
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );
}
