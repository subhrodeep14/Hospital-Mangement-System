import React, { useState } from 'react';
import { Purchase } from '../types';
import { Plus, Search, Filter, Eye, FileText, Download, Calendar, IndianRupee } from 'lucide-react';
import AddPurchaseModal from './AddPurchaseModal';
import BillGenerator from './BillGenerator';

interface PurchaseManagementProps {
  purchases: Purchase[];
  onAddPurchase: (purchase: Purchase) => void;
}

const PurchaseManagement: React.FC<PurchaseManagementProps> = ({
  purchases,
  onAddPurchase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showBillGenerator, setShowBillGenerator] = useState(false);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || purchase.paymentStatus === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || purchase.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const totalPurchaseValue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const paidPurchases = purchases.filter(p => p.paymentStatus === 'Paid').length;
  const pendingPurchases = purchases.filter(p => p.paymentStatus === 'Pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleViewBill = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowBillGenerator(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleModalSubmit = (purchase: Purchase) => {
    onAddPurchase(purchase);
    handleModalClose();
  };

  const handleBillClose = () => {
    setShowBillGenerator(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Management</h1>
            <p className="text-gray-600">Track all equipment purchases and generate bills</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Purchase
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
                <p className="text-3xl font-bold text-blue-600">{purchases.length}</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPurchaseValue)}</p>
              </div>
              <IndianRupee className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-3xl font-bold text-green-600">{paidPurchases}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingPurchases}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Payment Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bill Details</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{purchase.billNumber}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(purchase.purchaseDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{purchase.equipmentName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{purchase.vendorName}</p>
                        <p className="text-sm text-gray-500">{purchase.vendorContact}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{purchase.quantity}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(purchase.totalAmount)}</p>
                        <p className="text-sm text-gray-500">@ {formatCurrency(purchase.unitPrice)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                          purchase.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {purchase.paymentStatus}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{purchase.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewBill(purchase)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Bill"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewBill(purchase)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Generate Bill"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPurchases.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Add Purchase Modal */}
        {showAddModal && (
          <AddPurchaseModal
            isOpen={showAddModal}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
          />
        )}

        {/* Bill Generator */}
        {showBillGenerator && selectedPurchase && (
          <BillGenerator
            isOpen={showBillGenerator}
            onClose={handleBillClose}
            purchase={selectedPurchase}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseManagement;