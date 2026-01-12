import { useNavigate } from 'react-router-dom';
import './JournalCard.css';

export default function JournalCard({ journal }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/journal/${journal.id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    const getScoreClass = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 50) return 'score-medium';
        return 'score-low';
    };

    return (
        <article
            className="journal-card"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${journal.name} 상세 보기`}
        >
            <div className="card-header">
                <h3 className="card-title">{journal.name}</h3>
                <span className="card-discipline">{journal.discipline}</span>
            </div>

            <p className="card-description">{journal.description}</p>

            <div className="card-metrics">
                <div className="fit-score">
                    <div className="score-label">
                        <span>적합도</span>
                        <span className="score-value">{journal.fitScore}%</span>
                    </div>
                    <div className="score-bar">
                        <div
                            className={`score-fill ${getScoreClass(journal.fitScore)}`}
                            style={{ width: `${journal.fitScore}%` }}
                            role="progressbar"
                            aria-valuenow={journal.fitScore}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                    </div>
                </div>

                <div className="impact-factor">
                    <span className="if-label">IF</span>
                    <span className="if-value">{journal.impactFactor}</span>
                </div>
            </div>

            {journal.matchReason && (
                <div className="match-tag">
                    <span className="tag-icon">🎯</span>
                    {journal.matchReason}
                </div>
            )}

            {journal.matchedTags && journal.matchedTags.length > 0 && (
                <div className="scope-tags">
                    {journal.matchedTags.map(tag => (
                        <span key={tag} className="scope-tag">{tag}</span>
                    ))}
                </div>
            )}
        </article>
    );
}
