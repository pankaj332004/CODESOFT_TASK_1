export const formatSalary = (salary) => {
  if (!salary) return 'Negotiable';
  const min = salary.min ? `$${Math.round(salary.min / 1000)}k` : '';
  const max = salary.max ? `$${Math.round(salary.max / 1000)}k` : '';

  if (min && max) return `${min} - ${max}`;
  if (min) return `From ${min}`;
  if (max) return `Up to ${max}`;
  return 'Competitive';
};

export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)} yr ago`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'applied':
      return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'shortlisted':
      return 'bg-purple-100 text-purple-700 border border-purple-200';
    case 'under review':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'interview':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'hired':
    case 'offer':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'rejected':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};
