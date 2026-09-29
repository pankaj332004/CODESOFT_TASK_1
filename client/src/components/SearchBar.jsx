import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Grid, ArrowRight } from 'lucide-react';
import { JOB_CATEGORIES } from '../utils/constants';

const SearchBar = ({ initialValues = {}, onSearch, compact = false }) => {
  const [keyword, setKeyword] = useState(initialValues.search || '');
  const [location, setLocation] = useState(initialValues.location || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search: keyword, location, category });
    } else {
      const queryParams = new URLSearchParams();
      if (keyword.trim()) queryParams.set('search', keyword.trim());
      if (location.trim()) queryParams.set('location', location.trim());
      if (category) queryParams.set('category', category);
      navigate(`/jobs?${queryParams.toString()}`);
    }
  };

  return (
    <form
      className={`bg-white rounded-xl shadow-lg border border-brandborder/80 flex flex-col md:flex-row items-center w-full transition-all ${
        compact ? 'p-1.5 shadow-sm' : 'p-2.5 gap-2'
      }`}
      onSubmit={handleSubmit}
    >
      {/* Keyword Field */}
      <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-2 border md:border-none border-brandborder rounded-brand">
        <Search className="text-primary shrink-0" size={19} />
        <input
          type="text"
          placeholder="Job title, keyword, or company..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border-none p-0 focus:ring-0 text-sm w-full bg-transparent placeholder-brandmuted"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-brandborder" />

      {/* Location Field */}
      <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-2 border md:border-none border-brandborder rounded-brand">
        <MapPin className="text-primary shrink-0" size={19} />
        <input
          type="text"
          placeholder="Location (e.g. Remote, NY)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-none p-0 focus:ring-0 text-sm w-full bg-transparent placeholder-brandmuted"
        />
      </div>

      <div className="hidden md:block w-px h-8 bg-brandborder" />

      {/* Category Field */}
      <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-2 border md:border-none border-brandborder rounded-brand">
        <Grid className="text-primary shrink-0" size={19} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border-none p-0 focus:ring-0 text-sm w-full bg-transparent text-brandtext cursor-pointer"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-success hover:bg-success-dark text-white px-6 py-3 rounded-brand font-semibold text-sm flex items-center justify-center gap-2 shrink-0 shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5"
      >
        <span>Find Job</span>
        <ArrowRight size={17} />
      </button>
    </form>
  );
};

export default SearchBar;
