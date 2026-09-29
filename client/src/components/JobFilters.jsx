import React from 'react';
import { Search, MapPin, RotateCcw } from 'lucide-react';
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
} from '../utils/constants';

const JobFilters = ({ filters, onChange, onClear }) => {
  const handleTextChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleCheckboxChange = (field, item) => {
    const current = filters[field] ? filters[field].split(',').filter(Boolean) : [];
    let updated;
    if (current.includes(item)) {
      updated = current.filter((x) => x !== item);
    } else {
      updated = [...current, item];
    }
    onChange({ ...filters, [field]: updated.join(',') });
  };

  const isChecked = (field, item) => {
    if (!filters[field]) return false;
    const list = filters[field].split(',');
    return list.includes(item);
  };

  return (
    <aside className="bg-white border border-brandborder rounded-xl p-5 flex flex-col gap-5 sticky top-24 shadow-sm text-left">
      <div className="flex items-center justify-between pb-3 border-b border-brandborder">
        <h3 className="font-bold text-sm text-brandtext">Filter Jobs</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-semibold text-brandmuted hover:text-danger transition-colors"
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Keyword Search */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-brandtext">Search Jobs</label>
        <div className="flex items-center gap-2 border border-brandborder rounded-brand px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search size={15} className="text-brandmuted shrink-0" />
          <input
            type="text"
            placeholder="Search keyword"
            value={filters.search || ''}
            onChange={(e) => handleTextChange('search', e.target.value)}
            className="border-none p-0 focus:ring-0 text-xs w-full bg-transparent"
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-brandtext">Location</label>
        <div className="flex items-center gap-2 border border-brandborder rounded-brand px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <MapPin size={15} className="text-brandmuted shrink-0" />
          <input
            type="text"
            placeholder="Select Location"
            value={filters.location || ''}
            onChange={(e) => handleTextChange('location', e.target.value)}
            className="border-none p-0 focus:ring-0 text-xs w-full bg-transparent"
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-brandtext">Job Type</label>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 text-xs text-brandtext-light cursor-pointer hover:text-primary transition-colors">
              <input
                type="checkbox"
                checked={isChecked('type', type)}
                onChange={() => handleCheckboxChange('type', type)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-brandborder"
              />
              <span className={isChecked('type', type) ? 'font-semibold text-brandtext' : ''}>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-brandtext">Category</label>
        <div className="flex flex-col gap-2">
          {JOB_CATEGORIES.filter((c) => c !== 'Other').map((category) => (
            <label key={category} className="flex items-center gap-2.5 text-xs text-brandtext-light cursor-pointer hover:text-primary transition-colors">
              <input
                type="checkbox"
                checked={isChecked('category', category)}
                onChange={() => handleCheckboxChange('category', category)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-brandborder"
              />
              <span className={isChecked('category', category) ? 'font-semibold text-brandtext' : ''}>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-brandtext">Experience</label>
        <div className="flex flex-col gap-2">
          {EXPERIENCE_LEVELS.map((exp) => (
            <label key={exp} className="flex items-center gap-2.5 text-xs text-brandtext-light cursor-pointer hover:text-primary transition-colors">
              <input
                type="checkbox"
                checked={isChecked('experience', exp)}
                onChange={() => handleCheckboxChange('experience', exp)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-brandborder"
              />
              <span className={isChecked('experience', exp) ? 'font-semibold text-brandtext' : ''}>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-full bg-slate-100 hover:bg-slate-200 text-brandtext-light font-semibold text-xs py-2.5 rounded-brand transition-colors mt-2"
      >
        Clear All Filters
      </button>
    </aside>
  );
};

export default JobFilters;
