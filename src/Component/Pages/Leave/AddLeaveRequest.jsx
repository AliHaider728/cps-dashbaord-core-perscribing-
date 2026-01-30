import React, { useState } from 'react';
import { ArrowLeft, Save, Plus } from 'lucide-react';

const AddLeaveRequest = ({ leaveData, isEditMode, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    employee: leaveData?.employee || '',
    projectName: leaveData?.projectName || '',
    leaveType: leaveData?.leaveType || '',
    fromDate: leaveData?.fromDate || '',
    toDate: leaveData?.toDate || '',
    startTime: leaveData?.startTime || '',
    endTime: leaveData?.endTime || '',
    noOfHours: leaveData?.hours?.toString() || '',
    additionalInfo: leaveData?.additionalInfo || ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.employee || !formData.projectName || !formData.leaveType || 
        !formData.fromDate || !formData.toDate || !formData.noOfHours) {
      alert('Please fill all required fields!');
      return;
    }

    onSave(formData);
  };

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
            <h2 className="text-2xl font-bold text-primary">
              {isEditMode ? 'Edit Leave Request' : 'Add New Leave Request'}
            </h2>
            <p className="text-sm text-secondary mt-1">Fill in the details below</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          {isEditMode ? <Save size={18} /> : <Plus size={18} />}
          {isEditMode ? 'Update Request' : 'Submit Request'}
        </button>
      </div>

      {/* Form */}
      <div className="bg-primary rounded-xl border border-border p-6">
        <form onSubmit={handleSubmit}>
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employee</option>
                <option>Aamir Mayet</option>
                <option>Aishah Pathan</option>
                <option>Amina Hakim</option>
                <option>SM Badrul Hyder</option>
                <option>John Smith</option>
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {leaveTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Start Time<span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calculate the total number of working hours"
              />
              <p className="text-xs text-secondary mt-1.5">
                [Calculate the total number of working hours leave you have requested - excluding non-working days.]
              </p>
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-primary mb-2">
                Additional Info
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter additional information..."
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveRequest;