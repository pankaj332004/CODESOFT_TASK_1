import React, { useState } from 'react';

const PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
];

export default function DonutChart({ data = [], title = 'Distribution', centerLabel = 'Total' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No distribution data available
      </div>
    );
  }

  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* SVG Donut Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const percent = item.count / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const color = PALETTE[idx % PALETTE.length];
            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={item.category || item.label || idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800">
            {hoveredIdx !== null ? data[hoveredIdx].count : total}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            {hoveredIdx !== null ? (data[hoveredIdx].category || data[hoveredIdx].label) : centerLabel}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full max-w-xs space-y-2">
        {data.map((item, idx) => {
          const color = PALETTE[idx % PALETTE.length];
          const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.category || item.label || idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                isHovered ? 'bg-slate-100/80 font-semibold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-700 truncate">{item.category || item.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900">{item.count}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
