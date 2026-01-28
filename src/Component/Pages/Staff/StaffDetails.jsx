import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

import PersonalInfoTab from '../StaffTabs/PersonalInfoTab.jsx'
import RotaTab from '../StaffTabs/Rotatab';
import TimesheetTab from '../StaffTabs/Timesheettab.jsx';
import InvoicesTab from '../StaffTabs/Invoicestab';
import DocumentTab from '../StaffTabs/Documenttab.jsx';
import TrainingTab from '../StaffTabs/Trainingtab';
import ArchiveTab from '../StaffTabs/Archivetab';
import LeavesTab from '../StaffTabs/Leavestab.jsx';
import NotesTab from '../StaffTabs/Notestab.jsx';
import LogTab from '../StaffTabs/Logtab';

const StaffDetails = ({ staffData, onBack }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // Early return if no staffData (prevents crash)
  if (!staffData) {
    return (
      <div className="bg-secondary rounded-2xl shadow-sm p-4 sm:p-8 min-h-[400px] flex items-center justify-center border border-[var(--border-color)]">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <User size={32} className="text-blue-600 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3">No Staff Member Selected</h2>
          <p className="text-sm sm:text-base text-secondary mb-4 sm:mb-6 max-w-md mx-auto px-4">
            Select a staff member from the list to view their details, rota, documents, and more.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User, shortLabel: 'Personal' },
    { id: 'rota', label: 'Rota', icon: Calendar, shortLabel: 'Rota' },
    { id: 'timesheet', label: 'Timesheet', icon: Clock, shortLabel: 'Time' },
    { id: 'invoices', label: 'Invoices', icon: DollarSign, shortLabel: 'Invoice' },
    { id: 'document', label: 'Documents', icon: FileText, shortLabel: 'Docs' },
    { id: 'training', label: 'Training', icon: GraduationCap, shortLabel: 'Train' },
    { id: 'archive', label: 'Archive', icon: Archive, shortLabel: 'Archive' },
    { id: 'leaves', label: 'Leaves', icon: Umbrella, shortLabel: 'Leave' },
    { id: 'notes', label: 'Notes', icon: StickyNote, shortLabel: 'Notes' },
    { id: 'log', label: 'Activity Log', icon: FileText, shortLabel: 'Log' }
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

  return (
    <div className="space-y-3 sm:space-y-5 w-full max-w-full overflow-hidden">
      {/* Header Section - Dark mode support */}
      <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-[var(--border-color)]">
        {/* Top Bar */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-primary border-b border-[var(--border-color)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-secondary hover:text-blue-600 transition-colors duration-200 font-medium text-sm sm:text-base justify-start"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Back to Staff List</span>
            </button>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:flex sm:items-center sm:justify-end">
              {isCompliant ? (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 justify-center">
                  <BadgeCheck size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Compliant</span>
                  <span className="sm:hidden">Comp.</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200 justify-center">
                  <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Non-Compliant</span>
                  <span className="sm:hidden">Non-Comp.</span>
                </span>
              )}
              <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg justify-center">
                <Send size={14} className="sm:w-4 sm:h-4" />
                <span className="font-medium text-xs sm:text-sm">Send Reminder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-3 sm:px-5 py-3 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start lg:items-center">
            {/* Left: Avatar + Info - Takes 8 columns on large screens */}
            <div className="lg:col-span-8 flex items-start sm:items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-lg shrink-0">
                {getInitials()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-primary truncate">{staffData?.name || 'Unknown Staff'}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-secondary">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <Building2 size={13} className="sm:w-[15px] sm:h-[15px] shrink-0" />
                    <span className="truncate">{staffData?.jobTitle || 'N/A'}</span>
                  </span>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <User size={13} className="sm:w-[15px] sm:h-[15px] shrink-0" />
                    <span className="truncate">{staffData?.department || 'N/A'}</span>
                  </span>
                </div>

                <a href={`mailto:${staffData?.email || ''}`}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors mt-1.5 w-fit max-w-full"
                >
                  <Mail size={12} className="sm:w-[14px] sm:h-[14px] shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{staffData?.email || 'No email'}</span>
                </a>
              </div>
            </div>

            {/* Right: Quick Stats - Takes 4 columns on large screens */}
            <div className="lg:col-span-4 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 border border-blue-100 text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">5</div>
                <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Docs</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 border border-purple-100 text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">8</div>
                <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Training</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-2.5 border border-emerald-100 text-center">
                <div className="text-lg sm:text-2xl font-bold text-emerald-600">12</div>
                <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Shifts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Dark mode support with proper scroll */}
        <div className="border-t border-[var(--border-color)] bg-primary overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border-b-3 relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-secondary border-b-blue-600'
                      : 'text-secondary hover:text-blue-600 hover:bg-secondary/50 border-b-transparent'
                  }`}
                  style={{ borderBottomWidth: activeTab === tab.id ? '3px' : '3px' }}
                >
                  <Icon size={15} className="sm:w-[17px] sm:h-[17px]" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content - Dark mode support */}
      <div className="bg-secondary rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-5 border border-[var(--border-color)] w-full max-w-full overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StaffDetails;