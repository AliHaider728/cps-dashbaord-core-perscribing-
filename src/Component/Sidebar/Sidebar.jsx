import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Building2,
  Hospital,
  UserCog,
  Calendar,
  Umbrella,
  CheckCircle,
  Clock,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCircle,
  ClipboardList,
  BarChart,
  Bell,
  Mail,
  Users2,
  BellRing,
  Inbox,
} from 'lucide-react';


const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',      path: '/',              id: 'dashboard' },
    { icon: BarChart,        label: 'PCN Performance', path: '/pcn-dashboard', id: 'pcn-dashboard' },
    { icon: Bell,            label: 'Announcements',  path: '/announcements', id: 'announcements' },
     // ── NEW: Email Activity ────────────────────────────────────────────────
    {
      icon: Mail,
      label: 'Email Activity',
      id: 'email-activity',
      hasDropdown: true,
      subItems: [
        { icon: LayoutDashboard, label: 'Overview',      path: '/email-activity' },
        { icon: Users2,          label: 'Clients',       path: '/email-activity/clients' },
        { icon: Inbox,           label: 'Emails',        path: '/email-activity/emails' },
        { icon: UserCog,         label: 'Team',          path: '/email-activity/team' },
        { icon: BellRing,        label: 'Notifications', path: '/email-activity/notifications' },
      ],
    },
    // ─
    {
      icon: Users,
      label: 'Clients',
      id: 'clients',
      hasDropdown: true,
      subItems: [
        { icon: Hospital,  label: 'PCNs',       path: '/pcns' },
        { icon: Building2, label: 'Standalone',  path: '/practices' },
      ],
    },
    { icon: Building2, label: 'Practices', path: '/practices', id: 'practices' },
    {
      icon: UserCog,
      label: 'Staff',
      id: 'staff',
      hasDropdown: true,
      subItems: [
        { icon: ClipboardList, label: 'Staff List',    path: '/staff-list' },
        { icon: UserCircle,    label: 'Staff Details', path: '/staff-details' },
        { icon: Clock,         label: 'Attendance',    path: '/attendance' },
      ],
    },
    { icon: Calendar, label: 'Rota Management', path: '/rota-management', id: 'rota-management' },
    {
      icon: Umbrella,
      label: 'Leave',
      id: 'leave',
      hasDropdown: true,
      subItems: [
        { icon: ClipboardList, label: 'Leave List',    path: '/leave-list' },
        { icon: FileText,      label: 'Leave Details', path: '/leave-details' },
      ],
    },
    { icon: CheckCircle, label: 'Compliance', path: '/compliance', id: 'compliance' },
    { icon: Clock,       label: 'Timesheets', path: '/timesheets', id: 'timesheets' },
    { icon: FileText,    label: 'Invoices',   path: '/invoices',   id: 'invoices' },

 
  ];

  useEffect(() => {
    const newExpanded = {};
    menuItems.forEach((item) => {
      if (item.hasDropdown) {
        const hasActive = item.subItems?.some(
          (sub) =>
            location.pathname === sub.path ||
            (sub.path !== '/email-activity' && location.pathname.startsWith(sub.path + '/'))
        );
        if (hasActive && !isCollapsed) {
          newExpanded[item.id] = true;
        }
      }
    });
    setOpenDropdowns(newExpanded);
  }, [location.pathname, isCollapsed]);

  const toggleDropdown = (itemId) => {
    if (isCollapsed && !isHovered) {
      setIsCollapsed(false);
      setTimeout(() => {
        setOpenDropdowns(prev => ({
          ...prev,
          [itemId]: !prev[itemId]
        }));
      }, 100);
    } else {
      setOpenDropdowns(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    }
  };

  const handleMouseEnter = (item) => {
    if (isCollapsed && !isHovered && item.hasDropdown) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      setHoveredItem(item.id);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed && !isHovered) {
      const timeout = setTimeout(() => {
        setHoveredItem(null);
      }, 150);
      setHoverTimeout(timeout);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsOpen(false);
  };

  const isItemActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.hasDropdown) {
      return item.subItems?.some(
        (sub) =>
          location.pathname === sub.path ||
          (sub.path !== '/email-activity' && location.pathname.startsWith(sub.path + '/'))
      );
    }
    return false;
  };

  return (
    <>
      <style>{`
        .sidebar-scroll {
          scrollbar-width: none;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 0;
        }
        .sidebar-expanded .sidebar-scroll:hover {
          scrollbar-width: thin;
        }
        .sidebar-expanded .sidebar-scroll:hover::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-expanded .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-expanded .sidebar-scroll::-webkit-scrollbar-thumb {
          background: var(--core-primary-200);
          border-radius: 10px;
        }
        .dropdown-content {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropdown-content.open {
          max-height: 600px;
          opacity: 1;
          margin-top: 0.25rem;
        }
        .hover-popup {
          opacity: 0;
          visibility: hidden;
          transform: translateX(-8px) scale(0.96);
          pointer-events: none;
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                      visibility 0.2s;
        }
        .hover-popup.active {
          opacity: 1;
          visibility: visible;
          transform: translateX(0) scale(1);
          pointer-events: auto;
        }
        .chevron-rotate {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .chevron-rotate.rotated {
          transform: rotate(180deg);
        }
      `}</style>

      <aside
        className={`fixed left-0 top-0 h-screen bg-secondary flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-border ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed && !isHovered ? 'w-16' : 'w-64 sidebar-expanded'}`}
        onMouseEnter={() => isCollapsed && setIsHovered(true)}
        onMouseLeave={() => isCollapsed && setIsHovered(false)}
      >
        <button
          onClick={handleLogoClick}
          className={`flex items-center transition-all duration-300 hover:bg-primary/50 ${
            isCollapsed && !isHovered ? 'h-16 justify-center px-3' : 'h-20 px-6'
          }`}
        >
          {!isCollapsed || isHovered ? (
            <div className="flex items-center gap-3">
              <img
                src="https://coreprescribingsolutions.co.uk/wp-content/themes/core-prescribing/images/core-prescribing-logo.png"
                alt="CorePrescribingSolutions Logo"
                className="w-10 h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="text-primary font-semibold text-base leading-tight">
                  Core Prescribing
                </span>
                <span className="text-primary font-semibold text-base leading-tight">
                  Solutions
                </span>
              </div>
            </div>
          ) : (
            <img
              src="https://coreprescribingsolutions.co.uk/wp-content/themes/core-prescribing/images/core-prescribing-logo.png"
              alt="Logo"
              className="w-8 h-8 object-contain transition-all duration-300"
            />
          )}
        </button>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-4" />

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 sidebar-scroll">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const isDropdownOpen = openDropdowns[item.id];
            const isHoverActive = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => {
                    if (item.hasDropdown) {
                      toggleDropdown(item.id);
                    } else {
                      handleNavigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-200 ease-in-out group relative ${
                    isActive
                      ? 'bg-core-primary-50 text-core-primary-500'
                      : 'text-secondary hover:bg-primary hover:text-core-primary-500'
                  } ${isCollapsed && !isHovered ? 'justify-center' : ''}`}
                  title={isCollapsed && !isHovered ? item.label : ''}
                >
                  {isActive && (!isCollapsed || isHovered) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-core-primary-500 rounded-r-full" />
                  )}

                  <Icon
                    size={18}
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'text-core-primary-500'
                        : 'text-muted group-hover:text-core-primary-500'
                    } ${isCollapsed && !isHovered ? '' : 'ml-1'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />

                  {(!isCollapsed || isHovered) && (
                    <>
                      <span className={`flex-1 text-left font-medium text-sm transition-all duration-200 ${
                        isActive ? 'text-core-primary-500' : ''
                      }`}>
                        {item.label}
                      </span>
                      {item.hasDropdown && (
                        <ChevronDown
                          size={16}
                          className={`chevron-rotate ${isDropdownOpen ? 'rotated' : ''} transition-all duration-200 ${
                            isActive ? 'text-core-primary-500' : 'text-muted'
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {item.hasDropdown && (!isCollapsed || isHovered) && (
                  <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                    <div className="ml-4 space-y-1 border-l-2 border-core-primary-100 pl-1">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive =
                          location.pathname === subItem.path ||
                          (subItem.path !== '/email-activity' &&
                            location.pathname.startsWith(subItem.path + '/'));

                        return (
                          <button
                            key={subItem.path}
                            onClick={() => handleNavigate(subItem.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 pl-3 rounded-lg transition-all duration-200 ease-in-out group ${
                              isSubActive
                                ? 'bg-core-primary-50 text-core-primary-500'
                                : 'text-secondary hover:bg-primary hover:text-core-primary-500'
                            }`}
                          >
                            <SubIcon
                              size={16}
                              className={`transition-all duration-200 ${
                                isSubActive
                                  ? 'text-core-primary-500'
                                  : 'text-muted group-hover:text-core-primary-500'
                              }`}
                              strokeWidth={isSubActive ? 2.5 : 2}
                            />
                            <span className={`font-medium text-sm transition-all duration-200 ${
                              isSubActive ? 'text-core-primary-500' : ''
                            }`}>
                              {subItem.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {item.hasDropdown && isCollapsed && !isHovered && (
                  <div
                    className={`hover-popup ${isHoverActive ? 'active' : ''} absolute left-full top-0 ml-2 bg-secondary border border-border rounded-lg shadow-xl z-50 min-w-[220px]`}
                    onMouseEnter={() => {
                      if (hoverTimeout) clearTimeout(hoverTimeout);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Icon size={18} className="text-core-primary-500 shrink-0" />
                        <span className="font-semibold text-sm text-primary">
                          {item.label}
                        </span>
                      </div>
                    </div>

                    <div className="py-2">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.path;

                        return (
                          <button
                            key={subItem.path}
                            onClick={() => {
                              handleNavigate(subItem.path);
                              setHoveredItem(null);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition-all duration-200 ${
                              isSubActive
                                ? 'bg-core-primary-50 text-core-primary-500 font-medium'
                                : 'text-secondary hover:bg-primary hover:text-core-primary-500'
                            }`}
                          >
                            <SubIcon
                              size={16}
                              className={`shrink-0 ${
                                isSubActive ? 'text-core-primary-500' : 'text-muted'
                              }`}
                              strokeWidth={isSubActive ? 2.5 : 2}
                            />
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-4" />

        <div className={`transition-all duration-300 ${isCollapsed && !isHovered ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed && !isHovered ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md transition-all duration-200 hover:shadow-lg">
              AS
            </div>
            {(!isCollapsed || isHovered) && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-primary text-sm font-medium truncate">
                    Arslan Shahroz
                  </div>
                  <div className="text-secondary text-xs truncate">
                    Administrator
                  </div>
                </div>
                <button className="text-muted hover:text-core-primary-500 transition-colors duration-200 p-1 rounded-md hover:bg-core-primary-50/50">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-secondary border border-border rounded-full items-center justify-center text-muted hover:text-core-primary-500 hover:border-core-primary-500 transition-all duration-200 shadow-sm hover:shadow-md z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;