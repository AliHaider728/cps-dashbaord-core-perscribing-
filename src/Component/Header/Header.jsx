import React from 'react';
import { Menu, Search, Plus, Bell, Sun, Moon } from 'lucide-react';

const Header = ({ onMenuClick, onThemeToggle, isDark }) => {
  return (
    <header className="sticky top-0 z-30 bg-secondary shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-secondary hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-core-primary-50/50"
          >
            <Menu size={22} />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-primary">
              Admin Dashboard
            </h1>
            <p className="text-sm text-secondary">
             Core Prescribing Services
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search staff, practices, shifts, invoices..."
            className="w-full pl-11 pr-4 py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
       
          
          <button className="relative p-2 text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-core-primary-50/50">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-secondary"></span>
          </button>
          
          <button
            onClick={onThemeToggle}
            className="p-2 text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-core-primary-50/50"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="w-9 h-9 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ml-1">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;