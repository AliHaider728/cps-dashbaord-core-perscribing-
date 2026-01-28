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
      <div className="bg-secondary rounded-2xl shadow-sm p-8 min-h-[400px] flex items-center justify-center border border-[var(--border-color)]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Staff Member Selected</h2>
          <p className="text-secondary mb-6 max-w-md mx-auto">
            Select a staff member from the list to view their details, rota, documents, and more.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={18} />
            Back to Staff List
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'rota', label: 'Rota', icon: Calendar },
    { id: 'timesheet', label: 'Timesheet', icon: Clock },
    { id: 'invoices', label: 'Invoices', icon: DollarSign },
    { id: 'document', label: 'Documents', icon: FileText },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'leaves', label: 'Leaves', icon: Umbrella },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'log', label: 'Activity Log', icon: FileText }
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
    <div className="space-y-5">
      {/* Header Section - Dark mode support */}
      <div className="bg-secondary rounded-2xl shadow-sm overflow-hidden border border-[var(--border-color)]">
        {/* Top Bar */}
        <div className="px-5 py-3 bg-primary border-b border-[var(--border-color)] flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-secondary hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={18} />
            <span>Back to Staff List</span>
          </button>

          <div className="flex items-center gap-3">
            {isCompliant ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <BadgeCheck size={16} />
                Compliant
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                <AlertCircle size={16} />
                Non-Compliant
              </span>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
              <Send size={16} />
              <span className="font-medium">Send Reminder</span>
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
                {getInitials()}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl font-bold text-primary">{staffData?.name || 'Unknown Staff'}</h1>
                <div className="flex items-center gap-4 mt-1 text-secondary">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Building2 size={15} />
                    {staffData?.jobTitle || 'N/A'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <User size={15} />
                    {staffData?.department || 'N/A'}
                  </span>
                </div>

                <a href={`mailto:${staffData?.email || ''}`}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors mt-1.5"
                >
                  <Mail size={14} />
                  <span className="text-sm font-medium">{staffData?.email || 'No email'}</span>
                </a>
              </div>
            </div>

            {/* Right: Quick Stats - Horizontal Cards */}
            <div className="flex gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-4 py-2.5 border border-blue-100 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-xs text-gray-600 font-medium">Documents</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl px-4 py-2.5 border border-purple-100 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-xs text-gray-600 font-medium">Training</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl px-4 py-2.5 border border-emerald-100 text-center min-w-[80px]">
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <div className="text-xs text-gray-600 font-medium">Shifts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Dark mode support */}
        <div className="border-t border-[var(--border-color)] bg-primary">
          <div className="flex overflow-x-auto scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-3 relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-secondary border-b-blue-600'
                      : 'text-secondary hover:text-blue-600 hover:bg-secondary/50 border-b-transparent'
                  }`}
                  style={{ borderBottomWidth: activeTab === tab.id ? '3px' : '3px' }}
                >
                  <Icon size={17} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content - Dark mode support */}
      <div className="bg-secondary rounded-2xl shadow-sm p-5 border border-[var(--border-color)]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StaffDetails;