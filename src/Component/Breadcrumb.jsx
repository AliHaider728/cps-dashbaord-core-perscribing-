import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-1 text-secondary hover:text-core-primary-500 transition-colors"
      >
        <Home size={16} />
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="text-muted" />
          {index === items.length - 1 ? (
            <span className="font-medium text-primary">{item.label}</span>
          ) : (
            <button
              onClick={() => item.onClick && item.onClick()}
              className="text-secondary hover:text-core-primary-500 transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;