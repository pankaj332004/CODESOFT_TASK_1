import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Palette,
  TrendingUp,
  DollarSign,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';

const getCategoryIcon = (name) => {
  switch (name?.toLowerCase()) {
    case 'development':
      return <Code size={24} className="text-sky-600" />;
    case 'design':
      return <Palette size={24} className="text-purple-600" />;
    case 'marketing':
      return <TrendingUp size={24} className="text-emerald-600" />;
    case 'sales':
      return <DollarSign size={24} className="text-orange-600" />;
    case 'finance':
      return <Briefcase size={24} className="text-blue-600" />;
    case 'management':
      return <Users size={24} className="text-amber-600" />;
    default:
      return <Briefcase size={24} className="text-primary" />;
  }
};

const CategoryCard = ({ name, count = 120 }) => {
  return (
    <Link
      to={`/jobs?category=${encodeURIComponent(name)}`}
      className="bg-white border border-brandborder rounded-xl p-5 flex items-center gap-4 transition-all duration-200 hover:border-primary hover:shadow-card hover:-translate-y-0.5 group text-left"
    >
      <div className="w-12 h-12 rounded-brand bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary-light transition-colors">
        {getCategoryIcon(name)}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base text-brandtext group-hover:text-primary transition-colors">
          {name}
        </h4>
        <span className="text-xs text-brandmuted">{count}+ Jobs Available</span>
      </div>
      <div className="text-brandmuted group-hover:text-primary group-hover:translate-x-1 transition-all">
        <ArrowRight size={16} />
      </div>
    </Link>
  );
};

export default CategoryCard;
