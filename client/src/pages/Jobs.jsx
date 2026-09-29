import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { jobService } from '../services/jobService';
import { SlidersHorizontal, ArrowUpDown, Briefcase } from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
    sort: searchParams.get('sort') || 'latest',
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || '',
      type: searchParams.get('type') || '',
      experience: searchParams.get('experience') || '',
    }));
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = {};
      if (filters.search) query.search = filters.search;
      if (filters.location) query.location = filters.location;
      if (filters.category) query.category = filters.category;
      if (filters.type) query.type = filters.type;
      if (filters.experience) query.experience = filters.experience;
      if (filters.sort) query.sort = filters.sort;

      const res = await jobService.getJobs(query);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    const cleared = {
      search: '',
      location: '',
      category: '',
      type: '',
      experience: '',
      sort: 'latest',
    };
    setFilters(cleared);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="py-10 bg-brandbg">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Mobile filter toggle bar */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 bg-white border border-brandborder px-3.5 py-2 rounded-brand text-xs font-semibold text-brandtext"
          >
            <SlidersHorizontal size={15} />
            <span>Filter Criteria</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filters */}
          <div className={`md:col-span-4 lg:col-span-3 ${mobileFilterOpen ? 'block mb-6' : 'hidden md:block'}`}>
            <JobFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Right Column: Listings Header & Cards */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-brandborder gap-4">
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brandtext leading-tight">
                  Showing {jobs.length} jobs
                </h2>
                <p className="text-xs text-brandmuted mt-0.5">Explore verified openings tailored to your preferences</p>
              </div>

              <div className="flex items-center gap-2 bg-white border border-brandborder px-3 py-1.5 rounded-brand text-xs shrink-0 self-start sm:self-auto">
                <ArrowUpDown size={14} className="text-primary" />
                <span className="text-brandmuted font-medium">Sort by:</span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, sort: e.target.value })
                  }
                  className="border-none p-0 focus:ring-0 text-xs font-bold text-brandtext bg-transparent cursor-pointer"
                >
                  <option value="latest">Latest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-xl border border-brandborder flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <p className="text-xs text-brandmuted font-medium">Loading matching positions...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-brandborder flex flex-col items-center gap-3">
                <Briefcase size={40} className="text-brandmuted" />
                <h3 className="font-bold text-base text-brandtext">No jobs match your criteria</h3>
                <p className="text-xs text-brandmuted">Try clearing or adjusting your search keywords and filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand hover:bg-primary-dark transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} layout="grid" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
