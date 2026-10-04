import React from 'react';

/**
 * Small dependency-free SVG bar chart (the project has no chart library, so none was added).
 * props:
 *   labels = ['Jan', 'Feb', ...]
 *   series = [{ name, color, values: [..] }, ...]   (values.length === labels.length)
 */
function GroupedBarChart({ labels, series, height = 240 }) {
    const width = 640;
    const pad = { top: 16, right: 12, bottom: 28, left: 36 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    const rawMax = Math.max(1, ...series.flatMap((s) => s.values));
    // round the top of the axis up to a "nice" number
    const magnitude = 10 ** Math.floor(Math.log10(rawMax));
    const niceMax = Math.ceil(rawMax / magnitude) * magnitude;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));

    const groupW = innerW / Math.max(labels.length, 1);
    const barW = Math.min(22, (groupW * 0.7) / Math.max(series.length, 1));

    return (
        <div>
            <div className="mb-3 flex flex-wrap gap-4">
                {series.map((s) => (
                    <span key={s.name} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                        <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: s.color }} />
                        {s.name}
                    </span>
                ))}
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
                {ticks.map((t) => {
                    const y = pad.top + innerH - (t / niceMax) * innerH;
                    return (
                        <g key={t}>
                            <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#f3f4f6" />
                            <text x={pad.left - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#9ca3af">
                                {t}
                            </text>
                        </g>
                    );
                })}

                {labels.map((label, i) => {
                    const groupX = pad.left + i * groupW + (groupW - barW * series.length) / 2;
                    return (
                        <g key={`${label}-${i}`}>
                            {series.map((s, si) => {
                                const v = s.values[i] || 0;
                                const h = (v / niceMax) * innerH;
                                return (
                                    <rect
                                        key={s.name}
                                        x={groupX + si * barW}
                                        y={pad.top + innerH - h}
                                        width={barW - 2}
                                        height={h}
                                        rx="3"
                                        fill={s.color}
                                    >
                                        <title>{`${label} · ${s.name}: ${v}`}</title>
                                    </rect>
                                );
                            })}
                            <text
                                x={pad.left + i * groupW + groupW / 2}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6b7280"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default GroupedBarChart;
