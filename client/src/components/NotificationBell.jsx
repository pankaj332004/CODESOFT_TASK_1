import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Calendar,
  Briefcase,
  FileCheck,
  BellRing,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, latestToast, dismissToast } =
    useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'status':
        return <FileCheck className="w-4 h-4 text-purple-600" />;
      case 'alert':
        return <BellRing className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markAsRead(notif._id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-red-500 rounded-full animate-pulse shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Real-time Floating Toast Alert Banner */}
      {latestToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white border border-blue-200 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg shrink-0">
              {getNotificationIcon(latestToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">
                {latestToast.title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                {latestToast.message}
              </p>
              {latestToast.link && (
                <button
                  onClick={() => {
                    dismissToast();
                    navigate(latestToast.link);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium mt-1 inline-flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  You'll be alerted when applications update, jobs match, or interviews are scheduled.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !notif.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      !notif.read ? 'bg-blue-100/70' : 'bg-slate-100'
                    }`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs font-semibold truncate ${
                          !notif.read ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
            <span className="text-[11px] text-slate-500">
              Real-time updates powered by Socket.IO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
