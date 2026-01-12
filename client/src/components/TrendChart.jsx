import './TrendChart.css';

export default function TrendChart({ trends }) {
    if (!trends || trends.length === 0) {
        return <p className="no-trends">최근 트렌드 데이터가 없습니다</p>;
    }

    const maxFrequency = Math.max(...trends.map(t => t.frequency));

    return (
        <div className="trend-chart" role="list" aria-label="연구 트렌드">
            {trends.map((trend, index) => (
                <div key={index} className="trend-item" role="listitem">
                    <div className="trend-header">
                        <span className="trend-name">{trend.name}</span>
                        <span className="trend-name-en">{trend.nameEn}</span>
                    </div>
                    <div className="trend-bar-wrapper">
                        <div
                            className="trend-bar"
                            style={{ width: `${(trend.frequency / maxFrequency) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={trend.frequency}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        />
                        <span className="trend-frequency">{trend.frequency}%</span>
                    </div>
                    <span className={`trend-growth ${trend.growth >= 0 ? 'positive' : 'negative'}`}>
                        {trend.growth >= 0 ? '↑' : '↓'} {Math.abs(trend.growth)}%
                    </span>
                </div>
            ))}
        </div>
    );
}
