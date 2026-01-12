import { useState } from 'react';
import './ExportButton.css';

export default function ExportButton({ text, filename = 'brief.txt' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="export-buttons">
            <button
                className={`export-button copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                aria-label="클립보드에 복사"
            >
                {copied ? '✓ 복사됨' : '📋 복사'}
            </button>
            <button
                className="export-button download"
                onClick={handleDownload}
                aria-label="파일로 다운로드"
            >
                📥 다운로드
            </button>
        </div>
    );
}
