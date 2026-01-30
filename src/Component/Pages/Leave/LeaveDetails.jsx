import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, XCircle, Clock, AlertCircle, X, User, Calendar, MapPin, Briefcase, TrendingUp, Users, FileText, MessageSquare, Bell } from 'lucide-react';

const LeaveDetails = ({ leaveData, onBack, onApprove, onReject }) => {
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [coverDetails, setCoverDetails] = useState({
    staffId: '',
    coverType: 'full', // full, partial, split
    shifts: [],
    startTime: '',
    endTime: '',
    specificDates: [],
    notes: '',
    notifyStaff: true,
    urgentCover: false
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [shiftPattern, setShiftPattern] = useState('all-days');
  const [workloadView, setWorkloadView] = useState(false);
  
  const [formData, setFormData] = useState({
    employee: leaveData?.employee || '',
    projectName: leaveData?.projectName || '',
    leaveType: leaveData?.leaveType || '',
    leaveStatus: leaveData?.status || '',
    fromDate: leaveData?.fromDate || '',
    toDate: leaveData?.toDate || '',
    startTime: leaveData?.startTime || '',
    endTime: leaveData?.endTime || '',
    noOfHours: leaveData?.hours?.toString() || '',
    additionalInfo: leaveData?.additionalInfo || '',
    approver: leaveData?.approver || '',
    reason: leaveData?.reason || ''
  });

  // Available staff with detailed information
 const availableStaff = [
  { 
    id: 101, 
    name: 'Dr. Ayesha Khan', 
    role: 'Clinical Pharmacist', 
    availability: 'Full Day Available',
    avatar: 'AK',
    currentWorkload: 52,
    skills: ['Clinical Review', 'Medication Reconciliation', 'Chronic Disease Management'],
    location: 'Islamabad Central PCN',
    shifts: [
      { date: '2026-04-15', time: 'Full Day', status: 'available' },
      { date: '2026-04-16', time: 'Full Day', status: 'available' },
      { date: '2026-04-17', time: 'Full Day', status: 'available' }
    ],
    rating: 4.9,
    completedCovers: 19
  },
  { 
    id: 102, 
    name: 'Bilal Ahmed', 
    role: 'Senior Pharmacist', 
    availability: 'Morning Shift Available',
    avatar: 'BA',
    currentWorkload: 38,
    skills: ['Dispensing', 'Stock Management', 'Patient Counselling'],
    location: 'Rawalpindi Health Hub',
    shifts: [
      { date: '2026-04-15', time: 'AM Only', status: 'available' },
      { date: '2026-04-16', time: 'AM Only', status: 'available' },
      { date: '2026-04-17', time: 'Not Available', status: 'unavailable' }
    ],
    rating: 4.7,
    completedCovers: 14
  },
  { 
    id: 103, 
    name: 'Fatima Noor', 
    role: 'Pharmacy Manager', 
    availability: 'Full Day Available',
    avatar: 'FN',
    currentWorkload: 72,
    skills: ['Team Coordination', 'Compliance & Audit', 'Training & Development'],
    location: 'Lahore PCN Network',
    shifts: [
      { date: '2026-04-15', time: 'Full Day', status: 'available' },
      { date: '2026-04-16', time: 'Full Day', status: 'available' },
      { date: '2026-04-17', time: 'Full Day', status: 'available' }
    ],
    rating: 4.8,
    completedCovers: 34
  },
  { 
    id: 104, 
    name: 'Omar Siddiqui', 
    role: 'Clinical Lead Pharmacist', 
    availability: 'Afternoon Available',
    avatar: 'OS',
    currentWorkload: 68,
    skills: ['Clinical Governance', 'Prescribing Support', 'Quality Improvement'],
    location: 'Karachi Coastal PCN',
    shifts: [
      { date: '2026-04-15', time: 'PM Only', status: 'available' },
      { date: '2026-04-16', time: 'PM Only', status: 'available' },
      { date: '2026-04-17', time: 'Full Day', status: 'available' }
    ],
    rating: 4.6,
    completedCovers: 22
  },
  { 
    id: 105, 
    name: 'Zainab Malik', 
    role: 'Practice Pharmacist', 
    availability: 'Full Day Available',
    avatar: 'ZM',
    currentWorkload: 60,
    skills: ['Medication Review', 'Health Screening', 'Lifestyle Advice'],
    location: 'Peshawar Family Practice',
    shifts: [
      { date: '2026-04-15', time: 'Full Day', status: 'available' },
      { date: '2026-04-16', time: 'Full Day', status: 'available' },
      { date: '2026-04-17', time: 'AM Only', status: 'partially-available' }
    ],
    rating: 4.7,
    completedCovers: 17
  }
];
  const projects = [
    'Select Project',
    'Arc Bucks PCN EA',
    'Clacton PCN',
    'COVER',
    'Richmond General Practice Alliance - The Green & Fir Road Surgery',
    'Richmond General Practice Alliance - The Vineyard Surgery EA'
  ];

  const leaveTypes = [
    'Select Leave Type',
    'Annual Leave (PCN)',
    'Sick Leave',
    'CPPE',
    'Emergency Leave',
    'Unpaid Leave'
  ];

  const shiftOptions = [
    { value: 'full-day', label: 'Full Day (9:00 AM - 5:00 PM)', hours: 8 },
    { value: 'morning', label: 'Morning Shift (9:00 AM - 1:00 PM)', hours: 4 },
    { value: 'afternoon', label: 'Afternoon Shift (1:00 PM - 5:00 PM)', hours: 4 },
    { value: 'custom', label: 'Custom Time Range', hours: 0 }
  ];

  // Generate dates between from and to date
  const generateDateRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt).toISOString().split('T')[0]);
    }
    return dates;
  };

  const leaveDates = formData.fromDate && formData.toDate 
    ? generateDateRange(formData.fromDate, formData.toDate) 
    : [];

  useEffect(() => {
    // Initialize with all dates selected
    if (leaveDates.length > 0) {
      setSelectedDates(leaveDates);
    }
  }, [formData.fromDate, formData.toDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApprove = () => {
    setShowReassignModal(true);
  };

  const handleStaffSelect = (staffId) => {
    setSelectedStaff(staffId);
    setCoverDetails(prev => ({ ...prev, staffId }));
  };

  const handleCoverTypeChange = (type) => {
    setCoverDetails(prev => ({ ...prev, coverType: type }));
  };

  const handleShiftPatternChange = (pattern) => {
    setShiftPattern(pattern);
    
    // Auto-select dates based on pattern
    if (pattern === 'all-days') {
      setSelectedDates(leaveDates);
    } else if (pattern === 'weekdays-only') {
      const weekdays = leaveDates.filter(date => {
        const day = new Date(date).getDay();
        return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
      });
      setSelectedDates(weekdays);
    } else if (pattern === 'alternate-days') {
      const alternateDates = leaveDates.filter((_, index) => index % 2 === 0);
      setSelectedDates(alternateDates);
    }
  };

  const toggleDateSelection = (date) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date].sort()
    );
  };

  const handleConfirmApproval = () => {
    if (!selectedStaff) {
      alert('Please select a staff member to cover this leave!');
      return;
    }

    if (coverDetails.coverType === 'partial' && selectedDates.length === 0) {
      alert('Please select at least one date for partial cover!');
      return;
    }

    if (coverDetails.coverType === 'custom' && (!coverDetails.startTime || !coverDetails.endTime)) {
      alert('Please specify custom time range!');
      return;
    }
    
    const staffMember = availableStaff.find(s => s.id === parseInt(selectedStaff));
    const coverSummary = `
Leave approved successfully!
----------------------------
Cover Staff: ${staffMember.name}
Cover Type: ${coverDetails.coverType.toUpperCase()}
Dates Covered: ${selectedDates.length} day(s)
${coverDetails.startTime && coverDetails.endTime ? `Time: ${coverDetails.startTime} - ${coverDetails.endTime}` : ''}
${coverDetails.notes ? `Notes: ${coverDetails.notes}` : ''}
${coverDetails.notifyStaff ? '\n✓ Staff member will be notified via email' : ''}
    `;
    
    alert(coverSummary);
    setShowReassignModal(false);
    onApprove(leaveData?.id);
  };

  const handleReject = () => {
    if (window.confirm('Are you sure you want to reject this leave request?')) {
      onReject(leaveData?.id);
    }
  };

  const handleSave = () => {
    alert('Leave request saved successfully!');
    onBack();
  };

  const getWorkloadColor = (workload) => {
    if (workload < 50) return 'text-green-600 bg-green-100';
    if (workload < 75) return 'text-amber-600 bg-amber-100';
    return 'text-rose-600 bg-rose-100';
  };

  const selectedStaffMember = availableStaff.find(s => s.id === parseInt(selectedStaff));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-primary" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-primary">Leave Detail</h2>
            <p className="text-sm text-secondary mt-1">View and manage leave request</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Check size={18} />
            Approve
          </button>
          <button
            onClick={handleReject}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <XCircle size={18} />
            Reject
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold mb-2">
              <span className="font-bold">Note:</span> On approved leave if any cover assigned on any date or on am/pm then it will comes in greyed out and save button won't be visible.
            </p>
            <ul className="space-y-1.5 text-sm text-amber-800 dark:text-amber-300">
              <li>• Irrespective of whether your practice needs cover or not, you MUST complete a leave request on the intranet for planned and unplanned leave (e.g. sickness, CPPE, annual leave).</li>
              <li>• Leave will be authorised subject to operational capacity. Planned leave MUST be requested with 6 weeks' notice, unless approved by your line manager.</li>
              <li className="text-rose-600 dark:text-rose-400 font-bold">• Once you have submitted your request, you MUST check your emails to confirm whether your request has been approved or declined.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-primary rounded-xl border border-DEFAULT p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Employee<span className="text-rose-500">*</span>
            </label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            >
              <option>Aamir Mayet</option>
              <option>Aishah Pathan</option>
              <option>Amina Hakim</option>
              <option>SM Badrul Hyder</option>
              <option>John Smith</option>
              <option>Hassan Raza</option>
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Project Name<span className="text-rose-500">*</span>
            </label>
            <select
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            >
              {projects.map((project, idx) => (
                <option key={idx} value={project}>{project}</option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Leave Type<span className="text-rose-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            >
              {leaveTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Leave Status */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Leave Status<span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="leaveStatus"
              value={formData.leaveStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
              placeholder="Enter status"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              From Date [Inclusive]<span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              To Date [Inclusive]<span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Start Time<span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
              />
              <span className="text-xs text-secondary whitespace-nowrap">(HH:MM 24-hour)</span>
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              End Time<span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
            />
          </div>

          {/* No Of Hours */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary mb-2">
              No Of Hours<span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              name="noOfHours"
              value={formData.noOfHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
              placeholder="Calculate the total number of working hours"
            />
            <p className="text-xs text-secondary mt-1.5">
              [Calculate the total number of working hours leave you have requested - excluding non-working days.]
            </p>
          </div>

          {/* Additional Info */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary mb-2">
              Additional Info<span className="text-rose-500">*</span>
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500 resize-none"
              placeholder="Enter additional information..."
            />
          </div>

          {/* Approver */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Approver
            </label>
            <input
              type="text"
              name="approver"
              value={formData.approver}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-secondary/50 border border-DEFAULT rounded-xl text-muted focus:outline-none cursor-not-allowed"
              readOnly
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 bg-secondary border border-DEFAULT rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500 resize-none"
              placeholder="Enter reason for rejection (if applicable)..."
            />
          </div>
        </div>
      </div>

      {/* Advanced Reassign Staff Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-core-primary-600 to-core-primary-700 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Assign Cover Staff</h3>
                  <p className="text-core-primary-100 text-sm">Configure detailed cover assignment with time and date preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowReassignModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Leave Info Summary */}
            <div className="px-6 py-4 bg-core-primary-50 dark:bg-core-primary-950/20 border-b border-DEFAULT shrink-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-secondary font-medium">Employee:</span>
                  <span className="ml-2 text-primary font-semibold">{formData.employee}</span>
                </div>
                <div>
                  <span className="text-secondary font-medium">Leave Type:</span>
                  <span className="ml-2 text-primary font-semibold">{formData.leaveType}</span>
                </div>
                <div>
                  <span className="text-secondary font-medium">From:</span>
                  <span className="ml-2 text-primary font-semibold">{formData.fromDate}</span>
                </div>
                <div>
                  <span className="text-secondary font-medium">To:</span>
                  <span className="ml-2 text-primary font-semibold">{formData.toDate}</span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Left Section - Staff Selection */}
                <div className="lg:col-span-2 space-y-4">
                  {/* View Toggle */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setWorkloadView(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !workloadView 
                          ? 'bg-core-primary-600 text-white' 
                          : 'bg-secondary text-primary hover:bg-secondary/80'
                      }`}
                    >
                      <User size={16} className="inline mr-2" />
                      Staff View
                    </button>
                    <button
                      onClick={() => setWorkloadView(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        workloadView 
                          ? 'bg-core-primary-600 text-white' 
                          : 'bg-secondary text-primary hover:bg-secondary/80'
                      }`}
                    >
                      <TrendingUp size={16} className="inline mr-2" />
                      Workload View
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-primary mb-3">Available Staff Members</h4>
                  <div className="space-y-3">
                    {availableStaff.map((staff) => (
                      <label
                        key={staff.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedStaff === staff.id.toString()
                            ? 'border-core-primary-500 bg-core-primary-50 dark:bg-core-primary-950/30'
                            : 'border-DEFAULT hover:border-core-primary-300 hover:bg-secondary'
                        }`}
                      >
                        <input
                          type="radio"
                          name="staff"
                          value={staff.id}
                          checked={selectedStaff === staff.id.toString()}
                          onChange={(e) => handleStaffSelect(e.target.value)}
                          className="w-5 h-5 text-core-primary-600 mt-1"
                        />
                        <div className="w-12 h-12 bg-gradient-to-br from-core-primary-500 to-core-primary-700 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                          {staff.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="font-semibold text-primary">{staff.name}</div>
                              <div className="text-sm text-secondary">{staff.role}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${getWorkloadColor(staff.currentWorkload)}`}>
                                {staff.currentWorkload}% Load
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                <span className="text-sm font-semibold">{staff.rating}</span>
                                <span className="text-xs">★</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <MapPin size={12} className="text-muted" />
                            <span className="text-xs text-secondary">{staff.location}</span>
                            <span className="text-muted mx-1">•</span>
                            <Briefcase size={12} className="text-muted" />
                            <span className="text-xs text-secondary">{staff.completedCovers} covers</span>
                          </div>

                          {workloadView && (
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {staff.skills.map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-core-primary-100 dark:bg-core-primary-900/50 text-core-primary-700 dark:text-core-primary-300 rounded-md text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <div className="space-y-1">
                                {staff.shifts.map((shift, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs">
                                    <span className="text-secondary">{shift.date}</span>
                                    <span className={`px-2 py-0.5 rounded ${
                                      shift.status === 'available' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                      shift.status === 'partially-available' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                      'bg-secondary text-muted'
                                    }`}>
                                      {shift.time}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {!workloadView && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-green-600 dark:text-green-500" />
                              <span className="text-xs text-green-600 dark:text-green-500 font-medium">{staff.availability}</span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right Section - Cover Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary">Cover Configuration</h4>

                  {/* Cover Type Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">
                      Cover Type<span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'full', label: 'Full Coverage', desc: 'All dates and times' },
                        { value: 'partial', label: 'Partial Coverage', desc: 'Selected dates only' },
                        { value: 'split', label: 'Split Coverage', desc: 'Multiple staff members' }
                      ].map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            coverDetails.coverType === type.value
                              ? 'border-core-primary-500 bg-core-primary-50 dark:bg-core-primary-950/30'
                              : 'border-DEFAULT hover:border-DEFAULT/60'
                          }`}
                        >
                          <input
                            type="radio"
                            name="coverType"
                            value={type.value}
                            checked={coverDetails.coverType === type.value}
                            onChange={(e) => handleCoverTypeChange(e.target.value)}
                            className="w-4 h-4 text-core-primary-600 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-primary">{type.label}</div>
                            <div className="text-xs text-secondary">{type.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Shift Pattern (for partial coverage) */}
                  {coverDetails.coverType === 'partial' && (
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-2">
                        Quick Select Pattern
                      </label>
                      <select
                        value={shiftPattern}
                        onChange={(e) => handleShiftPatternChange(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary border border-DEFAULT rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                      >
                        <option value="all-days">All Days</option>
                        <option value="weekdays-only">Weekdays Only</option>
                        <option value="alternate-days">Alternate Days</option>
                        <option value="custom">Custom Selection</option>
                      </select>
                    </div>
                  )}

                  {/* Date Selection */}
                  {coverDetails.coverType === 'partial' && (
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-2">
                        Select Dates to Cover ({selectedDates.length} selected)
                      </label>
                      <div className="max-h-48 overflow-y-auto bg-secondary rounded-lg p-2 space-y-1">
                        {leaveDates.map((date) => (
                          <label
                            key={date}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                              selectedDates.includes(date)
                                ? 'bg-core-primary-100 dark:bg-core-primary-900/30 text-core-primary-900 dark:text-core-primary-200'
                                : 'hover:bg-secondary/80'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedDates.includes(date)}
                              onChange={() => toggleDateSelection(date)}
                              className="w-4 h-4 text-core-primary-600"
                            />
                            <span className="text-sm text-primary">
                              {new Date(date).toLocaleDateString('en-GB', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Time Range Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">
                      Shift Timing
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-secondary border border-DEFAULT rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500 mb-2"
                      onChange={(e) => {
                        const selected = shiftOptions.find(s => s.value === e.target.value);
                        if (selected?.value === 'full-day') {
                          setCoverDetails(prev => ({ ...prev, startTime: '09:00', endTime: '17:00' }));
                        } else if (selected?.value === 'morning') {
                          setCoverDetails(prev => ({ ...prev, startTime: '09:00', endTime: '13:00' }));
                        } else if (selected?.value === 'afternoon') {
                          setCoverDetails(prev => ({ ...prev, startTime: '13:00', endTime: '17:00' }));
                        }
                      }}
                    >
                      {shiftOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-secondary mb-1">Start Time</label>
                        <input
                          type="time"
                          value={coverDetails.startTime}
                          onChange={(e) => setCoverDetails(prev => ({ ...prev, startTime: e.target.value }))}
                          className="w-full px-3 py-2 bg-secondary border border-DEFAULT rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-secondary mb-1">End Time</label>
                        <input
                          type="time"
                          value={coverDetails.endTime}
                          onChange={(e) => setCoverDetails(prev => ({ ...prev, endTime: e.target.value }))}
                          className="w-full px-3 py-2 bg-secondary border border-DEFAULT rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coverDetails.urgentCover}
                        onChange={(e) => setCoverDetails(prev => ({ ...prev, urgentCover: e.target.checked }))}
                        className="w-4 h-4 text-rose-600"
                      />
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} className="text-rose-600 dark:text-rose-500" />
                        <span className="text-sm text-primary">Mark as urgent cover</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coverDetails.notifyStaff}
                        onChange={(e) => setCoverDetails(prev => ({ ...prev, notifyStaff: e.target.checked }))}
                        className="w-4 h-4 text-core-primary-600"
                      />
                      <div className="flex items-center gap-1">
                        <Bell size={14} className="text-core-primary-600 dark:text-core-primary-500" />
                        <span className="text-sm text-primary">Send email notification</span>
                      </div>
                    </label>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-2">
                      <MessageSquare size={14} className="inline mr-1" />
                      Additional Notes
                    </label>
                    <textarea
                      value={coverDetails.notes}
                      onChange={(e) => setCoverDetails(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-secondary border border-DEFAULT rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500 resize-none"
                      placeholder="Any special instructions or requirements..."
                    />
                  </div>

                  {/* Selected Staff Summary */}
                  {selectedStaffMember && (
                    <div className="bg-gradient-to-br from-core-primary-50 to-core-primary-100 dark:from-core-primary-950/30 dark:to-core-primary-900/30 rounded-lg p-4 border border-core-primary-200 dark:border-core-primary-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-core-primary-500 to-core-primary-700 rounded-lg flex items-center justify-center text-white font-bold">
                          {selectedStaffMember.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-primary">{selectedStaffMember.name}</div>
                          <div className="text-xs text-secondary">{selectedStaffMember.role}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-secondary">Current Workload:</span>
                          <span className={`font-semibold ${selectedStaffMember.currentWorkload > 75 ? 'text-rose-600 dark:text-rose-500' : 'text-green-600 dark:text-green-500'}`}>
                            {selectedStaffMember.currentWorkload}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Rating:</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-500">{selectedStaffMember.rating} ★</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary">Completed Covers:</span>
                          <span className="font-semibold text-core-primary-600 dark:text-core-primary-400">{selectedStaffMember.completedCovers}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-secondary border-t border-DEFAULT flex items-center justify-between shrink-0">
              <div className="text-sm text-secondary">
                {selectedStaffMember ? (
                  <span className="flex items-center gap-2">
                    <Check size={16} className="text-green-600 dark:text-green-500" />
                    <span className="text-primary"><strong>{selectedStaffMember.name}</strong> selected for cover</span>
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-500">Please select a staff member</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowReassignModal(false)}
                  className="px-4 py-2.5 border border-DEFAULT rounded-xl text-primary hover:bg-secondary/80 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={!selectedStaff}
                  className={`px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-colors font-medium shadow-lg ${
                    !selectedStaff ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Check size={18} className="inline mr-2" />
                  Approve & Assign Cover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;