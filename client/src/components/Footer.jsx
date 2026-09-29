import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0d1e32] text-[#c5d3e8] mt-auto border-t border-[#1a2f4c]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-14 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand Info */}
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-white mb-1">
            <div className="w-8 h-8 bg-primary rounded-brand flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span>Job Board</span>
          </Link>
          <p className="text-sm leading-relaxed text-[#94a9c9] max-w-xs">
            Empowering developers, designers, and tech leaders to connect with
            the most innovative global companies.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2.5 text-xs text-[#94a9c9]">
              <Mail size={14} className="text-primary" />
              <span>support@jobboard.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#94a9c9]">
              <Phone size={14} className="text-primary" />
              <span>+01 9876543210</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#94a9c9]">
              <MapPin size={14} className="text-primary" />
              <span>New York, NY, USA</span>
            </div>
          </div>
        </div>

        {/* Col 2: For Candidates */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">For Candidates</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-[#94a9c9]">
            <li>
              <Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link>
            </li>
            <li>
              <Link to="/jobs?category=Development" className="hover:text-white transition-colors">Tech & Engineering</Link>
            </li>
            <li>
              <Link to="/jobs?category=Design" className="hover:text-white transition-colors">Design & Creative</Link>
            </li>
            <li>
              <Link to="/candidate" className="hover:text-white transition-colors">Candidate Dashboard</Link>
            </li>
            <li>
              <Link to="/candidate/profile" className="hover:text-white transition-colors">Upload Resume</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: For Employers */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">For Employers</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-[#94a9c9]">
            <li>
              <Link to="/employer/post-job" className="hover:text-white transition-colors">Post a Job</Link>
            </li>
            <li>
              <Link to="/employer" className="hover:text-white transition-colors">Employer Dashboard</Link>
            </li>
            <li>
              <Link to="/employer" className="hover:text-white transition-colors">Manage Applications</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">Hiring Solutions</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">Pricing Plans</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-[#94a9c9]">
            <li>
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-white transition-colors">All Listings</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1a2f4c] py-5 text-xs text-[#728aa8]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Job Board Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            Built with React, Node & Tailwind CSS <Heart size={13} className="text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
