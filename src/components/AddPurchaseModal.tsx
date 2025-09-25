import React, { useState } from 'react';
import { Purchase, Equipment } from '../types';
import { X, Calculator } from 'lucide-react';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (purchase: Purchase) => void;
  equipments?: Equipment[];
}

const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipments = []
}) => {
  const [formData, setFormData] = useState<Omit<Purchase, 'id'>>({
    equipmentId: '',
    equipmentName: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorContact: '',
    billNumber: '',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods: Purchase['paymentMethod'][] = ['Cash', 'Card', 'Bank Transfer', 'Cheque'];
  const paymentStatuses: Purchase['paymentStatus'][] = ['Paid', 'Pending', 'Partial'];

  const calculateTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.equipmentName.trim()) newErrors.equipmentName = 'Equipment name is required';
    if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
    if (!formData.vendorContact.trim()) newErrors.vendorContact = 'Vendor contact is required';
    if (!formData.billNumber.trim()) newErrors.billNumber = 'Bill number is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Unit price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newPurchase: Purchase = {
      ...formData,
      id: Date.now().toString(),
      totalAmount: calculateTotal(formData.quantity, formData.unitPrice)
    };

    onSubmit(newPurchase);
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    const updatedData = { ...formData, [field]: value };
    
    // Auto-calculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedData.totalAmount = calculateTotal(
        field === 'quantity' ? value as number : formData.quantity,
        field === 'unitPrice' ? value as number : formData.unitPrice
      );
    }
    
    setFormData(updatedData);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateBillNumber = () => {
    const prefix = 'NH';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const billNumber = `${prefix}-${year}-${random}`;
    handleChange('billNumber', billNumber);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add New Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipment Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name *
              </label>
              <input
                type="text"
                value={formData.equipmentName}
                onChange={(e) => handleChange('equipmentName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.equipmentName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter equipment name"
              />
              {errors.equipmentName && <p className="text-red-500 text-sm mt-1">{errors.equipmentName}</p>}
            </div>

            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                value={formData.vendorName}
                onChange={(e) => handleChange('vendorName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.vendorName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor name"
              />
              {errors.vendorName && <p className="text-red-500 text-sm mt-1">{errors.vendorName}</p>}
            </div>

            {/* Vendor Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Contact *
              </label>
              <input
                type="text"
                value={formData.vendorContact}
                onChange={(e) => handleChange('vendorContact', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.vendorContact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor contact"
              />
              {errors.vendorContact && <p className="text-red-500 text-sm mt-1">{errors.vendorContact}</p>}
            </div>

            {/* Bill Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Number *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.billNumber}
                  onChange={(e) => handleChange('billNumber', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter bill number"
                />
                <button
                  type="button"
                  onClick={generateBillNumber}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  title="Generate Bill Number"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
              {errors.billNumber && <p className="text-red-500 text-sm mt-1">{errors.billNumber}</p>}
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Date *
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.purchaseDate && <p className="text-red-500 text-sm mt-1">{errors.purchaseDate}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter quantity"
                min="1"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price (₹) *
              </label>
              <input
                type="number"
                value={formData.unitPrice}
                onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.unitPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter unit price"
                min="0"
                step="0.01"
              />
              {errors.unitPrice && <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>}
            </div>

            {/* Total Amount (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount (₹)
              </label>
              <input
                type="text"
                value={new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(formData.totalAmount)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value as Purchase['paymentMethod'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleChange('paymentStatus', e.target.value as Purchase['paymentStatus'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {paymentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPurchaseModal;