import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  FileText,
  GraduationCap,
  Archive,
  Umbrella,
  StickyNote,
  Clock,
  User,
  DollarSign,
  MapPin,
  Save,
  X,
  Send,
  BadgeCheck,
  AlertCircle,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { useAppContext } from '../../../context/AuthContext.jsx';

import PersonalInfoTab from '../StaffTabs/PersonalInfoTab.jsx'
import RotaTab from '../StaffTabs/Rotatab.jsx';
import TimesheetTab from '../StaffTabs/Timesheettab.jsx';
import InvoicesTab from '../StaffTabs/Invoicestab.jsx';
import DocumentTab from '../StaffTabs/Documenttab.jsx';
import TrainingTab from '../StaffTabs/Trainingtab.jsx';
import ArchiveTab from '../StaffTabs/Archivetab.jsx';
import LeavesTab from '../StaffTabs/Leavestab.jsx';
import NotesTab from '../StaffTabs/Notestab.jsx';
import LogTab from '../StaffTabs/Logtab.jsx';

const StaffDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedStaff } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mock staff data - same as StaffList
  const mockStaffData = [
    {
      id: 1,
      name: 'Daniel Harper',
      photo: null,
      jobTitle: 'Senior Care Coordinator',
      role: 'Standard User',
      email: 'daniel.harper@healthmail.co.uk',
      group: 'Care Coordination',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Compliant',
      department: 'Primary Care'
    },
    {
      id: 2,
      name: 'Sophie Williams',
      photo: null,
      jobTitle: 'Practice Operations Lead',
      role: 'Operations Lead',
      email: 'sophie.williams@primarycare.org',
      group: 'Practice Management',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Non-Compliant',
      department: 'Operations'
    },
    {
      id: 3,
      name: 'Michael Turner',
      photo: null,
      jobTitle: 'Regional Service Manager',
      role: 'Manager',
      email: 'michael.turner@caregroup.co.uk',
      group: 'Regional Management',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Compliant',
      department: 'Central Services'
    },
    {
      id: 4,
      name: 'Ayesha Khan',
      photo: null,
      jobTitle: 'Healthcare Analyst',
      role: 'Standard User',
      email: 'ayesha.khan@healthanalytics.net',
      group: 'Data & Insights',
      status: 'Working',
      compDoc: 'Non-Compliant',
      compTraining: 'Compliant',
      department: 'Analytics'
    },
    {
      id: 5,
      name: 'Oliver Bennett',
      photo: null,
      jobTitle: 'Clinical Systems Administrator',
      role: 'System Admin',
      email: 'oliver.bennett@clinicalsystems.io',
      group: 'IT Services',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Compliant',
      department: 'IT'
    },
    {
      id: 6,
      name: 'Fatima Noor',
      photo: null,
      jobTitle: 'Patient Engagement Officer',
      role: 'Standard User',
      email: 'fatima.noor@patientcare.uk',
      group: 'Patient Services',
      status: 'Left',
      compDoc: 'Non-Compliant',
      compTraining: 'Non-Compliant',
      department: 'Patient Care'
    },
    {
      id: 7,
      name: 'James Collins',
      photo: null,
      jobTitle: 'Quality & Compliance Executive',
      role: 'Compliance Officer',
      email: 'james.collins@qualitycare.org',
      group: 'Compliance',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Compliant',
      department: 'Governance'
    },
    {
      id: 8,
      name: 'Hannah Lewis',
      photo: null,
      jobTitle: 'Workforce Planning Manager',
      role: 'Manager',
      email: 'hannah.lewis@workforcehealth.co.uk',
      group: 'Workforce Planning',
      status: 'Working',
      compDoc: 'Compliant',
      compTraining: 'Non-Compliant',
      department: 'HR'
    }
  ];

  // Get staff data: first from context, then from mock data by ID
  const staffData = selectedStaff || (id ? mockStaffData.find(s => s.id === parseInt(id)) : null);

  // Early return if no staffData
  if (!staffData) {
    return (
      <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-7 min-h-[400px] flex items-center justify-center border border-border">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <User size={30} className="text-blue-600 sm:w-9 sm:h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">No Staff Member Selected</h2>
          <p className="text-sm sm:text-base text-secondary mb-5 sm:mb-7 px-4">
            Select a staff member from the list to view their details, rota, documents, and more.
          </p>
          <button
            onClick={() => navigate('/staff-list')}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="sm:size-18" />
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, shortLabel: 'Personal', color: 'blue' },
    { id: 'rota', label: 'Rota', icon: Calendar, shortLabel: 'Rota', color: 'purple' },
    { id: 'timesheet', label: 'Timesheet', icon: Clock, shortLabel: 'Time', color: 'orange' },
    { id: 'invoices', label: 'Invoices', icon: DollarSign, shortLabel: 'Invoice', color: 'green' },
    { id: 'document', label: 'Documents', icon: FileText, shortLabel: 'Docs', color: 'red' },
    { id: 'training', label: 'Training', icon: GraduationCap, shortLabel: 'Train', color: 'indigo' },
    { id: 'archive', label: 'Archive', icon: Archive, shortLabel: 'Archive', color: 'gray' },
    { id: 'leaves', label: 'Leaves', icon: Umbrella, shortLabel: 'Leave', color: 'teal' },
    { id: 'notes', label: 'Notes', icon: StickyNote, shortLabel: 'Notes', color: 'yellow' },
    { id: 'log', label: 'Activity Log', icon: FileText, shortLabel: 'Log', color: 'pink' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab staffData={staffData} isEditing={isEditing} />;
      case 'rota':
        return <RotaTab staffData={staffData} />;
      case 'timesheet':
        return <TimesheetTab staffData={staffData} />;
      case 'invoices':
        return <InvoicesTab staffData={staffData} />;
      case 'document':
        return <DocumentTab staffData={staffData} />;
      case 'training':
        return <TrainingTab staffData={staffData} />;
      case 'archive':
        return <ArchiveTab staffData={staffData} />;
      case 'leaves':
        return <LeavesTab staffData={staffData} />;
      case 'notes':
        return <NotesTab staffData={staffData} />;
      case 'log':
        return <LogTab staffData={staffData} />;
      default:
        return <PersonalInfoTab staffData={staffData} isEditing={isEditing} />;
    }
  };

  // Safe initials with fallback
  const getInitials = () => {
    if (!staffData?.name) return '??';
    return staffData.name
      .split(' ')
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2);
  };

  // Check compliance status
  const isCompliant = staffData?.compDoc === 'Compliant' && staffData?.compTraining === 'Compliant';

  // Get active tab info
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-border">
        {/* Top Bar */}
        <div className="px-3 sm:px-5 py-2 sm:py-3 bg-primary border-b border-border">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Back Button */}
            <button
              onClick={() => navigate('/staff-list')}
              className="flex items-center gap-1.5 sm:gap-2 text-secondary hover:text-core-primary-500 transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to Staff List</span>
              <span className="sm:hidden">Back</span>
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Compliance Badge */}
              {isCompliant ? (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <BadgeCheck size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Compliant</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">Non-Compliant</span>
                </span>
              )}

              {/* Send Reminder Button */}
              <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-xs sm:text-sm">
                <Send size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Send Reminder</span>
                <span className="sm:hidden">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Left: Avatar + Info */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-lg shrink-0">
                {getInitials()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate mb-1">
                  {staffData?.name || 'Unknown Staff'}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-secondary mb-1 sm:mb-2">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Building2 size={14} className="sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{staffData?.jobTitle || 'N/A'}</span>
                  </span>
                  <span className="text-border hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <User size={14} className="sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{staffData?.department || 'N/A'}</span>
                  </span>
                </div>

                <a
                  href={`mailto:${staffData?.email || ''}`}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors w-fit max-w-full"
                >
                  <Mail size={14} className="sm:w-[16px] sm:h-[16px] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {staffData?.email || 'No email'}
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-auto lg:min-w-[260px]">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 border border-blue-100 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">5</div>
                <div className="text-xs text-gray-600 font-medium mt-0.5">Documents</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 border border-purple-100 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs text-gray-600 font-medium mt-0.5">Training</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 border border-emerald-100 text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600">12</div>
                <div className="text-xs text-gray-600 font-medium mt-0.5">Shifts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block border-t border-border bg-primary overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 lg:px-5 py-3 lg:py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-3 relative ${
                    activeTab === tab.id
                      ? 'text-core-primary-500 bg-core-primary-50/30 border-b-core-primary-500'
                      : 'text-secondary hover:text-core-primary-500 hover:bg-core-primary-50/20 border-b-transparent'
                  }`}
                  style={{ borderBottomWidth: '3px' }}
                >
                  <Icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  <span className="hidden lg:inline">{tab.label}</span>
                  <span className="lg:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Tab Selector */}
        <div className="md:hidden border-t border-border bg-primary">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full px-4 py-3 flex items-center justify-between text-primary hover:bg-core-primary-50/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              {activeTabInfo && <activeTabInfo.icon size={18} />}
              <span className="font-medium">{activeTabInfo?.label || 'Select Tab'}</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${showMobileMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="border-t border-border bg-secondary max-h-[60vh] overflow-y-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-core-primary-50 text-core-primary-500 font-medium'
                        : 'text-secondary hover:bg-core-primary-50/30'
                    }`}
                  >
                    <Icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6 border border-border w-full max-w-full overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StaffDetails;