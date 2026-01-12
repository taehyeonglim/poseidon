import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading = false, placeholder = '연구 키워드 또는 초록을 입력하세요...' }) {
    const [input, setInput] = useState('');
    const maxLength = 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !loading) {
            onSearch(input.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const isDisabled = !input.trim() || loading;

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <textarea
                    className="search-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    rows={3}
                    aria-label="연구 키워드 입력"
                    disabled={loading}
                />
                <span className="char-count" aria-live="polite">
                    {input.length}/{maxLength}
                </span>
            </div>

            <button
                type="submit"
                className={`search-button ${loading ? 'loading' : ''}`}
                disabled={isDisabled}
                aria-label={loading ? '검색 중' : '저널 검색'}
            >
                {loading ? (
                    <>
                        <span className="spinner" aria-hidden="true"></span>
                        항해 중...
                    </>
                ) : (
                    <>
                        <span aria-hidden="true">🧭</span>
                        항해 시작
                    </>
                )}
            </button>
        </form>
    );
}
