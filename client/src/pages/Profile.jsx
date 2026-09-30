import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Camera,
  UploadCloud,
  Trash2,
  FileText,
  Download,
  Loader2,
  Lock,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

const Profile = () => {
  const { user, updateProfile, uploadAvatar, uploadResume, isEmployer } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');

  // Personal Info Form State
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

  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  // Resume upload state
  const [resumeUploading, setResumeUploading] = useState(false);
  const resumeInputRef = useRef(null);

  // Password / Security Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

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
      setAvatarPreview(user.profileImage || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Handle Photo File Upload
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/i)) {
      setError('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Profile photo must be smaller than 5MB.');
      return;
    }

    setError(null);
    setAvatarUploading(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const res = await uploadAvatar(file);
      if (res?.profileImage) {
        setFormData((prev) => ({ ...prev, profileImage: res.profileImage }));
        setAvatarPreview(res.profileImage);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setError(err.response?.data?.message || 'Failed to upload photo. Please try again.');
      setAvatarPreview(user?.profileImage || null);
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Handle Remove Photo
  const handleRemoveAvatar = async () => {
    setAvatarUploading(true);
    setError(null);
    try {
      await updateProfile({ profileImage: '' });
      setAvatarPreview(null);
      setFormData((prev) => ({ ...prev, profileImage: '' }));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError('Failed to remove photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Handle Resume File Upload
  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Please upload a valid PDF, DOC, or DOCX document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file must be under 10MB.');
      return;
    }

    setError(null);
    setResumeUploading(true);

    try {
      const res = await uploadResume(file);
      if (res?.resume) {
        setFormData((prev) => ({ ...prev, resume: res.resume }));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Resume upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setResumeUploading(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  // Handle Personal Info Submit
  const handleProfileSubmit = async (e) => {
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

  // Handle Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!passwordData.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await userService.updatePassword(passwordData);
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || 'Failed to update password. Please check your current password.'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-brandtext leading-tight">Profile Settings</h1>
        <p className="text-xs text-brandmuted mt-0.5">
          Manage your personal profile, credentials, and account security
        </p>
      </div>

      <div className="bg-white border border-brandborder rounded-xl shadow-sm overflow-hidden">
        {/* Settings Sub-Tabs */}
        <div className="flex border-b border-brandborder bg-slate-50 px-4 gap-2">
          <button
            type="button"
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
            type="button"
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
            type="button"
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

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
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

            {/* Profile Photo Uploader Card */}
            <div className="bg-slate-50 border border-brandborder rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-light to-blue-200 border-3 border-white shadow-md overflow-hidden flex items-center justify-center text-primary font-black text-2xl">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={formData.name || 'Avatar'}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarPreview(null)}
                    />
                  ) : (
                    <span>{formData.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left flex-1">
                <div>
                  <h3 className="text-sm font-bold text-brandtext">Profile Picture</h3>
                  <p className="text-[11px] text-brandmuted mt-0.5">
                    Upload a photo directly from your device (JPG, PNG, WEBP, max 5MB).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-brand text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Camera size={14} />
                    <span>{avatarUploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </button>

                  {(avatarPreview || formData.profileImage) && (
                    <button
                      type="button"
                      disabled={avatarUploading}
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-brand text-xs font-semibold transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details Form Fields */}
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

            <div className="pt-4 border-t border-brandborder flex items-center justify-between">
              <button
                type="submit"
                disabled={saving || avatarUploading}
                className="px-8 py-2.5 bg-success hover:bg-success-dark text-white font-semibold text-xs rounded-brand shadow-sm shadow-success/30 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: RESUME / PORTFOLIO */}
        {activeTab === 'resume' && (
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {savedSuccess && (
              <div className="bg-success-light border border-emerald-200 text-success-dark px-4 py-2.5 rounded-brand text-xs flex items-center gap-2 font-semibold">
                <CheckCircle size={16} />
                <span>Resume updated successfully!</span>
              </div>
            )}

            {error && (
              <div className="bg-danger-light border border-red-200 text-danger px-4 py-2.5 rounded-brand text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-bold text-brandtext">Default Resume</h3>
              <p className="text-xs text-brandmuted mt-0.5">
                Your default resume is automatically attached when submitting 1-click applications.
              </p>
            </div>

            {/* Current Resume Banner */}
            {formData.resume ? (
              <div className="bg-slate-50 border border-brandborder rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-brandtext truncate">
                      {formData.resume.split('/').pop()}
                    </span>
                    <span className="text-[11px] text-brandmuted">Active Default Resume</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-brandborder hover:bg-slate-50 text-brandtext rounded-brand text-xs font-semibold transition-colors"
                  >
                    <Download size={13} />
                    <span>View</span>
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      setFormData((prev) => ({ ...prev, resume: '' }));
                      await updateProfile({ resume: '' });
                    }}
                    className="p-1.5 text-brandmuted hover:text-red-600 transition-colors"
                    title="Remove default resume"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : null}

            {/* Upload Dropzone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-primary rounded-xl p-8 bg-slate-50 hover:bg-primary-light/30 transition-all text-center">
              <input
                type="file"
                ref={resumeInputRef}
                id="profile-resume-file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeFileChange}
              />
              <label htmlFor="profile-resume-file" className="flex flex-col items-center gap-2.5 cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                  {resumeUploading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <UploadCloud size={24} />
                  )}
                </div>
                <span className="text-xs text-brandtext-light leading-snug">
                  {resumeUploading ? (
                    <strong className="text-primary">Uploading your resume...</strong>
                  ) : (
                    <>
                      Drag & drop your new resume here or{' '}
                      <span className="text-primary font-bold underline">click to upload</span>
                    </>
                  )}
                </span>
                <span className="text-[11px] text-brandmuted">PDF, DOC, DOCX (Max 10MB)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-3 border-b border-brandborder">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-brandtext">Change Password</h3>
                <p className="text-xs text-brandmuted mt-0.5">
                  Ensure your account uses a secure password of at least 6 characters.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="bg-success-light border border-emerald-200 text-success-dark px-4 py-2.5 rounded-brand text-xs flex items-center gap-2 font-semibold">
                <CheckCircle size={16} />
                <span>Password updated successfully! You can now log in with your new password.</span>
              </div>
            )}

            {passwordError && (
              <div className="bg-danger-light border border-red-200 text-danger px-4 py-2.5 rounded-brand text-xs flex items-center gap-2 font-medium">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="flex flex-col gap-4 max-w-lg">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext flex items-center gap-1.5">
                  <KeyRound size={13} className="text-brandmuted" />
                  <span>Current Password *</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="px-3.5 py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext flex items-center gap-1.5">
                  <Lock size={13} className="text-brandmuted" />
                  <span>New Password (min 6 chars) *</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="px-3.5 py-2 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-brandtext flex items-center gap-1.5">
                  <Lock size={13} className="text-brandmuted" />
                  <span>Confirm New Password *</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="px-3.5 py-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-brandborder flex items-center justify-between">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold text-xs rounded-brand shadow-sm shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {passwordSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
