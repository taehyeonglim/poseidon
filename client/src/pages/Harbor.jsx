import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { searchJournalsWithFallback } from '../api/api';
import SearchBar from '../components/SearchBar';
import './Harbor.css';

export default function Harbor() {
    const navigate = useNavigate();
    const { loading } = useAppState();
    const dispatch = useAppDispatch();

    const handleSearch = async (query) => {
        dispatch({ type: 'SET_LOADING' });

        try {
            const results = await searchJournalsWithFallback(query);
            dispatch({
                type: 'SEARCH_SUCCESS',
                payload: { query, results }
            });
            navigate('/search');
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error.message
            });
        }
    };

    return (
        <div className="harbor">
            <section className="hero">
                <div className="hero-icon" aria-hidden="true">🔱</div>
                <h1 className="hero-title">POSEIDON</h1>
                <p className="hero-subtitle">학술 항해사</p>
                <p className="hero-description">
                    연구 키워드를 입력하면 가장 적합한 학술지를 찾아드립니다
                </p>
            </section>

            <section className="search-section">
                <SearchBar
                    onSearch={handleSearch}
                    loading={loading}
                    placeholder="연구 키워드를 입력하세요 (예: 협력 학습, AI in Education, CSCL)"
                />
            </section>

            <section className="features">
                <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <h3>ScopeMatch</h3>
                    <p>연구 주제와의 적합성 분석</p>
                </div>
                <div className="feature">
                    <span className="feature-icon">📊</span>
                    <h3>TrendDigest</h3>
                    <p>최신 연구 트렌드 시각화</p>
                </div>
                <div className="feature">
                    <span className="feature-icon">📋</span>
                    <h3>Captain's Brief</h3>
                    <p>맞춤형 저널 분석 리포트</p>
                </div>
            </section>
        </div>
    );
}
