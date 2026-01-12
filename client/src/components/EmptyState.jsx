import './EmptyState.css';

export default function EmptyState({ message, suggestion }) {
    return (
        <div className="empty-state" role="status">
            <div className="empty-icon" aria-hidden="true">🧭</div>
            <h3 className="empty-message">{message}</h3>
            {suggestion && (
                <p className="empty-suggestion">{suggestion}</p>
            )}
        </div>
    );
}
