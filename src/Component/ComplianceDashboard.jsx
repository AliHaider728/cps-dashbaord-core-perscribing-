import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, CheckCircle, Clock, FileText, GraduationCap,
  Users, Calendar, Bell, Send, Download, TrendingUp, Activity
} from 'lucide-react';
import * as XLSX from 'xlsx';

const ComplianceDashboard = () => {
  // Mock UK Clinician Data with Compliance Tracking
  const [clinicians, setClinicians] = useState([
    {
      id: 1,
      name: 'Emma Thompson',
      role: 'Clinical Pharmacist',
      documents: {
        indemnityInsurance: { status: 'valid', expiry: '2027-01-20', daysUntilExpiry: 365 },
        gphcRegistration: { status: 'expiring', expiry: '2026-03-15', daysUntilExpiry: 44 },
        dbsCheck: { status: 'valid', expiry: '2028-09-15', daysUntilExpiry: 963 },
        healthScreening: { status: 'expired', expiry: '2025-12-29', daysUntilExpiry: -32 }
      },
      training: {
        dataSecurity: { status: 'completed', completion: '2025-05-12', nextDue: '2026-05-12', score: 95 },
        sepsisAwareness: { status: 'expiring', completion: '2025-11-17', nextDue: '2026-02-15', score: 92 },
        infectionControl: { status: 'completed', completion: '2025-05-16', nextDue: '2026-05-16', score: 88 },
        fireSafety: { status: 'overdue', completion: '2024-03-15', nextDue: '2026-01-15', score: 85 }
      },
      complianceScore: 72,
      lastReviewDate: '2026-01-15',
      nextReviewDate: '2026-04-15'
    },
    {
      id: 2,
      name: 'James Richardson',
      role: 'Senior Pharmacist',
      documents: {
        indemnityInsurance: { status: 'valid', expiry: '2027-06-20', daysUntilExpiry: 516 },
        gphcRegistration: { status: 'valid', expiry: '2026-11-25', daysUntilExpiry: 299 },
        dbsCheck: { status: 'valid', expiry: '2028-05-15', daysUntilExpiry: 840 },
        healthScreening: { status: 'valid', expiry: '2026-08-29', daysUntilExpiry: 211 }
      },
      training: {
        dataSecurity: { status: 'completed', completion: '2025-06-10', nextDue: '2026-06-10', score: 98 },
        sepsisAwareness: { status: 'completed', completion: '2025-10-17', nextDue: '2027-10-17', score: 94 },
        infectionControl: { status: 'completed', completion: '2025-04-16', nextDue: '2026-04-16', score: 91 },
        fireSafety: { status: 'completed', completion: '2025-09-15', nextDue: '2026-09-15', score: 87 }
      },
      complianceScore: 98,
      lastReviewDate: '2026-01-10',
      nextReviewDate: '2026-04-10'
    },
    {
      id: 3,
      name: 'Sophie Williams',
      role: 'Clinical Pharmacist',
      documents: {
        indemnityInsurance: { status: 'expiring', expiry: '2026-02-28', daysUntilExpiry: 29 },
        gphcRegistration: { status: 'valid', expiry: '2027-05-15', daysUntilExpiry: 470 },
        dbsCheck: { status: 'valid', expiry: '2027-12-20', daysUntilExpiry: 689 },
        healthScreening: { status: 'expiring', expiry: '2026-03-10', daysUntilExpiry: 39 }
      },
      training: {
        dataSecurity: { status: 'completed', completion: '2025-07-22', nextDue: '2026-07-22', score: 90 },
        sepsisAwareness: { status: 'in-progress', completion: null, nextDue: '2026-03-01', score: null },
        infectionControl: { status: 'completed', completion: '2025-06-20', nextDue: '2026-06-20', score: 93 },
        fireSafety: { status: 'overdue', completion: '2024-01-10', nextDue: '2026-01-10', score: 82 }
      },
      complianceScore: 65,
      lastReviewDate: '2026-01-05',
      nextReviewDate: '2026-04-05'
    },
    {
      id: 4,
      name: 'Oliver Davis',
      role: 'Pharmacy Manager',
      documents: {
        indemnityInsurance: { status: 'valid', expiry: '2027-08-15', daysUntilExpiry: 562 },
        gphcRegistration: { status: 'valid', expiry: '2027-02-10', daysUntilExpiry: 376 },
        dbsCheck: { status: 'valid', expiry: '2028-11-05', daysUntilExpiry: 1014 },
        healthScreening: { status: 'valid', expiry: '2026-10-15', daysUntilExpiry: 258 }
      },
      training: {
        dataSecurity: { status: 'completed', completion: '2025-08-15', nextDue: '2026-08-15', score: 96 },
        sepsisAwareness: { status: 'completed', completion: '2025-12-05', nextDue: '2027-12-05', score: 97 },
        infectionControl: { status: 'completed', completion: '2025-07-18', nextDue: '2026-07-18', score: 95 },
        fireSafety: { status: 'completed', completion: '2025-10-20', nextDue: '2026-10-20', score: 91 }
      },
      complianceScore: 100,
      lastReviewDate: '2026-01-20',
      nextReviewDate: '2026-04-20'
    },
    {
      id: 5,
      name: 'Amelia Brown',
      role: 'Clinical Pharmacist',
      documents: {
        indemnityInsurance: { status: 'valid', expiry: '2027-04-10', daysUntilExpiry: 435 },
        gphcRegistration: { status: 'expired', expiry: '2025-12-15', daysUntilExpiry: -46 },
        dbsCheck: { status: 'valid', expiry: '2027-08-22', daysUntilExpiry: 569 },
        healthScreening: { status: 'valid', expiry: '2026-06-18', daysUntilExpiry: 139 }
      },
      training: {
        dataSecurity: { status: 'overdue', completion: '2024-05-10', nextDue: '2025-05-10', score: 88 },
        sepsisAwareness: { status: 'completed', completion: '2025-09-20', nextDue: '2027-09-20', score: 90 },
        infectionControl: { status: 'expiring', completion: '2024-12-10', nextDue: '2026-02-10', score: 86 },
        fireSafety: { status: 'not-started', completion: null, nextDue: '2026-03-01', score: null }
      },
      complianceScore: 58,
      lastReviewDate: '2025-12-20',
      nextReviewDate: '2026-03-20'
    }
  ]);

  // Calculate overall compliance statistics
  const calculateStats = () => {
    const total = clinicians.length;
    const compliant = clinicians.filter(c => c.complianceScore >= 90).length;
    const atRisk = clinicians.filter(c => c.complianceScore >= 60 && c.complianceScore < 90).length;
    const nonCompliant = clinicians.filter(c => c.complianceScore < 60).length;

    let totalExpired = 0;
    let totalExpiring = 0;
    let totalOverdue = 0;

    clinicians.forEach(clinician => {
      // Count documents
      Object.values(clinician.documents).forEach(doc => {
        if (doc.status === 'expired') totalExpired++;
        if (doc.status === 'expiring') totalExpiring++;
      });

      // Count training
      Object.values(clinician.training).forEach(training => {
        if (training.status === 'overdue') totalOverdue++;
      });
    });

    return {
      total,
      compliant,
      atRisk,
      nonCompliant,
      totalExpired,
      totalExpiring,
      totalOverdue,
      averageScore: (clinicians.reduce((sum, c) => sum + c.complianceScore, 0) / total).toFixed(1)
    };
  };

  const stats = calculateStats();

  // Generate auto-notifications
  const generateNotifications = () => {
    const notifications = [];

    clinicians.forEach(clinician => {
      // Check documents
      Object.entries(clinician.documents).forEach(([docName, doc]) => {
        if (doc.status === 'expired') {
          notifications.push({
            type: 'critical',
            clinician: clinician.name,
            category: 'Document',
            item: docName.replace(/([A-Z])/g, ' $1').trim(),
            message: `Document expired ${Math.abs(doc.daysUntilExpiry)} days ago`,
            action: 'Upload New',
            priority: 'high'
          });
        } else if (doc.status === 'expiring' && doc.daysUntilExpiry <= 30) {
          notifications.push({
            type: 'warning',
            clinician: clinician.name,
            category: 'Document',
            item: docName.replace(/([A-Z])/g, ' $1').trim(),
            message: `Expires in ${doc.daysUntilExpiry} days`,
            action: 'Renew',
            priority: 'medium'
          });
        }
      });

      // Check training
      Object.entries(clinician.training).forEach(([trainingName, training]) => {
        if (training.status === 'overdue') {
          notifications.push({
            type: 'critical',
            clinician: clinician.name,
            category: 'Training',
            item: trainingName.replace(/([A-Z])/g, ' $1').trim(),
            message: `Training overdue - needs immediate completion`,
            action: 'Assign',
            priority: 'high'
          });
        } else if (training.status === 'expiring') {
          notifications.push({
            type: 'warning',
            clinician: clinician.name,
            category: 'Training',
            item: trainingName.replace(/([A-Z])/g, ' $1').trim(),
            message: `Training renewal required soon`,
            action: 'Schedule',
            priority: 'medium'
          });
        }
      });

      // Low compliance score
      if (clinician.complianceScore < 70) {
        notifications.push({
          type: 'alert',
          clinician: clinician.name,
          category: 'Compliance',
          item: 'Overall Score',
          message: `Low compliance score: ${clinician.complianceScore}%`,
          action: 'Review',
          priority: 'high'
        });
      }
    });

    return notifications.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const notifications = generateNotifications();

  // Auto-send reminder emails
  const sendReminderEmail = (clinician, type) => {
    alert(`Reminder email sent to ${clinician.name} about ${type}`);
  };

  // Export compliance report
  const exportComplianceReport = () => {
    const exportData = clinicians.map(clinician => ({
      'Name': clinician.name,
      'Role': clinician.role,
      'Compliance Score': `${clinician.complianceScore}%`,
      'Indemnity Insurance': clinician.documents.indemnityInsurance.status,
      'GPhC Registration': clinician.documents.gphcRegistration.status,
      'DBS Check': clinician.documents.dbsCheck.status,
      'Health Screening': clinician.documents.healthScreening.status,
      'Data Security Training': clinician.training.dataSecurity.status,
      'Sepsis Awareness': clinician.training.sepsisAwareness.status,
      'Infection Control': clinician.training.infectionControl.status,
      'Fire Safety': clinician.training.fireSafety.status,
      'Last Review': clinician.lastReviewDate,
      'Next Review': clinician.nextReviewDate
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compliance Report');
    
    ws['!cols'] = Array(14).fill({ wch: 18 });
    XLSX.writeFile(wb, 'Clinician_Compliance_Report.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Compliance Dashboard</h1>
          <p className="text-secondary text-sm mt-1">Auto-tracking of training and documents for all clinicians</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportComplianceReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <Download size={16} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm">
            <Bell size={16} />
            Send Reminders
            {notifications.filter(n => n.priority === 'high').length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notifications.filter(n => n.priority === 'high').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <Users size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs opacity-90 mt-1">Total Clinicians</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <CheckCircle size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.compliant}</div>
          <div className="text-xs opacity-90 mt-1">Fully Compliant</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
          <AlertTriangle size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.atRisk}</div>
          <div className="text-xs opacity-90 mt-1">At Risk</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
          <Shield size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.nonCompliant}</div>
          <div className="text-xs opacity-90 mt-1">Non-Compliant</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <FileText size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.totalExpired}</div>
          <div className="text-xs opacity-90 mt-1">Expired Docs</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <Clock size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.totalExpiring}</div>
          <div className="text-xs opacity-90 mt-1">Expiring Soon</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
          <GraduationCap size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.totalOverdue}</div>
          <div className="text-xs opacity-90 mt-1">Overdue Training</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
          <TrendingUp size={20} className="mb-2 opacity-80" />
          <div className="text-2xl font-bold">{stats.averageScore}%</div>
          <div className="text-xs opacity-90 mt-1">Avg Score</div>
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-core-primary-500" />
            <h2 className="text-lg font-bold text-primary">Auto Notifications</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notifications.length} alerts
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {notifications.map((notif, idx) => (
            <div
              key={idx}
              className={`p-4 hover:bg-primary transition-colors ${
                notif.type === 'critical' ? 'bg-red-50/50' :
                notif.type === 'warning' ? 'bg-yellow-50/50' :
                'bg-blue-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary">{notif.clinician}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      notif.priority === 'high' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {notif.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-secondary mb-1">
                    <span className="font-medium">{notif.category}:</span> {notif.item}
                  </div>
                  <div className="text-sm text-muted">{notif.message}</div>
                </div>
                <button
                  onClick={() => sendReminderEmail(notif.clinician, notif.item)}
                  className="px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 text-sm whitespace-nowrap"
                >
                  <Send size={14} className="inline mr-2" />
                  {notif.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinicians Compliance Table */}
      <div className="bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Clinician Compliance Overview</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-core-primary-50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Clinician</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Compliance Score</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Documents</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Training</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Next Review</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clinicians.map(clinician => {
                const docIssues = Object.values(clinician.documents).filter(d => 
                  d.status === 'expired' || d.status === 'expiring'
                ).length;
                const trainingIssues = Object.values(clinician.training).filter(t => 
                  t.status === 'overdue' || t.status === 'not-started'
                ).length;

                return (
                  <tr key={clinician.id} className="hover:bg-core-primary-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{clinician.name}</td>
                    <td className="px-4 py-3 text-secondary">{clinician.role}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                          clinician.complianceScore >= 90 ? 'bg-green-100 text-green-700' :
                          clinician.complianceScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {clinician.complianceScore}%
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {docIssues > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          <AlertTriangle size={12} />
                          {docIssues} issues
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          <CheckCircle size={12} />
                          All valid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {trainingIssues > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          <AlertTriangle size={12} />
                          {trainingIssues} issues
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          <CheckCircle size={12} />
                          Up to date
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-secondary text-sm">
                      {clinician.nextReviewDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="px-3 py-1.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;