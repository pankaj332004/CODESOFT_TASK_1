import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Briefcase, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { companyService } from '../services/companyService';
import CompanyLogo from '../components/CompanyLogo';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companyService.getCompanies();
        setCompanies(res.data || []);
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Sales', 'Finance', 'Management'];

  const filteredCompanies = companies.filter((comp) => {
    const matchSearch =
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.bio.toLowerCase().includes(search.toLowerCase()) ||
      comp.location.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategory === 'All' || comp.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  return (
    <div className="py-10 bg-brandbg text-left min-h-screen">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#0e2947] to-primary-dark text-white rounded-2xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400 mb-2 block">
              Top Employers
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-2">
              Explore Top Tech Companies Hiring Today
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Discover verified companies, review engineering culture, and find your next career chapter.
            </p>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl flex items-center gap-2">
            <Search size={18} className="text-sky-300 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Search companies, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder:text-sky-200 text-xs w-full outline-none py-1.5"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brandborder">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-brandtext hover:bg-slate-100 border border-brandborder'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Company Cards Grid */}
        {loading ? (
          <div className="bg-white border border-brandborder rounded-xl p-16 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            <p className="text-xs text-brandmuted font-medium">Loading verified company profiles...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bg-white border border-brandborder rounded-xl p-16 text-center flex flex-col items-center gap-2 shadow-sm">
            <Building size={40} className="text-brandmuted" />
            <h3 className="font-bold text-base text-brandtext">No companies matched your query</h3>
            <p className="text-xs text-brandmuted">Try clearing your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((comp) => (
              <div
                key={comp.name}
                className="bg-white border border-brandborder rounded-xl p-6 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-brand border border-brandborder bg-slate-50 flex items-center justify-center p-2 overflow-hidden shrink-0">
                    <CompanyLogo company={comp.name} logo={comp.logo} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link to={`/companies/${encodeURIComponent(comp.name)}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-base text-brandtext truncate leading-snug">{comp.name}</h3>
                    </Link>
                    <span className="text-xs text-brandmuted flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-brandmuted" />
                      {comp.location}
                    </span>
                  </div>

                  <span className="bg-primary-light text-primary text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {comp.activeJobsCount} Openings
                  </span>
                </div>

                <p className="text-xs text-brandtext-light leading-relaxed line-clamp-3 mb-5 flex-1">
                  {comp.bio}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brandmuted hover:text-primary flex items-center gap-1 font-medium transition-colors"
                  >
                    <span>Website</span>
                    <ExternalLink size={12} />
                  </a>

                  <Link
                    to={`/companies/${encodeURIComponent(comp.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-all"
                  >
                    <span>View Profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
