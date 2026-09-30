import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, MapPin, ExternalLink, ArrowLeft, Briefcase, Users, Globe } from 'lucide-react';
import { companyService } from '../services/companyService';
import JobCard from '../components/JobCard';

const CompanyDetails = () => {
  const { name } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await companyService.getCompanyByName(name);
        setCompany(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Company profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [name]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-brandmuted font-medium">Loading company profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
        <Building size={48} className="text-brandmuted mx-auto mb-3" />
        <h2 className="text-xl font-bold text-brandtext mb-2">Company Not Found</h2>
        <p className="text-xs text-brandmuted mb-6">The company profile you are searching for does not exist or has no active listings.</p>
        <Link to="/companies" className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-brand">
          Back to Companies Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-brandbg text-left min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
        <Link to="/companies" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brandmuted hover:text-primary transition-colors">
          <ArrowLeft size={14} />
          <span>Back to All Companies</span>
        </Link>

        {/* Company Header Banner */}
        <div className="bg-white border border-brandborder rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl border border-brandborder bg-slate-50 flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-sm">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <Building size={36} className="text-primary" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brandtext">{company.name}</h1>
                <span className="text-[11px] font-bold bg-primary-light text-primary px-2.5 py-0.5 rounded-full">
                  Verified Employer
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-brandmuted flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-brandmuted" />
                  {company.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase size={13} className="text-brandmuted" />
                  {company.category}
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">
                  {company.activeJobsCount} Active Openings
                </span>
              </div>
            </div>
          </div>

          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 shrink-0"
          >
            <Globe size={14} />
            <span>Visit Company Website</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* About Section */}
        <div className="bg-white border border-brandborder rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-extrabold text-lg text-brandtext mb-3">About {company.name}</h2>
          <p className="text-xs sm:text-sm text-brandtext-light leading-relaxed whitespace-pre-line">
            {company.bio}
          </p>
        </div>

        {/* Open Job Listings */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-brandtext">
              Open Positions at {company.name} ({company.jobs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {company.jobs.map((job) => (
              <JobCard key={job._id} job={job} layout="grid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
