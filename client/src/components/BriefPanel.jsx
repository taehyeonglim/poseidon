import './BriefPanel.css';

export default function BriefPanel({ brief }) {
    if (!brief) return null;

    const formattedDate = new Date(brief.generatedAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <article className="brief-panel">
            <div className="brief-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(brief.brief) }} />
            <footer className="brief-footer">
                <span className="brief-timestamp">생성 시각: {formattedDate}</span>
            </footer>
        </article>
    );
}

// Simple markdown formatter (headings, bold, lists)
function formatMarkdown(text) {
    return text
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])/gm, '<p>')
        .replace(/(?<![>])$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[hul])/g, '$1')
        .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
}
