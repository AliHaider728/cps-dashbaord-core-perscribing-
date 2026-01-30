import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Send,
  Eye,
  Filter,
  Search,
  X,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Mail,
  Printer,
  MoreVertical,
  TrendingUp,
  Users,
  CreditCard,
  ArrowLeft,
  Save,
  Building2,
  User,
  Hash,
  Phone,
  MapPin,
  ChevronDown
} from 'lucide-react';

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Modals & Forms
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Invoice Data State
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2024-001',
      client: 'ARC Bucks PCN',
      clientType: 'PCN',
      clientEmail: 'contact@arcbucks.nhs.uk',
      clientPhone: '+44 1234 567890',
      clientAddress: '123 Healthcare Street, Buckinghamshire, HP12 3AB',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 2450.00,
      status: 'paid',
      items: [
        { description: 'Clinical Pharmacist Services - January', quantity: 131, rate: 18.70, amount: 2449.70 }
      ],
      notes: 'Payment received via bank transfer',
      taxRate: 20,
      paidDate: '2024-02-10'
    },
    {
      id: 'INV-2024-002',
      client: 'Abbey Medical Practice',
      clientType: 'Practice',
      clientEmail: 'admin@abbeymedical.co.uk',
      clientPhone: '+44 1234 567891',
      clientAddress: '45 Medical Centre, London, NW1 2AB',
      date: '2024-01-20',
      dueDate: '2024-02-20',
      amount: 850.00,
      status: 'pending',
      items: [
        { description: 'Pharmacy Support Services', quantity: 42.5, rate: 20.00, amount: 850.00 }
      ],
      notes: 'Awaiting payment',
      taxRate: 20
    },
    {
      id: 'INV-2024-003',
      client: 'Southampton West PCN',
      clientType: 'PCN',
      clientEmail: 'finance@southamptonwest.nhs.uk',
      clientPhone: '+44 2380 123456',
      clientAddress: '78 West Road, Southampton, SO15 2JY',
      date: '2024-01-25',
      dueDate: '2024-02-25',
      amount: 6260.00,
      status: 'sent',
      items: [
        { description: 'Clinical Services - January', quantity: 300, rate: 18.50, amount: 5550.00 },
        { description: 'Additional Consultation Hours', quantity: 50, rate: 14.20, amount: 710.00 }
      ],
      notes: 'Invoice sent via email',
      taxRate: 20
    },
    {
      id: 'INV-2024-004',
      client: 'High Weald PCN',
      clientType: 'PCN',
      clientEmail: 'accounts@highweald.nhs.uk',
      clientPhone: '+44 1892 234567',
      clientAddress: '12 Weald Avenue, Kent, TN3 9EE',
      date: '2024-02-01',
      dueDate: '2024-03-01',
      amount: 6378.00,
      status: 'overdue',
      items: [
        { description: 'Prescribing Support Services', quantity: 637.8, rate: 10.00, amount: 6378.00 }
      ],
      notes: 'Payment overdue - follow up required',
      taxRate: 20
    }
  ]);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    client: '',
    clientType: 'PCN',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'draft',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    taxRate: 20
  });

  const statusConfig = {
    paid: { 
      label: 'Paid', 
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50',
      icon: CheckCircle,
      dotColor: 'bg-emerald-500'
    },
    pending: { 
      label: 'Pending', 
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50',
      icon: Clock,
      dotColor: 'bg-amber-500'
    },
    sent: { 
      label: 'Sent', 
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/50',
      icon: Send,
      dotColor: 'bg-blue-500'
    },
    overdue: { 
      label: 'Overdue', 
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/50',
      icon: AlertCircle,
      dotColor: 'bg-rose-500'
    },
    draft: { 
      label: 'Draft', 
      color: 'text-secondary bg-primary/50 border-border',
      icon: Edit,
      dotColor: 'bg-gray-500 dark:bg-slate-500'
    }
  };

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    if (clientFilter !== 'all') {
      filtered = filtered.filter(inv => inv.clientType.toLowerCase() === clientFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(inv => {
        const invDate = new Date(inv.date);
        const diffDays = Math.floor((now - invDate) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === '7days') return diffDays <= 7;
        if (dateFilter === '30days') return diffDays <= 30;
        if (dateFilter === '90days') return diffDays <= 90;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.id.toLowerCase().includes(query) ||
        inv.client.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [invoices, statusFilter, clientFilter, dateFilter, searchQuery]);

  const statistics = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pending = invoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

    return {
      total: total.toFixed(2),
      paid: paid.toFixed(2),
      pending: pending.toFixed(2),
      overdue: overdue.toFixed(2),
      count: invoices.length
    };
  }, [invoices]);

  // Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setClientFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // View Invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalOpen(true);
    setActiveDropdown(null);
  };

  // Add Invoice
  const handleAddInvoice = () => {
    setIsEditMode(false);
    setFormData({
      client: '',
      clientType: 'PCN',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'draft',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
      taxRate: 20
    });
    setAddEditModalOpen(true);
  };

  // Edit Invoice
  const handleEditInvoice = (invoice) => {
    setIsEditMode(true);
    setSelectedInvoice(invoice);
    setFormData({
      client: invoice.client,
      clientType: invoice.clientType,
      clientEmail: invoice.clientEmail,
      clientPhone: invoice.clientPhone,
      clientAddress: invoice.clientAddress,
      date: invoice.date,
      dueDate: invoice.dueDate,
      status: invoice.status,
      items: invoice.items,
      notes: invoice.notes,
      taxRate: invoice.taxRate
    });
    setAddEditModalOpen(true);
    setActiveDropdown(null);
  };

  // Delete Invoice
  const handleDeleteInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteConfirmOpen(true);
    setActiveDropdown(null);
  };

  const confirmDelete = () => {
    setInvoices(prev => prev.filter(inv => inv.id !== selectedInvoice.id));
    setDeleteConfirmOpen(false);
    setSelectedInvoice(null);
  };

  // Save Invoice (Add/Edit)
  const handleSaveInvoice = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (formData.taxRate / 100);
    const total = subtotal + tax;

    if (isEditMode) {
      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, ...formData, amount: total }
          : inv
      ));
    } else {
      const newInvoice = {
        id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        ...formData,
        amount: total
      };
      setInvoices(prev => [...prev, newInvoice]);
    }
    
    setAddEditModalOpen(false);
    setSelectedInvoice(null);
  };

  // Form handlers
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (formData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            Invoices
          </h1>
          <p className="text-sm text-secondary mt-1">
            Manage and track all your invoices
          </p>
        </div>
        <button 
          onClick={handleAddInvoice}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-core-primary-600 to-core-primary-700 text-white rounded-xl hover:from-core-primary-700 hover:to-core-primary-800 transition-all shadow-lg shadow-core-primary-500/20 text-sm font-semibold whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-100 border border-core-primary-200 dark:border-core-primary-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-core-primary-700 dark:text-core-primary-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-lg bg-core-primary-100 dark:bg-core-primary-900/50">
              <DollarSign size={18} className="text-core-primary-600 dark:text-core-primary-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {formatCurrency(statistics.total)}
          </div>
          <div className="text-xs text-secondary">
            {statistics.count} invoices
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Paid
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {formatCurrency(statistics.paid)}
          </div>
          <div className="text-xs text-secondary">
            Received
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-200 dark:border-amber-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
              <Clock size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {formatCurrency(statistics.pending)}
          </div>
          <div className="text-xs text-secondary">
            Awaiting payment
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-200 dark:border-rose-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Overdue
            </span>
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
            {formatCurrency(statistics.overdue)}
          </div>
          <div className="text-xs text-secondary">
            Past due date
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-secondary border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice ID or client name..."
                className="w-full pl-10 pr-10 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-lg sm:rounded-xl text-secondary hover:text-primary hover:bg-core-primary-50/50 dark:hover:bg-core-primary-900/30 transition-all font-medium"
          >
            <Filter size={18} />
            <span>Filters</span>
            {(statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all') && (
              <span className="w-2 h-2 bg-core-primary-600 rounded-full"></span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">All Clients</option>
              <option value="pcn">PCN</option>
              <option value="practice">Practice</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all font-medium"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>

            {(statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-lg sm:rounded-xl text-secondary hover:text-primary hover:bg-core-primary-50/50 dark:hover:bg-core-primary-900/30 transition-all font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="lg:hidden mt-3 pt-3 border-t border-border space-y-3">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Client Type</label>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Clients</option>
                <option value="pcn">PCN</option>
                <option value="practice">Practice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-primary border border-border rounded-lg sm:rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>

            {(statusFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2.5 bg-primary border border-border rounded-xl text-secondary hover:text-primary hover:bg-core-primary-50/50 dark:hover:bg-core-primary-900/30 transition-all font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="bg-core-primary-50 dark:bg-core-primary-950/30 border border-core-primary-200 dark:border-core-primary-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm font-semibold text-core-primary-900 dark:text-core-primary-300">
              {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary border border-border text-primary hover:bg-primary/80 rounded-lg sm:rounded-xl transition-all font-medium text-sm">
                <Send size={16} />
                <span>Send</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary border border-border text-primary hover:bg-primary/80 rounded-lg sm:rounded-xl transition-all font-medium text-sm">
                <Download size={16} />
                <span>Download</span>
              </button>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg sm:rounded-xl transition-all font-medium text-sm">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-secondary border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-primary/50 border-b border-border">
              <tr>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-core-primary-600 border-gray-300 rounded focus:ring-core-primary-500"
                  />
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary">
                  Invoice
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary">
                  Client
                </th>
                <th className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary">
                  Date
                </th>
                <th className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary">
                  Due Date
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-bold uppercase tracking-wider text-secondary">
                  Amount
                </th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-bold uppercase tracking-wider text-secondary">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-bold uppercase tracking-wider text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status].icon;
                return (
                  <tr key={invoice.id} className="hover:bg-primary/30 transition-colors">
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => handleSelectInvoice(invoice.id)}
                        className="w-4 h-4 text-core-primary-600 border-gray-300 rounded focus:ring-core-primary-500"
                      />
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm font-semibold text-primary">{invoice.id}</div>
                      <div className="text-xs text-muted">{invoice.items.length} items</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="text-sm font-medium text-primary max-w-[150px] sm:max-w-xs truncate">
                        {invoice.client}
                      </div>
                      <div className="text-xs text-muted">{invoice.clientType}</div>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 py-3 sm:py-4 text-sm text-secondary whitespace-nowrap">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-4 py-3 sm:py-4 text-sm text-secondary whitespace-nowrap">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                      <div className="text-sm font-bold text-primary whitespace-nowrap">
                        {formatCurrency(invoice.amount)}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${statusConfig[invoice.status].color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[invoice.status].dotColor}`}></span>
                          {statusConfig[invoice.status].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-1.5 sm:p-2 text-secondary hover:text-core-primary-600 hover:bg-core-primary-50 dark:hover:bg-core-primary-900/30 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1.5 sm:p-2 text-secondary hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice)}
                          className="p-1.5 sm:p-2 text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === invoice.id ? null : invoice.id)}
                            className="p-1.5 sm:p-2 text-secondary hover:text-primary hover:bg-primary/50 rounded-lg transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeDropdown === invoice.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveDropdown(null)}
                              ></div>
                              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-secondary border border-border rounded-xl shadow-lg py-1 z-20">
                                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/30 transition-colors flex items-center gap-3">
                                  <Download size={16} />
                                  Download
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/30 transition-colors flex items-center gap-3">
                                  <Send size={16} />
                                  Send
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/30 transition-colors flex items-center gap-3">
                                  <Mail size={16} />
                                  Email
                                </button>
                                <button className="w-full px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-primary/30 transition-colors flex items-center gap-3">
                                  <Printer size={16} />
                                  Print
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/50 mb-4">
              <FileText size={28} className="text-muted" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">
              No invoices found
            </h3>
            <p className="text-sm text-secondary">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {viewModalOpen && selectedInvoice && (
        <ViewInvoiceModal 
          invoice={selectedInvoice}
          onClose={() => setViewModalOpen(false)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          statusConfig={statusConfig}
        />
      )}

      {/* Add/Edit Invoice Modal */}
      {addEditModalOpen && (
        <AddEditInvoiceModal 
          isEditMode={isEditMode}
          formData={formData}
          onClose={() => setAddEditModalOpen(false)}
          onSave={handleSaveInvoice}
          handleFormChange={handleFormChange}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
          calculateSubtotal={calculateSubtotal}
          calculateTax={calculateTax}
          calculateTotal={calculateTotal}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && selectedInvoice && (
        <DeleteConfirmModal 
          invoice={selectedInvoice}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

// View Invoice Modal Component
const ViewInvoiceModal = ({ invoice, onClose, formatCurrency, formatDate, statusConfig }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-secondary border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-secondary border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg sm:text-xl font-bold text-primary">
          Invoice Details
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-primary/50 rounded-xl transition-colors text-secondary"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">
              {invoice.id}
            </h3>
            <div className="space-y-1">
              <p className="text-sm text-secondary">
                <span className="font-semibold">Date:</span> {formatDate(invoice.date)}
              </p>
              <p className="text-sm text-secondary">
                <span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${statusConfig[invoice.status].color}`}>
              <span className={`w-2 h-2 rounded-full ${statusConfig[invoice.status].dotColor}`}></span>
              {statusConfig[invoice.status].label}
            </span>
          </div>
        </div>

        <div className="bg-primary/50 border border-border rounded-xl p-4 sm:p-5">
          <h4 className="text-sm font-bold text-primary mb-3 sm:mb-4">
            Bill To:
          </h4>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-muted mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary">
                  {invoice.client}
                </p>
                <p className="text-xs text-muted">
                  {invoice.clientType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted flex-shrink-0" />
              <p className="text-sm text-secondary break-all">
                {invoice.clientEmail}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-muted flex-shrink-0" />
              <p className="text-sm text-secondary">
                {invoice.clientPhone}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-muted mt-0.5 flex-shrink-0" />
              <p className="text-sm text-secondary">
                {invoice.clientAddress}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-primary mb-3">
            Items:
          </h4>
          <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-primary/50 border-b border-border">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold uppercase text-secondary">
                    Description
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold uppercase text-secondary">
                    Qty
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold uppercase text-secondary">
                    Rate
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-bold uppercase text-secondary">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 sm:px-4 py-3 text-sm text-primary">
                      {item.description}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-secondary text-center">
                      {item.quantity}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-secondary text-right whitespace-nowrap">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm font-semibold text-primary text-right whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-3 bg-primary/50 border border-border rounded-xl p-4 sm:p-5">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(invoice.items.reduce((sum, item) => sum + item.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">
                Tax ({invoice.taxRate}%):
              </span>
              <span className="font-semibold text-primary">
                {formatCurrency(invoice.items.reduce((sum, item) => sum + item.amount, 0) * (invoice.taxRate / 100))}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="text-base font-bold text-primary">
                Total:
              </span>
              <span className="text-base font-bold text-primary">
                {formatCurrency(invoice.amount)}
              </span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-2">
              Notes:
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {invoice.notes}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-border">
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-core-primary-600 to-core-primary-700 text-white rounded-xl hover:from-core-primary-700 hover:to-core-primary-800 transition-all shadow-lg shadow-core-primary-500/20 text-sm font-semibold">
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-500/20 text-sm font-semibold">
            <Send size={16} />
            <span className="hidden sm:inline">Send Invoice</span>
            <span className="sm:hidden">Send</span>
          </button>
          <button className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-secondary border border-border text-primary rounded-xl hover:bg-primary/50 transition-all text-sm font-semibold">
            <Printer size={16} />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Add/Edit Invoice Modal Component  
const AddEditInvoiceModal = ({ 
  isEditMode, 
  formData, 
  onClose, 
  onSave, 
  handleFormChange, 
  handleItemChange, 
  addItem, 
  removeItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-secondary border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-secondary border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg sm:text-xl font-bold text-primary">
          {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-primary/50 rounded-xl transition-colors text-secondary"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => handleFormChange('client', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Client Type *
            </label>
            <select
              value={formData.clientType}
              onChange={(e) => handleFormChange('clientType', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
            >
              <option value="PCN">PCN</option>
              <option value="Practice">Practice</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => handleFormChange('clientEmail', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => handleFormChange('clientPhone', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              placeholder="+44 1234 567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-primary mb-2">
              Address
            </label>
            <textarea
              value={formData.clientAddress}
              onChange={(e) => handleFormChange('clientAddress', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
              rows="2"
              placeholder="Client address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Invoice Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleFormChange('date', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleFormChange('dueDate', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleFormChange('status', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-primary">
              Invoice Items *
            </label>
            <button
              onClick={addItem}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-core-primary-600 to-core-primary-700 text-white rounded-xl hover:from-core-primary-700 hover:to-core-primary-800 transition-all shadow-lg shadow-core-primary-500/20 text-sm font-semibold"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="bg-primary/50 border border-border rounded-xl p-3 sm:p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all text-sm"
                      placeholder="Item description"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all text-sm"
                      placeholder="Qty"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 sm:py-2.5 bg-secondary border border-border rounded-lg text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all text-sm"
                      placeholder="Rate"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={formatCurrency(item.amount)}
                      disabled
                      className="w-full px-3 py-2 sm:py-2.5 bg-primary/30 border border-border rounded-lg text-sm font-semibold text-secondary"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-80 space-y-3 bg-primary/50 border border-border rounded-xl p-4 sm:p-5">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(calculateSubtotal())}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-secondary">Tax:</span>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleFormChange('taxRate', parseFloat(e.target.value) || 0)}
                  className="w-14 sm:w-16 px-2 py-1 bg-secondary border border-border rounded-lg text-sm text-primary"
                  min="0"
                  max="100"
                />
                <span className="text-secondary">%</span>
              </div>
              <span className="font-semibold text-primary">
                {formatCurrency(calculateTax())}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="text-base font-bold text-primary">
                Total:
              </span>
              <span className="text-base font-bold text-primary">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleFormChange('notes', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-primary border border-border rounded-xl text-primary placeholder-secondary focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all"
            rows="3"
            placeholder="Additional notes or payment terms..."
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-core-primary-600 to-core-primary-700 text-white rounded-xl hover:from-core-primary-700 hover:to-core-primary-800 transition-all shadow-lg shadow-core-primary-500/20 text-sm font-semibold"
          >
            <Save size={16} />
            {isEditMode ? 'Update Invoice' : 'Create Invoice'}
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-secondary border border-border text-primary rounded-xl hover:bg-primary/50 transition-all text-sm font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ invoice, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-secondary border border-border rounded-2xl shadow-2xl max-w-md w-full">
      <div className="p-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rose-100 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-primary text-center mb-2">
          Delete Invoice
        </h3>
        <p className="text-sm text-secondary text-center mb-6">
          Are you sure you want to delete invoice <span className="font-bold text-primary">{invoice.id}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-primary border border-border text-secondary rounded-xl hover:bg-primary/80 transition-all text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg shadow-rose-500/20 text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Invoices;