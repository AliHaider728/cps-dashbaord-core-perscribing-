import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';

const DashboardLayout = ({ children, activePage, setActivePage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false); // Changed to false for light theme default

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to light theme
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <style>
{`
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');

  body {
    background-color: #ffffff;
  }

  .shiny-text {
    position: relative;
    display: inline-block;
    font-family: "Josefin Sans", sans-serif;
    color: #3b82f6;
    overflow: hidden;
  }

  .shiny-text::after {
    content: "";
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(59,130,246,0) 0%,
      rgba(117,167,248,0.8) 50%,
      rgba(59,130,246,0) 100%
    );
    animation: shine 3s linear infinite;
  }

  @keyframes shine {
    0% { left: -150%; }
    100% { left: 150%; }
  }

  /* Optional hover enhancement */
  .shiny-text:hover {
    color: #2580de;
  }

  /* Hide scrollbar */
  .sidebar-scroll::-webkit-scrollbar {
    display: none;
  }

  .sidebar-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}
</style>

    <div className="flex min-h-screen bg-primary">
      <Sidebar 
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onThemeToggle={handleThemeToggle}
          isDark={isDark}
        />
        
        <main className="flex-1 p-4">
          {children}
        </main>

        {/* Footer - Dark mode support ke sath */}
        <footer className="bg-secondary py-6 px-4 sm:px-6 border-t border-[var(--border-color)] mt-auto transition-colors duration-300">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-sm text-secondary font-semibold">
                  © {new Date().getFullYear()} <span className="shiny-text font-semibold">Core Prescribing Solutions</span>. All Rights Reserved.
                </p>
              </div>

              {/* Divider for desktop */}
              <div className="hidden sm:block w-px h-8 bg-[var(--border-color)]"></div>

              {/* Designed By */}
              <div className="text-center sm:text-right">
                <p className="text-sm text-secondary font-semibold">
                  Designed & Developed by <span className="shiny-text font-semibold">TecnoSphere</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default DashboardLayout;