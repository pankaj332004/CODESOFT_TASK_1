import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Headphones } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="py-10 bg-brandbg text-left min-h-screen">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-[#0e2947] to-primary-dark text-white rounded-2xl p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
              <Headphones size={15} />
              <span>Help & Support</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-2.5">
              Get In Touch With Our Team
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-xl">
              Have questions about job postings, candidate applications, or enterprise hiring solutions? We are here to help you succeed.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-xs text-sky-100 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>Average response time: <strong>&lt; 4 hours</strong></span>
          </div>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <a
              href="mailto:support@jobboard.com"
              className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary hover:shadow-card hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-brand bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-brandmuted font-semibold block">Email Support</span>
                <strong className="text-sm font-bold text-brandtext truncate block group-hover:text-primary transition-colors">
                  support@jobboard.com
                </strong>
                <span className="text-[11px] text-brandmuted">Direct response to your inbox</span>
              </div>
            </a>

            <a
              href="tel:+019876543210"
              className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary hover:shadow-card hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-12 h-12 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Phone size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-brandmuted font-semibold block">Phone Support</span>
                <strong className="text-sm font-bold text-brandtext block group-hover:text-emerald-700 transition-colors">
                  +01 9876543210
                </strong>
                <span className="text-[11px] text-brandmuted">Toll-free customer line</span>
              </div>
            </a>

            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-brandmuted font-semibold block">Global Headquarters</span>
                <strong className="text-sm font-bold text-brandtext block">
                  New York, NY, USA
                </strong>
                <span className="text-[11px] text-brandmuted">5th Avenue, Tech District</span>
              </div>
            </div>

            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-brand bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs text-brandmuted font-semibold block">Operating Hours</span>
                <strong className="text-sm font-bold text-brandtext block">
                  Mon - Fri: 9:00 AM – 6:00 PM
                </strong>
                <span className="text-[11px] text-brandmuted">Eastern Standard Time (EST)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-brandborder rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <MessageSquare size={15} />
                <span>Direct Inquiry</span>
              </div>
              <h3 className="text-xl font-extrabold text-brandtext mb-1">Send Us a Message</h3>
              <p className="text-xs text-brandmuted mb-6">
                Fill out the form below and our recruitment support team will reach out to you directly.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-brand flex items-center gap-4 text-emerald-900 animate-in fade-in">
                  <CheckCircle2 size={32} className="text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-base mb-0.5">Message Dispatched Successfully!</h4>
                    <p className="text-xs text-emerald-700">
                      Thank you for contacting us. A confirmation email has been logged and an agent will reply shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brandtext">Your Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="px-3.5 py-2.5 text-xs border border-brandborder rounded-brand outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-brandtext">Your Email *</label>
                      <input
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="px-3.5 py-2.5 text-xs border border-brandborder rounded-brand outline-none focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Inquiry regarding employer posting / application status"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="px-3.5 py-2.5 text-xs border border-brandborder rounded-brand outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Message *</label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you today? Please share details..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="px-3.5 py-2.5 text-xs border border-brandborder rounded-brand outline-none focus:border-primary transition-colors resize-y"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs py-3 rounded-brand shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 mt-2"
                  >
                    <Send size={15} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
