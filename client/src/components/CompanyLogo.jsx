import React, { useState } from 'react';
import { Building } from 'lucide-react';

const BRAND_ICONS = {
  dribbble: (
    <svg viewBox="0 0 24 24" className="w-full h-full object-contain" fill="none">
      <circle cx="12" cy="12" r="11" fill="#EA4C89" />
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM18.9 7.46C20.21 9.07 20.9 11.08 20.84 13.14C19.78 12.82 17.27 12.18 14.61 12.5C14.51 12.23 14.39 11.96 14.28 11.69C17.48 9.99 18.73 7.69 18.9 7.46ZM12 3.65C14.39 3.65 16.55 4.6 18.15 6.13C18.01 6.32 16.89 8.35 13.9 9.92C12.39 7.15 10.7 4.79 10.45 4.45C10.96 4.3 11.47 4.22 12 3.65ZM8.7 5.17C8.94 5.5 10.59 7.82 12.14 10.51C8.25 11.59 4.62 11.64 4.14 11.64C4.69 8.87 6.47 6.55 8.7 5.17ZM3.65 12.98C4.1 12.98 7.37 12.92 11.16 11.91C11.33 12.34 11.49 12.78 11.64 13.22C7.38 14.53 4.8 18.59 4.63 18.88C4.02 17.84 3.66 16.63 3.65 15.35V12.98ZM12 20.35C9.97 20.35 8.11 19.67 6.61 18.53C6.77 18.23 8.94 14.77 12.91 13.43C13.88 16.14 14.45 18.45 14.57 18.95C13.76 19.85 12.72 20.35 12 20.35ZM15.93 18.15C15.79 17.58 15.26 15.44 14.36 12.87C16.82 12.56 19.04 13.14 19.78 13.36C19.34 15.42 18.04 17.15 15.93 18.15Z"
        fill="white"
      />
    </svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="w-full h-full object-contain">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.16z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.35 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.61H1.24C.45 8.18 0 9.99 0 12s.45 3.82 1.24 5.39l4.04-3.13z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.24 6.61l4.04 3.13c.95-2.84 3.6-4.99 6.72-4.99z" />
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 24 24" className="w-full h-full object-contain">
      <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022" />
      <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00" />
      <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" className="w-full h-full object-contain">
      <circle cx="12" cy="12" r="11" fill="#1ED760" />
      <path
        d="M16.8 17.2c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 3.7-.8 6.9-.5 9.5 1.1.3.2.4.5.3.8zm1.3-2.9c-.3.4-.8.5-1.2.3-2.7-1.7-6.8-2.2-10-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.7-1.1 8.2-.6 11.3 1.3.4.1.6.7.4 1.1zm.1-3C15 9.4 9.6 9.2 6.5 10.1c-.5.2-1.1-.1-1.2-.6-.2-.5.1-1.1.6-1.2 3.6-1.1 9.6-.9 13 1.2.5.3.6.9.3 1.4-.3.4-.9.6-1.4.3z"
        fill="white"
      />
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 24 24" className="w-full h-full object-contain">
      <rect width="24" height="24" rx="5" fill="#635BFF" />
      <path
        d="M13.9 10.1c-.8-.4-1.7-.6-2.5-.6-1.4 0-2.3.7-2.3 1.7 0 1.2 1.3 1.6 2.8 2 1.7.5 3.3 1.1 3.3 2.9 0 2.2-1.7 3.4-4.1 3.4-1.2 0-2.5-.3-3.6-.9v-2.3c1 .6 2.3 1 3.4 1 1.4 0 2.2-.6 2.2-1.6 0-1.2-1.3-1.6-2.9-2.1-1.7-.5-3.1-1.2-3.1-2.8 0-2.1 1.6-3.3 3.9-3.3 1.1 0 2.2.2 3.2.7v2.2z"
        fill="white"
      />
    </svg>
  ),
};

const CompanyLogo = ({
  company = '',
  logo = '',
  className = 'w-full h-full',
  size = 40,
}) => {
  const [imgError, setImgError] = useState(false);
  const normalizedName = company?.toLowerCase().trim();

  // If company is Dribbble or another known brand with dedicated SVG
  if (normalizedName === 'dribbble') {
    return <div className={className}>{BRAND_ICONS.dribbble}</div>;
  }

  // If logo URL is provided and has not failed
  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt={company || 'Company'}
        className={`object-contain ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // If matching known brand icon exists
  if (BRAND_ICONS[normalizedName]) {
    return <div className={className}>{BRAND_ICONS[normalizedName]}</div>;
  }

  // Fallback to stylized initial
  const initial = company ? company.charAt(0).toUpperCase() : 'C';

  return (
    <div className={`w-full h-full bg-gradient-to-br from-primary-light to-blue-200 text-primary-dark font-extrabold text-base flex items-center justify-center rounded ${className}`}>
      {initial}
    </div>
  );
};

export default CompanyLogo;
