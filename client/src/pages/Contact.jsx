import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="flex flex-col text-left">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0e2947] to-primary-dark text-white pt-14 pb-16 px-4 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Get In Touch</h1>
          <p className="text-sm sm:text-base text-sky-200 max-w-xl mx-auto">
            Have questions or need enterprise hiring support? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -mt-8 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary transition-all">
              <div className="w-12 h-12 rounded-brand bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <span className="text-xs text-brandmuted font-semibold block">Email Support</span>
                <strong className="text-sm font-bold text-brandtext">support@jobboard.com</strong>
              </div>
            </div>

            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary transition-all">
              <div className="w-12 h-12 rounded-brand bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <span className="text-xs text-brandmuted font-semibold block">Phone Support</span>
                <strong className="text-sm font-bold text-brandtext">+01 9876543210</strong>
              </div>
            </div>

            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary transition-all">
              <div className="w-12 h-12 rounded-brand bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <span className="text-xs text-brandmuted font-semibold block">Headquarters</span>
                <strong className="text-sm font-bold text-brandtext">New York, NY, USA</strong>
              </div>
            </div>

            <div className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 shadow-sm hover:border-primary transition-all">
              <div className="w-12 h-12 rounded-brand bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <span className="text-xs text-brandmuted font-semibold block">Working Hours</span>
                <strong className="text-sm font-bold text-brandtext">Mon - Fri: 9:00 AM - 6:00 PM</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-brandborder rounded-2xl p-6 sm:p-8 shadow-card">
              <h3 className="text-xl font-extrabold text-brandtext mb-1">Send Us a Message</h3>
              <p className="text-xs text-brandmuted mb-6">
                Our support team typically responds within 2-4 business hours.
              </p>

              {submitted ? (
                <div className="bg-success-light border border-emerald-200 p-6 rounded-brand flex items-center gap-4 text-emerald-900">
                  <CheckCircle size={32} className="text-success shrink-0" />
                  <div>
                    <h4 className="font-bold text-base mb-1">Message Dispatched!</h4>
                    <p className="text-xs">Thank you for reaching out. We will get back to you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Your Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="px-3.5 py-2 text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Your Email *</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="px-3.5 py-2 text-xs"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brandtext">Message *</label>
                    <textarea
                      rows={5}
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="px-3.5 py-2 text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-success hover:bg-success-dark text-white font-semibold text-xs py-3 rounded-brand shadow-sm shadow-success/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 mt-2"
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
