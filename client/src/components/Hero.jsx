import React from 'react';
import { Briefcase, Building2, Users, CheckCircle, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#eef7fe] to-[#f6f9fc] pt-12 pb-14 border-b border-brandborder overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary-dark border border-primary/20 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles size={14} className="text-primary" />
              <span>4536+ Jobs listed across 40+ countries</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-brandtext leading-[1.15] tracking-tight mb-4">
              Find your <span className="text-primary relative inline-block">Dream Job</span>
            </h1>

            <p className="text-base sm:text-lg text-brandtext-light leading-relaxed mb-6 max-w-xl">
              Discover verified roles at high-growth startups and global tech giants.
              Fast applications, transparent salaries, and direct employer hiring.
            </p>

            {/* Embedded SearchBar */}
            <div className="w-full mb-4">
              <SearchBar />
            </div>

            {/* Popular search tags */}
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
              <span className="text-brandmuted font-semibold">Popular Searches:</span>
              <a href="/jobs?search=React" className="bg-white border border-brandborder px-2.5 py-1 rounded hover:bg-primary-light hover:text-primary hover:border-primary transition-all">React</a>
              <a href="/jobs?search=Frontend" className="bg-white border border-brandborder px-2.5 py-1 rounded hover:bg-primary-light hover:text-primary hover:border-primary transition-all">Frontend</a>
              <a href="/jobs?search=Backend" className="bg-white border border-brandborder px-2.5 py-1 rounded hover:bg-primary-light hover:text-primary hover:border-primary transition-all">Backend</a>
              <a href="/jobs?type=Remote" className="bg-white border border-brandborder px-2.5 py-1 rounded hover:bg-primary-light hover:text-primary hover:border-primary transition-all">Remote</a>
              <a href="/jobs?category=Design" className="bg-white border border-brandborder px-2.5 py-1 rounded hover:bg-primary-light hover:text-primary hover:border-primary transition-all">UI/UX</a>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-brandborder w-full max-w-md">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-brandborder">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2 py-0.5 rounded">
                  Live Opportunities
                </span>
              </div>

              <div className="flex gap-3.5 p-4 bg-slate-50 border border-brandborder rounded-brand mb-4">
                <div className="w-12 h-12 bg-white border border-brandborder rounded-brand flex items-center justify-center font-extrabold text-blue-600 text-xl shrink-0">
                  G
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-sm text-brandtext mb-0.5">Senior Frontend Engineer</h4>
                  <p className="text-xs text-brandmuted mb-2">Google • Mountain View, CA</p>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold bg-primary-light text-primary px-2 py-0.5 rounded-full">Full Time</span>
                    <span className="text-[11px] font-semibold bg-success-light text-success-dark px-2 py-0.5 rounded-full">$130k - $160k</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-brand text-left">
                <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-xs text-emerald-900 block font-bold">Over 95% response rate</strong>
                  <p className="text-[11px] text-emerald-700">Applications reviewed in under 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counters Ribbon */}
        <div className="bg-white border border-brandborder rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="flex items-center gap-3.5 sm:border-r border-brandborder last:border-none">
              <div className="w-11 h-11 rounded-brand bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-brandtext leading-none">4,536+</h3>
                <p className="text-xs text-brandmuted font-medium mt-1">Jobs Listed</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 md:border-r border-brandborder last:border-none">
              <div className="w-11 h-11 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-brandtext leading-none">1,200+</h3>
                <p className="text-xs text-brandmuted font-medium mt-1">Verified Companies</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 sm:border-r border-brandborder last:border-none">
              <div className="w-11 h-11 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-brandtext leading-none">3,000+</h3>
                <p className="text-xs text-brandmuted font-medium mt-1">Active Candidates</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-brand bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-brandtext leading-none">500+</h3>
                <p className="text-xs text-brandmuted font-medium mt-1">Successful Hirings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
