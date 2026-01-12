import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { getJournalByIdWithFallback } from '../api/api';
import TrendChart from '../components/TrendChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import './Logbook.css';

export default function Logbook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedJournal, query, loading, error } = useAppState();
    const dispatch = useAppDispatch();
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        // Fetch journal if not already selected or different id
        if (!selectedJournal || selectedJournal.id !== id) {
            fetchJournal();
        }
    }, [id]);

    const fetchJournal = async () => {
        setLocalLoading(true);
        dispatch({ type: 'SET_LOADING' });

        try {
            const journal = await getJournalByIdWithFallback(id);
            dispatch({ type: 'SELECT_JOURNAL', payload: journal });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        } finally {
            setLocalLoading(false);
        }
    };

    const handleGenerateBrief = () => {
        navigate(`/brief/${id}`);
    };

    if (loading || localLoading) {
        return <LoadingSpinner message="저널 정보를 불러오는 중..." />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchJournal} />;
    }

    if (!selectedJournal) {
        return <LoadingSpinner message="저널 정보를 불러오는 중..." />;
    }

    const journal = selectedJournal;

    return (
        <div className="logbook">
            <nav className="logbook-nav">
                <Link to="/search" className="back-link">← 검색 결과로 돌아가기</Link>
            </nav>

            <header className="logbook-header">
                <div className="header-main">
                    <h1 className="journal-name">{journal.name}</h1>
                    <span className="discipline-badge">{journal.discipline}</span>
                </div>
                {journal.nameKo && (
                    <p className="journal-name-ko">{journal.nameKo}</p>
                )}
                <p className="journal-description">{journal.description}</p>
            </header>

            <section className="metrics-section">
                <div className="metric-card">
                    <span className="metric-label">영향력 지수 (IF)</span>
                    <span className="metric-value">{journal.impactFactor}</span>
                </div>
                {journal.fitScore && (
                    <div className="metric-card">
                        <span className="metric-label">적합도</span>
                        <span className="metric-value">{journal.fitScore}%</span>
                    </div>
                )}
            </section>

            <section className="trends-section">
                <h2 className="section-title">📊 TrendDigest — 최근 연구 트렌드</h2>
                <TrendChart trends={journal.trends} />
            </section>

            <section className="actions-section">
                <button
                    className="brief-button"
                    onClick={handleGenerateBrief}
                    aria-label="임무 브리핑 생성"
                >
                    📋 임무 브리핑 받기
                </button>
            </section>
        </div>
    );
}
