import React, { useState } from 'react';

export default function BarChart({ data = [], height = 240 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No trend data available
      </div>
    );
  }

  // Find max value for scaling
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.applications || 0, d.jobs || 0, 1)),
    5
  );

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mb-4 text-xs font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-slate-600">Applications</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-400" />
          <span className="text-slate-600">Jobs Posted</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex items-end justify-between gap-3 pt-6 pb-2" style={{ height }}>
        {/* Horizontal Guide Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="border-b border-slate-300 w-full" />
        </div>

        {data.map((item, idx) => {
          const appHeight = Math.max(4, Math.round(((item.applications || 0) / maxVal) * (height - 40)));
          const jobHeight = Math.max(4, Math.round(((item.jobs || 0) / maxVal) * (height - 40)));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month || idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap animate-in fade-in duration-150">
                  <div className="font-bold text-slate-200">{item.month}</div>
                  <div className="text-blue-400">Apps: {item.applications || 0}</div>
                  <div className="text-indigo-300">Jobs: {item.jobs || 0}</div>
                </div>
              )}

              {/* Grouped Bars */}
              <div className="flex items-end gap-1.5 w-full justify-center">
                {/* Applications Bar */}
                <div
                  style={{ height: `${appHeight}px` }}
                  className={`w-3.5 sm:w-5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 ${
                    isHovered ? 'brightness-110 ring-2 ring-blue-300' : 'opacity-90'
                  }`}
                />
                {/* Jobs Bar */}
                <div
                  style={{ height: `${jobHeight}px` }}
                  className={`w-3.5 sm:w-5 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-md transition-all duration-300 ${
                    isHovered ? 'brightness-110 ring-2 ring-indigo-300' : 'opacity-90'
                  }`}
                />
              </div>

              {/* X-axis Label */}
              <span className="text-[11px] font-medium text-slate-500 mt-2 truncate max-w-full">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
