import React from 'react';

export default function FunnelChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No application pipeline data
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count || 0), 1);

  return (
    <div className="space-y-3.5">
      {data.map((item, idx) => {
        const percent = Math.max(6, Math.round(((item.count || 0) / maxCount) * 100));

        return (
          <div key={item.status || idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{item.status}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{item.count}</span>
                <span className="text-[11px] text-slate-400">
                  ({Math.round(((item.count || 0) / maxCount) * 100)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: item.color || '#3b82f6',
                }}
                className="h-full rounded-full transition-all duration-500 ease-out"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
