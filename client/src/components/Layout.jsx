import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children }) {
    const location = useLocation();

    const getBreadcrumb = () => {
        const path = location.pathname;
        if (path === '/') return '항구';
        if (path === '/search') return '항구 → 나침반';
        if (path.startsWith('/journal/')) return '항구 → 나침반 → 항해일지';
        if (path.startsWith('/brief/')) return '항구 → 나침반 → 항해일지 → 브리핑실';
        return '';
    };

    return (
        <div className="layout">
            <header className="header">
                <Link to="/" className="logo">
                    <span className="logo-icon">⚓</span>
                    <span className="logo-text">POSEIDON</span>
                    <span className="logo-subtitle">학술 항해사</span>
                </Link>
                <nav className="breadcrumb" aria-label="현재 위치">
                    {getBreadcrumb()}
                </nav>
            </header>

            <main className="main">
                {children}
            </main>

            <footer className="footer">
                <p>POSEIDON MVP © 2026 — 해양 연구자를 위한 학술지 탐색 시스템</p>
            </footer>
        </div>
    );
}
