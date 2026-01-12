import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { generateBriefWithFallback, getJournalByIdWithFallback } from '../api/api';
import BriefPanel from '../components/BriefPanel';
import ExportButton from '../components/ExportButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import './BriefingRoom.css';

export default function BriefingRoom() {
    const { id } = useParams();
    const { brief, query, selectedJournal, loading, error } = useAppState();
    const dispatch = useAppDispatch();
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        // Generate brief if not already generated for this journal
        if (!brief || brief.journalId !== id) {
            generateNewBrief();
        }
    }, [id]);

    const generateNewBrief = async () => {
        setLocalLoading(true);
        dispatch({ type: 'SET_LOADING' });

        try {
            // Ensure we have journal data
            if (!selectedJournal || selectedJournal.id !== id) {
                await getJournalByIdWithFallback(id);
            }

            const newBrief = await generateBriefWithFallback(id, query);
            dispatch({ type: 'GENERATE_BRIEF_SUCCESS', payload: newBrief });
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message });
        } finally {
            setLocalLoading(false);
        }
    };

    if (loading || localLoading) {
        return <LoadingSpinner message="임무 브리핑을 생성 중입니다..." />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={generateNewBrief} />;
    }

    if (!brief) {
        return <LoadingSpinner message="임무 브리핑을 준비 중입니다..." />;
    }

    return (
        <div className="briefing-room">
            <nav className="briefing-nav">
                <Link to={`/journal/${id}`} className="back-link">← 항해일지로 돌아가기</Link>
            </nav>

            <header className="briefing-header">
                <h1 className="briefing-title">📋 브리핑실</h1>
                <p className="briefing-subtitle">{brief.journalName}</p>
            </header>

            <section className="brief-section">
                <BriefPanel brief={brief} />
            </section>

            <section className="export-section">
                <ExportButton
                    text={brief.brief}
                    filename={`poseidon-brief-${id}.txt`}
                />
            </section>

            <footer className="briefing-footer">
                <Link to="/" className="new-search-link">
                    🔱 새로운 항해 시작하기
                </Link>
            </footer>
        </div>
    );
}
