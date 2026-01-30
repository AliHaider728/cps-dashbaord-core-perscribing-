import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  User, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Save,
  Megaphone,
  Mail,
  Send,
  Users,
  Building2,
  UserCheck,
  Filter,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';

const Announcements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [showStaffSelector, setShowStaffSelector] = useState(false);
  
  // Staff Data
  const [staffList] = useState([
    { id: 1, name: 'Sarah Johnson', role: 'Senior Nurse', pcn: 'Richmond PCN', email: 'sarah.j@example.com', type: 'pcn' },
    { id: 2, name: 'Michael Chen', role: 'Healthcare Assistant', pcn: 'Richmond PCN', email: 'michael.c@example.com', type: 'pcn' },
    { id: 3, name: 'Emily Williams', role: 'Care Coordinator', pcn: 'Oakwood PCN', email: 'emily.w@example.com', type: 'pcn' },
    { id: 4, name: 'David Brown', role: 'Support Worker', pcn: 'Non-PCN', email: 'david.b@example.com', type: 'non-pcn' },
    { id: 5, name: 'Lisa Anderson', role: 'Practice Manager', pcn: 'Richmond PCN', email: 'lisa.a@example.com', type: 'pcn' },
    { id: 6, name: 'James Wilson', role: 'Locum Doctor', pcn: 'Non-PCN', email: 'james.w@example.com', type: 'non-pcn' },
    { id: 7, name: 'Emma Thompson', role: 'Nurse Practitioner', pcn: 'Oakwood PCN', email: 'emma.t@example.com', type: 'pcn' },
    { id: 8, name: 'Robert Davis', role: 'Admin Staff', pcn: 'Non-PCN', email: 'robert.d@example.com', type: 'non-pcn' }
  ]);

  const [pcnList] = useState([
    'Richmond PCN',
    'Oakwood PCN',
    'Riverside PCN',
    'Meadowbrook PCN'
  ]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    author: 'Sarah Mitchell',
    targetAudience: 'all',
    selectedStaff: [],
    selectedPCNs: [],
    sendEmail: false,
    scheduleFor: '',
    attachments: []
  });

  // Initial Announcements Data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      message: 'Our system will undergo scheduled maintenance on February 15, 2026, from 2:00 AM to 6:00 AM GMT. During this time, some services may be temporarily unavailable.',
      type: 'info',
      priority: 'medium',
      author: 'IT Department',
      date: '2026-02-10',
      time: '09:30 AM',
      views: 145,
      status: 'active',
      targetAudience: 'all',
      emailSent: true,
      recipients: 'All Staff'
    },
    {
      id: 2,
      title: 'New PCN Contract Signed',
      message: 'We are pleased to announce that Richmond PCN has renewed their contract with us for another 2 years.',
      type: 'success',
      priority: 'high',
      author: 'Sarah Mitchell',
      date: '2026-02-08',
      time: '02:15 PM',
      views: 298,
      status: 'active',
      targetAudience: 'pcn',
      emailSent: true,
      recipients: 'PCN Staff Only'
    },
    {
      id: 3,
      title: 'Compliance Documents Expiring Soon',
      message: 'Attention: 5 staff members have compliance documents expiring within the next 7 days.',
      type: 'warning',
      priority: 'high',
      author: 'HR Department',
      date: '2026-02-05',
      time: '11:00 AM',
      views: 412,
      status: 'active',
      targetAudience: 'specific-staff',
      emailSent: true,
      recipients: '5 Selected Staff'
    },
    {
      id: 4,
      title: 'Monthly Staff Meeting - February 2026',
      message: 'All staff are required to attend the monthly meeting on February 20, 2026, at 10:00 AM.',
      type: 'info',
      priority: 'medium',
      author: 'Management',
      date: '2026-02-03',
      time: '04:45 PM',
      views: 567,
      status: 'active',
      targetAudience: 'all',
      emailSent: false,
      recipients: 'All Staff'
    },
    {
      id: 5,
      title: 'Critical: Rota Gaps Identified',
      message: 'Urgent: 21 unfilled rota gaps have been identified for this week across multiple PCNs.',
      type: 'error',
      priority: 'urgent',
      author: 'Rota Management',
      date: '2026-02-01',
      time: '08:20 AM',
      views: 623,
      status: 'active',
      targetAudience: 'pcn',
      emailSent: true,
      recipients: 'PCN Staff Only'
    }
  ]);

  // Export Functions
  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Message', 'Type', 'Priority', 'Author', 'Date', 'Time', 'Status', 'Recipients', 'Views', 'Email Sent'];
    
    const csvData = filteredAnnouncements.map(ann => [
      ann.id,
      `"${ann.title}"`,
      `"${ann.message}"`,
      ann.type,
      ann.priority,
      ann.author,
      ann.date,
      ann.time,
      ann.status,
      ann.recipients,
      ann.views,
      ann.emailSent ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `announcements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportMenu(false);
    alert('Announcements exported to CSV successfully! 📊');
  };

  const exportToPDF = () => {
    // Create a printable HTML document
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Announcements Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #9333ea;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #9333ea;
            margin: 0;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .announcement {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .announcement-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
          }
          .announcement-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin: 0;
          }
          .badges {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            color: white;
          }
          .badge-urgent { background-color: #dc2626; }
          .badge-high { background-color: #f97316; }
          .badge-medium { background-color: #f59e0b; }
          .badge-low { background-color: #0ea5e9; }
          .badge-info { background-color: #3b82f6; }
          .badge-success { background-color: #10b981; }
          .badge-warning { background-color: #f59e0b; }
          .badge-error { background-color: #ef4444; }
          .announcement-message {
            margin: 15px 0;
            line-height: 1.6;
            color: #475569;
          }
          .announcement-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 12px;
            color: #64748b;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
          }
          .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @media print {
            body { padding: 20px; }
            .announcement { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📢 Announcements Report</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
          <p>Total Announcements: ${filteredAnnouncements.length}</p>
        </div>
        
        ${filteredAnnouncements.map(ann => `
          <div class="announcement">
            <div class="announcement-header">
              <h2 class="announcement-title">${ann.title}</h2>
              <div class="badges">
                <span class="badge badge-${ann.priority}">${ann.priority.toUpperCase()}</span>
                <span class="badge badge-${ann.type}">${ann.type.toUpperCase()}</span>
              </div>
            </div>
            <p class="announcement-message">${ann.message}</p>
            <div class="announcement-meta">
              <span class="meta-item">👤 ${ann.author}</span>
              <span class="meta-item">📅 ${ann.date}</span>
              <span class="meta-item">🕐 ${ann.time}</span>
              <span class="meta-item">👥 ${ann.recipients}</span>
              <span class="meta-item">👁️ ${ann.views} views</span>
              <span class="meta-item">${ann.emailSent ? '✅ Email Sent' : '📧 No Email'}</span>
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>This report was generated automatically by the Announcements Management System</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      setShowExportMenu(false);
      alert('PDF generation started! Please check your print dialog. 🖨️');
    }, 250);
  };

  const exportToExcel = () => {
    // Create HTML table for Excel
    const table = `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr style="background-color: #9333ea; color: white; font-weight: bold;">
            <th>ID</th>
            <th>Title</th>
            <th>Message</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Author</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Recipients</th>
            <th>Views</th>
            <th>Email Sent</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAnnouncements.map(ann => `
            <tr>
              <td>${ann.id}</td>
              <td>${ann.title}</td>
              <td>${ann.message}</td>
              <td>${ann.type}</td>
              <td>${ann.priority}</td>
              <td>${ann.author}</td>
              <td>${ann.date}</td>
              <td>${ann.time}</td>
              <td>${ann.status}</td>
              <td>${ann.recipients}</td>
              <td>${ann.views}</td>
              <td>${ann.emailSent ? 'Yes' : 'No'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `announcements_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportMenu(false);
    alert('Announcements exported to Excel successfully! 📊');
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: 'text-emerald-600 dark:text-emerald-400',
          iconBg: 'bg-emerald-100 dark:bg-emerald-800',
          badge: 'bg-emerald-500 dark:bg-emerald-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/30',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-300',
          icon: 'text-amber-600 dark:text-amber-400',
          iconBg: 'bg-amber-100 dark:bg-amber-800',
          badge: 'bg-amber-500 dark:bg-amber-600'
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-900/30',
          border: 'border-rose-200 dark:border-rose-800',
          text: 'text-rose-700 dark:text-rose-300',
          icon: 'text-rose-600 dark:text-rose-400',
          iconBg: 'bg-rose-100 dark:bg-rose-800',
          badge: 'bg-rose-500 dark:bg-rose-600'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-800',
          badge: 'bg-blue-500 dark:bg-blue-600'
        };
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      urgent: 'bg-rose-600 dark:bg-rose-500',
      high: 'bg-orange-500 dark:bg-orange-400',
      medium: 'bg-amber-500 dark:bg-amber-400',
      low: 'bg-sky-500 dark:bg-sky-400'
    };
    return styles[priority] || styles.low;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleStaffSelection = (staffId) => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.includes(staffId)
        ? prev.selectedStaff.filter(id => id !== staffId)
        : [...prev.selectedStaff, staffId]
    }));
  };

  const togglePCNSelection = (pcn) => {
    setFormData(prev => ({
      ...prev,
      selectedPCNs: prev.selectedPCNs.includes(pcn)
        ? prev.selectedPCNs.filter(p => p !== pcn)
        : [...prev.selectedPCNs, pcn]
    }));
  };

  const selectAllStaff = () => {
    const filteredStaff = formData.targetAudience === 'pcn' 
      ? staffList.filter(s => s.type === 'pcn')
      : formData.targetAudience === 'non-pcn'
      ? staffList.filter(s => s.type === 'non-pcn')
      : staffList;
    
    setFormData(prev => ({
      ...prev,
      selectedStaff: filteredStaff.map(s => s.id)
    }));
  };

  const clearAllStaff = () => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: []
    }));
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      author: 'Sarah Mitchell',
      targetAudience: 'all',
      selectedStaff: [],
      selectedPCNs: [],
      sendEmail: false,
      scheduleFor: '',
      attachments: []
    });
    setEditingAnnouncement(null);
    setShowAddModal(true);
  };

  const openEditModal = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      author: announcement.author,
      targetAudience: announcement.targetAudience || 'all',
      selectedStaff: [],
      selectedPCNs: [],
      sendEmail: announcement.emailSent || false,
      scheduleFor: '',
      attachments: []
    });
    setEditingAnnouncement(announcement);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingAnnouncement(null);
    setShowStaffSelector(false);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      author: 'Sarah Mitchell',
      targetAudience: 'all',
      selectedStaff: [],
      selectedPCNs: [],
      sendEmail: false,
      scheduleFor: '',
      attachments: []
    });
  };

  const handleSaveAnnouncement = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields!');
      return;
    }

    if (formData.targetAudience === 'specific-staff' && formData.selectedStaff.length === 0) {
      alert('Please select at least one staff member!');
      return;
    }

    if (formData.targetAudience === 'specific-pcn' && formData.selectedPCNs.length === 0) {
      alert('Please select at least one PCN!');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let recipientsText = 'All Staff';
    if (formData.targetAudience === 'pcn') {
      recipientsText = 'PCN Staff Only';
    } else if (formData.targetAudience === 'non-pcn') {
      recipientsText = 'Non-PCN Staff Only';
    } else if (formData.targetAudience === 'specific-staff') {
      recipientsText = `${formData.selectedStaff.length} Selected Staff`;
    } else if (formData.targetAudience === 'specific-pcn') {
      recipientsText = `${formData.selectedPCNs.length} Selected PCN(s)`;
    }

    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(ann => 
        ann.id === editingAnnouncement.id 
          ? {
              ...ann,
              title: formData.title,
              message: formData.message,
              type: formData.type,
              priority: formData.priority,
              author: formData.author,
              targetAudience: formData.targetAudience,
              emailSent: formData.sendEmail,
              recipients: recipientsText,
              date: dateStr,
              time: timeStr
            }
          : ann
      ));
      
      if (formData.sendEmail) {
        alert(`Announcement updated & email sent to ${recipientsText}! ✅📧`);
      } else {
        alert('Announcement updated successfully! ✅');
      }
    } else {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        priority: formData.priority,
        author: formData.author,
        date: formData.scheduleFor || dateStr,
        time: timeStr,
        views: 0,
        status: formData.scheduleFor ? 'scheduled' : 'active',
        targetAudience: formData.targetAudience,
        emailSent: formData.sendEmail,
        recipients: recipientsText
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      
      if (formData.sendEmail) {
        alert(`Announcement created & email sent to ${recipientsText}! ✅📧`);
      } else {
        alert('Announcement created successfully! ✅');
      }
    }

    closeModal();
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      alert('Announcement deleted successfully! 🗑️');
    }
  };

  const handleSendEmail = (announcement) => {
    if (window.confirm(`Send email notification for "${announcement.title}" to ${announcement.recipients}?`)) {
      setAnnouncements(prev => prev.map(ann =>
        ann.id === announcement.id ? { ...ann, emailSent: true } : ann
      ));
      alert(`Email sent successfully to ${announcement.recipients}! 📧`);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || announcement.priority === selectedPriority;
    const matchesAudience = selectedAudience === 'all' || announcement.targetAudience === selectedAudience;
    
    return matchesSearch && matchesType && matchesPriority && matchesAudience;
  });

  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.status === 'active').length,
    urgent: announcements.filter(a => a.priority === 'urgent').length,
    thisWeek: announcements.filter(a => new Date(a.date) > new Date(Date.now() - 7*24*60*60*1000)).length
  };

  return (
    <div className="space-y-6  bg-primary min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Megaphone size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Announcements</h1>
            <p className="text-sm text-text-secondary">Manage and broadcast announcements to staff</p>
          </div>
        </div>
        <div className="flex gap-3">
          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary/80 text-text-secondary border border-border rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
            >
              <Download size={18} />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-secondary rounded-xl shadow-xl border border-border overflow-hidden z-50">
                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/80 transition-colors text-left"
                >
                  <FileText size={18} className="text-green-600" />
                  <div>
                    <div className="font-medium text-text-primary">Export to CSV</div>
                    <div className="text-xs text-text-secondary">Comma-separated values</div>
                  </div>
                </button>
                
                <button
                  onClick={exportToExcel}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/80 transition-colors text-left border-t border-border"
                >
                  <FileSpreadsheet size={18} className="text-emerald-600" />
                  <div>
                    <div className="font-medium text-text-primary">Export to Excel</div>
                    <div className="text-xs text-text-secondary">Microsoft Excel format</div>
                  </div>
                </button>
                
                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/80 transition-colors text-left border-t border-border"
                >
                  <FileDown size={18} className="text-rose-600" />
                  <div>
                    <div className="font-medium text-text-primary">Export to PDF</div>
                    <div className="text-xs text-text-secondary">Portable document format</div>
                  </div>
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            New Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-text-secondary">Total Announcements</div>
            <div className="w-10 h-10 bg-core-primary-50 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-core-primary-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.total}</div>
          <div className="text-xs text-text-muted mt-1">All time</div>
        </div>

        <div className="bg-secondary rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-text-secondary">Active</div>
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.active}</div>
          <div className="text-xs text-text-muted mt-1">Currently active</div>
        </div>

        <div className="bg-secondary rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-text-secondary">Urgent</div>
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.urgent}</div>
          <div className="text-xs text-text-muted mt-1">Needs attention</div>
        </div>

        <div className="bg-secondary rounded-2xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-text-secondary">This Week</div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.thisWeek}</div>
          <div className="text-xs text-text-muted mt-1">Last 7 days</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-secondary rounded-2xl shadow-sm border border-border p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-11 pr-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-core-primary-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-core-primary-500 focus:border-transparent text-text-primary transition-all"
          >
            <option value="all">All Types</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Critical</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-core-primary-500 focus:border-transparent text-text-primary transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-core-primary-500 focus:border-transparent text-text-primary transition-all"
          >
            <option value="all">All Audiences</option>
            <option value="pcn">PCN Staff Only</option>
            <option value="non-pcn">Non-PCN Staff</option>
            <option value="specific-staff">Specific Staff</option>
            <option value="specific-pcn">Specific PCNs</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-secondary rounded-2xl border border-border p-16 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Announcements Found</h3>
            <p className="text-text-secondary">Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const styles = getTypeStyles(announcement.type);
            const icon = getTypeIcon(announcement.type);
            
            return (
              <div 
                key={announcement.id}
                className="bg-secondary rounded-2xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${styles.iconBg} rounded-xl flex items-center justify-center ${styles.icon} shrink-0`}>
                      {icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-text-primary">{announcement.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getPriorityBadge(announcement.priority)} shadow-sm`}>
                              {announcement.priority.toUpperCase()}
                            </span>
                            {announcement.status === 'scheduled' && (
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                                SCHEDULED
                              </span>
                            )}
                            {announcement.emailSent && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                                <Mail size={12} />
                                EMAIL SENT
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed mb-2">{announcement.message}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                              <Users size={12} />
                              <span>{announcement.recipients}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1.5">
                          <User size={14} />
                          <span className="font-medium">{announcement.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{announcement.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{announcement.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span>{announcement.views} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!announcement.emailSent && (
                        <button 
                          onClick={() => handleSendEmail(announcement)}
                          className="p-2.5 hover:bg-primary rounded-xl transition-colors text-text-secondary hover:text-green-600"
                          title="Send Email"
                        >
                          <Send size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => openEditModal(announcement)}
                        className="p-2.5 hover:bg-primary rounded-xl transition-colors text-text-secondary hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="p-2.5 hover:bg-primary rounded-xl transition-colors text-text-secondary hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-secondary rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSaveAnnouncement}>
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">
                  {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button 
                  type="button"
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter announcement title..."
                    className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter announcement message..."
                    rows={6}
                    className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary placeholder-text-muted resize-none transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary transition-all"
                      required
                    >
                      <option value="info">Information</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Priority <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary transition-all"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Target Audience <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary transition-all"
                    required
                  >
                    <option value="all">All Staff</option>
                    <option value="pcn">PCN Staff Only</option>
                    <option value="non-pcn">Non-PCN Staff Only</option>
                    <option value="specific-staff">Specific Staff Members</option>
                    <option value="specific-pcn">Specific PCNs</option>
                  </select>
                </div>

                {formData.targetAudience === 'specific-staff' && (
                  <div className="bg-primary rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-text-primary">Select Staff Members</h4>
                        <p className="text-xs text-text-secondary mt-1">
                          {formData.selectedStaff.length} staff member(s) selected
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={selectAllStaff}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={clearAllStaff}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {staffList.map((staff) => (
                        <label
                          key={staff.id}
                          className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedStaff.includes(staff.id)}
                            onChange={() => toggleStaffSelection(staff.id)}
                            className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-text-primary">{staff.name}</div>
                            <div className="text-xs text-text-secondary">{staff.role} • {staff.pcn}</div>
                          </div>
                          <div className="text-xs text-text-muted">{staff.email}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.targetAudience === 'specific-pcn' && (
                  <div className="bg-primary rounded-xl p-5 border border-border">
                    <div className="mb-4">
                      <h4 className="font-semibold text-text-primary">Select PCNs</h4>
                      <p className="text-xs text-text-secondary mt-1">
                        {formData.selectedPCNs.length} PCN(s) selected
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {pcnList.map((pcn) => (
                        <label
                          key={pcn}
                          className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedPCNs.includes(pcn)}
                            onChange={() => togglePCNSelection(pcn)}
                            className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                          <Building2 size={18} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-medium text-text-primary">{pcn}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Author <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Author name..."
                      className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary placeholder-text-muted transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Schedule For (Optional)
                    </label>
                    <input
                      type="date"
                      name="scheduleFor"
                      value={formData.scheduleFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-primary border border-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-text-primary transition-all"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sendEmail"
                      checked={formData.sendEmail}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-text-primary">Send Email Notification</span>
                    </div>
                  </label>
                  <p className="text-xs text-text-secondary mt-2 ml-8">
                    Email will be sent to selected recipients when announcement is published
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-secondary border-t border-border p-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-primary hover:bg-primary/80 text-text-secondary rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <Save size={18} />
                  {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;