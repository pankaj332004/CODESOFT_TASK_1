import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile, isEmployer } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    resume: user?.resume || '',
    profileImage: user?.profileImage || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        resume: user.resume || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await updateProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Profile Settings</h1>
        <p className="text-xs text-brandmuted mt-0.5">
          Manage your personal profile, credentials, and contact details
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-success-light border border-emerald-200 text-success-dark px-4 py-2.5 rounded-brand text-xs flex items-center gap-2 font-semibold">
          <CheckCircle size={16} />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-danger-light border border-red-200 text-danger px-4 py-2.5 rounded-brand text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-brandborder rounded-xl shadow-sm overflow-hidden">
        {/* Settings Sub-Tabs */}
        <div className="flex border-b border-brandborder bg-slate-50 px-4 gap-2">
          <button
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'personal'
                ? 'text-primary border-primary bg-white'
                : 'text-brandtext-light border-transparent hover:text-primary'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'resume'
                ? 'text-primary border-primary bg-white'
                : 'text-brandtext-light border-transparent hover:text-primary'
            }`}
            onClick={() => setActiveTab('resume')}
          >
            Resume / Portfolio
          </button>
          <button
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'security'
                ? 'text-primary border-primary bg-white'
                : 'text-brandtext-light border-transparent hover:text-primary'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security & Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 flex flex-col gap-5">
          {activeTab === 'personal' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-3.5 py-2 text-xs"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="px-3.5 py-2 text-xs bg-slate-100 cursor-not-allowed"
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+01 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. New York, USA"
                    value={formData.location}
                    onChange={handleChange}
                    className="px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              {isEmployer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Acme Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="px-3.5 py-2 text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Company Website</label>
                    <input
                      type="url"
                      name="companyWebsite"
                      placeholder="https://acme.com"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Profile Image URL</label>
                <input
                  type="url"
                  name="profileImage"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Professional Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Write a brief professional summary..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Default Resume Filename / Link</label>
                <input
                  type="text"
                  name="resume"
                  placeholder="e.g. resume-john-doe.pdf"
                  value={formData.resume}
                  onChange={handleChange}
                  className="px-3.5 py-2 text-xs"
                />
                <span className="text-[11px] text-brandmuted">
                  Your default resume is automatically attached when submitting 1-click applications.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext">Current Password</label>
                <input type="password" placeholder="••••••••" className="px-3.5 py-2 text-xs" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">New Password</label>
                  <input type="password" placeholder="At least 6 characters" className="px-3.5 py-2 text-xs" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brandtext">Confirm New Password</label>
                  <input type="password" placeholder="Repeat new password" className="px-3.5 py-2 text-xs" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-brandborder">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-success hover:bg-success-dark text-white font-semibold text-xs rounded-brand shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
