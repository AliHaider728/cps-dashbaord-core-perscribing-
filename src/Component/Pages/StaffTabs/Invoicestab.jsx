import React, { useState } from 'react';
import { DollarSign, Plus, Edit2, Trash2, Download, Search, Eye, Send, Check, X, Save, FileText, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

const InvoicesTab = ({ staffData }) => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-2026-001',
      date: '2026-01-25',
      dueDate: '2026-02-08',
      amount: 3240.00,
      hours: 72,
      rate: 45.00,
      status: 'Paid',
      project: 'PCN Clinical Work',
      practice: 'Abbey Medical Practice',
      paidDate: '2026-02-05',
      paymentMethod: 'Bank Transfer',
      notes: 'January services rendered'
    },
    {
      id: 2,
      invoiceNumber: 'INV-2026-002',
      date: '2026-01-20',
      dueDate: '2026-02-03',
      amount: 2700.00,
      hours: 60,
      rate: 45.00,
      status: 'Pending',
      project: 'PCN Clinical Work',
      practice: 'Devon Square Surgery',
      paidDate: null,
      paymentMethod: null,
      notes: 'Awaiting approval'
    },
    {
      id: 3,
      invoiceNumber: 'INV-2026-003',
      date: '2026-01-15',
      dueDate: '2026-01-29',
      amount: 1800.00,
      hours: 40,
      rate: 45.00,
      status: 'Overdue',
      project: 'Emergency Cover',
      practice: 'Lawson Road Surgery',
      paidDate: null,
      paymentMethod: null,
      notes: 'Payment delayed'
    },
    {
      id: 4,
      invoiceNumber: 'INV-2026-004',
      date: '2026-01-10',
      dueDate: '2026-01-24',
      amount: 2160.00,
      hours: 48,
      rate: 45.00,
      status: 'Paid',
      project: 'PCN Clinical Work',
      practice: 'Oak Street Medical Practice',
      paidDate: '2026-01-22',
      paymentMethod: 'Bank Transfer',
      notes: 'Early payment received'
    },
    {
      id: 5,
      invoiceNumber: 'INV-2026-005',
      date: '2026-01-05',
      dueDate: '2026-01-19',
      amount: 1350.00,
      hours: 30,
      rate: 45.00,
      status: 'Cancelled',
      project: 'PCN Clinical Work',
      practice: 'Abbey Medical Practice',
      paidDate: null,
      paymentMethod: null,
      notes: 'Services not provided due to staff illness'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    date: '',
    dueDate: '',
    hours: '',
    rate: '45.00',
    project: 'PCN Clinical Work',
    practice: '',
    notes: ''
  });

  const statuses = ['All', 'Pending', 'Paid', 'Overdue', 'Cancelled'];
  const projects = ['PCN Clinical Work', 'Emergency Cover', 'Annual Leave', 'Non-Clinical', 'Training'];
  const practices = ['Abbey Medical Practice', 'Devon Square Surgery', 'Lawson Road Surgery', 'Oak Street Medical Practice'];

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Calculate total amount
  const calculateAmount = (hours, rate) => {
    return (parseFloat(hours || 0) * parseFloat(rate || 0)).toFixed(2);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.practice.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const maxNum = Math.max(...invoices.map(inv => {
      const match = inv.invoiceNumber.match(/INV-\d{4}-(\d{3})/);
      return match ? parseInt(match[1]) : 0;
    }), 0);
    return `INV-${year}-${String(maxNum + 1).padStart(3, '0')}`;
  };

  // Add new invoice
  const handleAdd = () => {
    if (!formData.date || !formData.dueDate || !formData.hours || !formData.practice) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(calculateAmount(formData.hours, formData.rate));
    const newInvoice = {
      id: Math.max(...invoices.map(inv => inv.id), 0) + 1,
      invoiceNumber: generateInvoiceNumber(),
      date: formData.date,
      dueDate: formData.dueDate,
      amount: amount,
      hours: parseFloat(formData.hours),
      rate: parseFloat(formData.rate),
      status: 'Pending',
      project: formData.project,
      practice: formData.practice,
      paidDate: null,
      paymentMethod: null,
      notes: formData.notes
    };

    setInvoices([newInvoice, ...invoices]);
    resetForm();
  };

  // Update invoice
  const handleUpdate = () => {
    if (!formData.date || !formData.dueDate || !formData.hours || !formData.practice) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(calculateAmount(formData.hours, formData.rate));
    setInvoices(invoices.map(invoice =>
      invoice.id === editingInvoice.id
        ? {
            ...invoice,
            date: formData.date,
            dueDate: formData.dueDate,
            amount: amount,
            hours: parseFloat(formData.hours),
            rate: parseFloat(formData.rate),
            project: formData.project,
            practice: formData.practice,
            notes: formData.notes
          }
        : invoice
    ));
    resetForm();
  };

  // Delete invoice
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    }
  };

  // Edit invoice
  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate,
      hours: invoice.hours.toString(),
      rate: invoice.rate.toString(),
      project: invoice.project,
      practice: invoice.practice,
      notes: invoice.notes
    });
    setShowModal(true);
  };

  // View invoice details
  const handleView = (invoice) => {
    setViewingInvoice(invoice);
    setShowViewModal(true);
  };

  // Mark as paid
  const handleMarkAsPaid = (id) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id
        ? {
            ...invoice,
            status: 'Paid',
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Bank Transfer'
          }
        : invoice
    ));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      date: '',
      dueDate: '',
      hours: '',
      rate: '45.00',
      project: 'PCN Clinical Work',
      practice: '',
      notes: ''
    });
    setEditingInvoice(null);
    setShowModal(false);
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = invoices.map(invoice => ({
      'Invoice Number': invoice.invoiceNumber,
      'Date': invoice.date,
      'Due Date': invoice.dueDate,
      'Project': invoice.project,
      'Practice': invoice.practice,
      'Hours': invoice.hours,
      'Rate': `£${invoice.rate}`,
      'Amount': `£${invoice.amount}`,
      'Status': invoice.status,
      'Paid Date': invoice.paidDate || 'N/A',
      'Payment Method': invoice.paymentMethod || 'N/A',
      'Notes': invoice.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    
    ws['!cols'] = [
      { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 25 },
      { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
      { wch: 15 }, { wch: 30 }
    ];

    XLSX.writeFile(wb, `${staffData?.name || 'Staff'}_Invoices.xlsx`);
  };

  // Calculate statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'Paid').length,
    pending: invoices.filter(inv => inv.status === 'Pending').length,
    overdue: invoices.filter(inv => inv.status === 'Overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paidAmount: invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Invoice Management</h2>
          <p className="text-secondary text-sm mt-1">Manage staff invoices and payments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
          >
            <Download size={16} />
            <span className="font-medium">Export</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span className="font-medium">Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-primary rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-core-primary-500">£{stats.totalAmount.toFixed(2)}</div>
          <div className="text-sm text-secondary mt-1">Total Amount</div>
          <div className="text-xs text-muted mt-1">{stats.total} invoices</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">£{stats.paidAmount.toFixed(2)}</div>
          <div className="text-sm text-green-700 mt-1">Paid</div>
          <div className="text-xs text-green-600 mt-1">{stats.paid} invoices</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-yellow-600">£{stats.pendingAmount.toFixed(2)}</div>
          <div className="text-sm text-yellow-700 mt-1">Outstanding</div>
          <div className="text-xs text-yellow-600 mt-1">{stats.pending + stats.overdue} invoices</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-red-700 mt-1">Overdue</div>
          <div className="text-xs text-red-600 mt-1">Needs attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by invoice number, project, or practice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
          ))}
        </select>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <div className="bg-primary rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-core-primary-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Invoice #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Project</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-core-primary-50/30 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-core-primary-500" />
                        <span className="font-medium text-primary">{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-secondary">{invoice.date}</td>
                    <td className="px-4 py-3 text-secondary">{invoice.dueDate}</td>
                    <td className="px-4 py-3 text-secondary">{invoice.project}</td>
                    <td className="px-4 py-3 text-secondary">{invoice.hours}h</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">£{invoice.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(invoice)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {invoice.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Mark as Paid"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="p-2 text-core-primary-500 hover:bg-core-primary-50 rounded-lg transition-all duration-200"
                          title="Edit Invoice"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Invoice"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-primary rounded-xl border border-border p-12 text-center">
          <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="text-core-primary-500" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">No Invoices Found</h3>
          <p className="text-secondary mb-6">
            {searchTerm || filterStatus !== 'All' 
              ? 'No invoices match your search criteria' 
              : 'No invoices found for this staff member'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200"
          >
            Create First Invoice
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-primary rounded-lg transition-colors">
                <X size={20} className="text-secondary" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  >
                    {projects.map(proj => (
                      <option key={proj} value={proj}>{proj}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Practice <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.practice}
                    onChange={(e) => setFormData({ ...formData, practice: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  >
                    <option value="">Select Practice</option>
                    {practices.map(prac => (
                      <option key={prac} value={prac}>{prac}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Hours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="0.0"
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Hourly Rate (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
              </div>

              {formData.hours && formData.rate && (
                <div className="bg-core-primary-50 border border-core-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-core-primary-700">Total Amount:</span>
                    <span className="text-2xl font-bold text-core-primary-600">
                      £{calculateAmount(formData.hours, formData.rate)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-secondary border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 hover:border-core-primary-500 transition-all duration-200"
              >
                <X size={18} />
                <span className="font-medium">Cancel</span>
              </button>
              <button
                onClick={editingInvoice ? handleUpdate : handleAdd}
                className="flex items-center gap-2 px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200 shadow-sm"
              >
                <Save size={18} />
                <span className="font-medium">{editingInvoice ? 'Update' : 'Create'} Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary rounded-xl shadow-xl max-w-2xl w-full">
            <div className="bg-core-primary-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Invoice Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-primary rounded-lg transition-colors">
                <X size={20} className="text-secondary" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center pb-4 border-b border-border">
                <div className="text-3xl font-bold text-core-primary-500 mb-2">
                  {viewingInvoice.invoiceNumber}
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(viewingInvoice.status)}`}>
                  {viewingInvoice.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted mb-1">Invoice Date</div>
                  <div className="font-medium text-primary">{viewingInvoice.date}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Due Date</div>
                  <div className="font-medium text-primary">{viewingInvoice.dueDate}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Project</div>
                  <div className="font-medium text-primary">{viewingInvoice.project}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Practice</div>
                  <div className="font-medium text-primary">{viewingInvoice.practice}</div>
                </div>
              </div>

              <div className="bg-core-primary-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary">Hours:</span>
                  <span className="font-medium text-primary">{viewingInvoice.hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Rate:</span>
                  <span className="font-medium text-primary">£{viewingInvoice.rate}/hour</span>
                </div>
                <div className="border-t border-core-primary-200 pt-2 flex justify-between">
                  <span className="font-semibold text-primary">Total Amount:</span>
                  <span className="text-2xl font-bold text-core-primary-600">£{viewingInvoice.amount.toFixed(2)}</span>
                </div>
              </div>

              {viewingInvoice.paidDate && (
                <div className="bg-green-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Paid Date:</span>
                    <span className="font-medium text-green-800">{viewingInvoice.paidDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment Method:</span>
                    <span className="font-medium text-green-800">{viewingInvoice.paymentMethod}</span>
                  </div>
                </div>
              )}

              {viewingInvoice.notes && (
                <div>
                  <div className="text-xs text-muted mb-2">Notes</div>
                  <div className="text-primary bg-primary border border-border rounded-lg p-3">
                    {viewingInvoice.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-primary border border-border rounded-lg text-secondary hover:bg-core-primary-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Send size={16} className="inline mr-2" />
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesTab;