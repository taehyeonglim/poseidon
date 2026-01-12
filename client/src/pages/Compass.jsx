import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { searchJournalsWithFallback } from '../api/api';
import SearchBar from '../components/SearchBar';
import JournalList from '../components/JournalList';
import ErrorState from '../components/ErrorState';
import './Compass.css';

export default function Compass() {
    const navigate = useNavigate();
    const { query, results, loading, error } = useAppState();
    const dispatch = useAppDispatch();

    const handleSearch = async (newQuery) => {
        dispatch({ type: 'SET_LOADING' });

        try {
            const newResults = await searchJournalsWithFallback(newQuery);
            dispatch({
                type: 'SEARCH_SUCCESS',
                payload: { query: newQuery, results: newResults }
            });
        } catch (err) {
            dispatch({
                type: 'SET_ERROR',
                payload: err.message
            });
        }
    };

    if (error) {
        return <ErrorState message={error} onRetry={() => handleSearch(query)} />;
    }

    // If no query, redirect to Harbor
    if (!query && !loading && results.length === 0) {
        navigate('/');
        return null;
    }

    return (
        <div className="compass">
            <header className="compass-header">
                <h1 className="compass-title">🧭 나침반</h1>
                <p className="compass-subtitle">검색어: "{query}"</p>
            </header>

            <section className="search-refine">
                <SearchBar
                    onSearch={handleSearch}
                    loading={loading}
                    placeholder="새로운 키워드로 다시 검색..."
                />
            </section>

            <section className="results-section">
                <JournalList
                    journals={results}
                    loading={loading}
                    query={query}
                />
            </section>
        </div>
    );
}
