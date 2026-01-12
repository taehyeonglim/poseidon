import './LoadingSpinner.css';

export default function LoadingSpinner({ message = '로딩 중...' }) {
    return (
        <div className="loading-spinner" role="status" aria-live="polite">
            <div className="spinner-icon" aria-hidden="true">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
            <p className="spinner-message">{message}</p>
        </div>
    );
}
