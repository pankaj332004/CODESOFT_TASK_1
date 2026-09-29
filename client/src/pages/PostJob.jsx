import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { JOB_CATEGORIES, JOB_TYPES, EXPERIENCE_LEVELS } from '../utils/constants';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.companyName || 'TechCorp',
    companyLogo: '',
    location: 'Remote',
    category: 'Development',
    type: 'Full Time',
    salaryMin: 80000,
    salaryMax: 120000,
    experience: '1-3 years',
    description: '',
    responsibilities: '',
    requirements: '',
    featured: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.company || !formData.description) {
      setError('Please fill in all required fields (Title, Company, Description).');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        companyLogo: formData.companyLogo,
        location: formData.location,
        category: formData.category,
        type: formData.type,
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
          currency: '$',
          period: 'yr',
        },
        experience: formData.experience,
        description: formData.description,
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split('\n').filter(Boolean)
          : [],
        requirements: formData.requirements
          ? formData.requirements.split('\n').filter(Boolean)
          : [],
        featured: formData.featured,
      };

      const res = await jobService.createJob(payload);
      navigate(`/jobs/${res.data?._id || ''}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to post job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-brandbg text-left">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        <div className="bg-white border border-brandborder rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="pb-4 mb-6 border-b border-brandborder">
            <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Post a New Job</h1>
            <p className="text-xs text-brandmuted mt-0.5">
              Reach thousands of active developers, designers, and tech professionals
            </p>
          </div>

          {error && (
            <div className="bg-danger-light border border-red-200 text-danger p-3 rounded-brand text-xs flex items-center gap-2 mb-5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Company Logo URL</label>
                <input
                  type="url"
                  name="companyLogo"
                  placeholder="https://example.com/logo.svg"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Job Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="px-3.5 py-2 text-xs">
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Remote or San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Salary Range (Min - Max $ / year)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="salaryMin"
                    placeholder="Min (e.g. 80000)"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-xs"
                  />
                  <span className="text-brandmuted font-bold">-</span>
                  <input
                    type="number"
                    name="salaryMax"
                    placeholder="Max (e.g. 120000)"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                >
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Job Description *</label>
              <textarea
                name="description"
                rows={5}
                placeholder="Enter detailed job overview and expectations..."
                value={formData.description}
                onChange={handleChange}
                className="px-3.5 py-2 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Responsibilities (one item per line)</label>
              <textarea
                name="responsibilities"
                rows={4}
                placeholder="• Build reusable components in React&#10;• Optimize client side performance&#10;• Collaborate with design team"
                value={formData.responsibilities}
                onChange={handleChange}
                className="px-3.5 py-2 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-brandtext">Requirements (one item per line)</label>
              <textarea
                name="requirements"
                rows={4}
                placeholder="• 3+ years experience with React and TypeScript&#10;• Strong understanding of REST APIs&#10;• Excellent problem-solving skills"
                value={formData.requirements}
                onChange={handleChange}
                className="px-3.5 py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-brandtext font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-brandborder"
                />
                <span>Feature this job on the home page and top of search results</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-success hover:bg-success-dark text-white font-semibold text-sm py-3 rounded-brand shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5 mt-3"
            >
              {loading ? 'Publishing Opportunity...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
