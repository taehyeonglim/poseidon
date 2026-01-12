import JournalCard from './JournalCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import './JournalList.css';

export default function JournalList({ journals, loading = false, query = '' }) {
    if (loading) {
        return <LoadingSpinner message="저널을 탐색 중입니다..." />;
    }

    if (!journals || journals.length === 0) {
        return (
            <EmptyState
                message="항해할 수 있는 바다를 찾지 못했습니다"
                suggestion={query ? `"${query}"에 대한 다른 키워드를 시도해 보세요` : '검색어를 입력해 주세요'}
            />
        );
    }

    return (
        <section className="journal-list" aria-label="검색 결과">
            <p className="results-count">
                {journals.length}개의 저널을 발견했습니다
            </p>
            <div className="journals-grid">
                {journals.map(journal => (
                    <JournalCard key={journal.id} journal={journal} />
                ))}
            </div>
        </section>
    );
}
