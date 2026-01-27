import React, { useState } from 'react';
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
  ChevronUp,
  UserCircle,
  ClipboardList
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen, isCollapsed, setIsCollapsed, clientFilterType, setClientFilterType }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { 
      icon: Users, 
      label: 'Clients', 
      id: 'clients',
      hasDropdown: true,
      subItems: [
        { icon: Hospital, label: 'PCNs', filterType: 'pcn' },
        { icon: Building2, label: 'Standalone', filterType: 'standalone' }
      ]
    },
    { icon: Building2, label: 'Practices', id: 'practices' },
    { 
      icon: UserCog, 
      label: 'Staff', 
      id: 'staff',
      hasDropdown: true,
      subItems: [
        { icon: ClipboardList, label: 'Staff List', id: 'staff-list' },
        { icon: UserCircle, label: 'Staff Details', id: 'staff-details' }
      ]
    },
    { icon: Calendar, label: 'Rota', id: 'rota' },
    { icon: Umbrella, label: 'Leave', id: 'leave' },
    { icon: CheckCircle, label: 'Compliance', id: 'compliance' },
    { icon: Clock, label: 'Timesheets', id: 'timesheets' },
    { icon: FileText, label: 'Invoices', id: 'invoices' },
  ];

  const toggleDropdown = (itemId) => {
    if (isCollapsed) {
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

  const isItemActive = (item) => {
    if (item.id === 'clients') {
      return activePage === 'clients';
    }
    if (item.hasDropdown && item.id === 'staff') {
      return item.subItems.some(sub => activePage === sub.id);
    }
    return activePage === item.id;
  };

  const isClientSubItemActive = (filterType) => {
    return activePage === 'clients' && clientFilterType === filterType;
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-secondary flex flex-col transition-all duration-300 ease-in-out z-50 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Logo Header */}
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'h-16 justify-center px-3' : 'h-20 px-6'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <img
                src="https://coreprescribingsolutions.co.uk/wp-content/themes/core-prescribing/images/core-prescribing-logo.png"
                alt="CorePrescribingSolutions Logo"
                className="w-10 h-10 object-contain transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="text-primary font-semibold text-base leading-tight">
                  CorePrescribing
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
        </div>
        
        {/* Subtle Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-4" />
        
        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--core-primary-1000) transparent'
          }}
        >
          <style>{`
            nav::-webkit-scrollbar {
              width: 1px;
            }
            nav::-webkit-scrollbar-track {
              background: transparent;
            }
            nav::-webkit-scrollbar-thumb {
              background: var(--core-primary-1000);
              border-radius: 10px;
            }
            nav::-webkit-scrollbar-thumb:hover {
              background: var(--core-primary-600);
            }
            @media (max-width: 767px) {
              nav::-webkit-scrollbar {
                width: 2px;
              }
              nav::-webkit-scrollbar-thumb {
                background: var(--core-primary-300);
                border-radius: 10px;
              }
              nav::-webkit-scrollbar-thumb:hover {
                background: var(--core-primary-400);
              }
            }
          `}</style>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const isDropdownOpen = openDropdowns[item.id];
            
            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => {
                    if (item.hasDropdown) {
                      toggleDropdown(item.id);
                      // If clicking Clients main item, open it with 'all' filter
                      if (item.id === 'clients') {
                        setActivePage('clients');
                        if (setClientFilterType) {
                          setClientFilterType('all');
                        }
                      }
                    } else {
                      setActivePage(item.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-lg transition-all duration-200 ease-in-out group relative ${
                    isActive
                      ? 'bg-core-primary-50 text-core-primary-500'
                      : 'text-secondary hover:bg-core-primary-50/50 hover:text-core-primary-500'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-core-primary-500 rounded-r-full transition-all duration-200" />
                  )}
                  <Icon
                    size={18}
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'text-core-primary-500'
                        : 'text-muted group-hover:text-core-primary-500'
                    } ${isCollapsed ? '' : 'ml-1'}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 text-left font-medium text-sm transition-all duration-200 ${
                        isActive ? 'text-core-primary-500' : ''
                      }`}>
                        {item.label}
                      </span>
                      {item.hasDropdown && (
                        isDropdownOpen ? 
                          <ChevronUp size={16} className={`transition-all duration-200 ${
                            isActive ? 'text-core-primary-500' : 'text-muted'
                          }`} /> : 
                          <ChevronDown size={16} className={`transition-all duration-200 ${
                            isActive ? 'text-core-primary-500' : 'text-muted'
                          }`} />
                      )}
                    </>
                  )}
                </button>

                {/* Dropdown Sub-items */}
                {item.hasDropdown && !isCollapsed && isDropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-core-primary-100">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      
                      // For Clients dropdown - check filterType
                      const isSubActive = item.id === 'clients' 
                        ? isClientSubItemActive(subItem.filterType)
                        : activePage === subItem.id;
                      
                      return (
                        <button
                          key={subItem.label}
                          onClick={() => {
                            // Handle Clients sub-items (PCNs/Standalone)
                            if (item.id === 'clients' && subItem.filterType) {
                              setActivePage('clients');
                              if (setClientFilterType) {
                                setClientFilterType(subItem.filterType);
                              }
                            } else {
                              // Handle other dropdowns (Staff)
                              setActivePage(subItem.id);
                            }
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 pl-4 rounded-lg transition-all duration-200 ease-in-out group ${
                            isSubActive
                              ? 'bg-core-primary-50 text-core-primary-500'
                              : 'text-secondary hover:bg-core-primary-50/50 hover:text-core-primary-500'
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
                )}
              </div>
            );
          })}
        </nav>
        
        {/* Subtle Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mx-4" />
        
        {/* User Profile */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-md transition-all duration-200 hover:shadow-lg">
              JD
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-primary text-sm font-medium truncate">
                    John Doe
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
        
        {/* Toggle Button - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-secondary border border-border rounded-full items-center justify-center text-muted hover:text-core-primary-500 hover:border-core-primary-500 transition-all duration-200 shadow-sm hover:shadow-md z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
      
      {/* Mobile Overlay */}
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