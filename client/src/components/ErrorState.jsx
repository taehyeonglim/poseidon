import { Link } from 'react-router-dom';
import './ErrorState.css';

export default function ErrorState({ message = '폭풍이 몰아칩니다', onRetry }) {
    return (
        <div className="error-state" role="alert">
            <div className="error-icon" aria-hidden="true">⛈️</div>
            <h3 className="error-message">{message}</h3>
            <p className="error-detail">잠시 후 다시 시도해 주세요</p>
            <div className="error-actions">
                {onRetry && (
                    <button className="retry-button" onClick={onRetry}>
                        다시 시도
                    </button>
                )}
                <Link to="/" className="home-link">
                    항구로 돌아가기
                </Link>
            </div>
        </div>
    );
}
