import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Building, Briefcase } from 'lucide-react';
import Hero from '../components/Hero';
import JobCard from '../components/JobCard';
import CategoryCard from '../components/CategoryCard';
import { jobService } from '../services/jobService';
import { JOB_CATEGORIES } from '../utils/constants';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs({ featured: 'true' });
        if (res.data && res.data.length > 0) {
          setFeaturedJobs(res.data.slice(0, 6));
        } else {
          const allRes = await jobService.getJobs({});
          setFeaturedJobs((allRes.data || []).slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Featured Jobs Section */}
      <section className="py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                <Sparkles size={14} />
                <span>Handpicked for you</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brandtext tracking-tight">Featured Jobs</h2>
            </div>
            <Link to="/jobs" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-all hover:translate-x-0.5">
              <span>See all</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl border border-brandborder flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs text-brandmuted font-medium">Loading featured opportunities...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-brandborder flex flex-col items-center gap-3">
              <Briefcase size={36} className="text-brandmuted" />
              <h3 className="font-bold text-base text-brandtext">No jobs posted yet</h3>
              <p className="text-xs text-brandmuted">Be the first to list an opportunity on the board.</p>
              <Link to="/employer/post-job" className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-brand">
                Post a Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} layout="grid" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Browse By Category Section */}
      <section className="py-16 bg-[#fafbfd] border-y border-brandborder" id="categories">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full inline-block mb-2.5">
              Explore Disciplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brandtext tracking-tight">Browse by Category</h2>
            <p className="text-sm text-brandmuted leading-relaxed mt-2">
              Explore open roles sorted by career pathways and find the best match for your talent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {JOB_CATEGORIES.filter((c) => c !== 'Other').map((category) => (
              <CategoryCard
                key={category}
                name={category}
                count={
                  category === 'Development'
                    ? 850
                    : category === 'Design'
                    ? 420
                    : category === 'Marketing'
                    ? 310
                    : category === 'Sales'
                    ? 190
                    : category === 'Finance'
                    ? 140
                    : 230
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Employer CTA Banner */}
      <section className="py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-[#0f2b48] to-[#173b64] rounded-2xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-xl text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 block">For Employers</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-3">
                Hire Top 1% Verified Tech Talent Today
              </h2>
              <p className="text-sm sm:text-base text-[#c0d1e5] leading-relaxed max-w-xl mb-6">
                Post your openings to thousands of qualified candidates. Receive tailored resumes and manage applicants effortlessly.
              </p>
              <div className="flex items-center gap-3.5 flex-wrap justify-center md:justify-start">
                <Link to="/employer/post-job" className="bg-success hover:bg-success-dark text-white px-6 py-3 rounded-brand font-semibold text-sm shadow-md transition-all hover:-translate-y-0.5">
                  Post a Job Now
                </Link>
                <Link to="/contact" className="border border-white/40 hover:border-white hover:bg-white/10 text-white px-6 py-3 rounded-brand font-semibold text-sm transition-all">
                  Learn About Pricing
                </Link>
              </div>
            </div>
            <div className="shrink-0 hidden lg:block">
              <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Building size={52} className="text-sky-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
