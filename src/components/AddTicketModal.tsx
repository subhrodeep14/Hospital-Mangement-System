import React, { useState } from 'react';
import { Ticket, Equipment } from '../types';
import { X, AlertTriangle, User, Calendar, Tag } from 'lucide-react';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void;
  equipments: Equipment[];
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipments
}) => {
  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments' | 'resolvedAt'> & { equipmentId: string }>({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    status: 'Open',
    createdBy: '',
    department: '',
    equipmentId: '',
    assignedTo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: Ticket['category'][] = [
    'Technical Issue',
    'Software Request', 
    'Access Request',
    'Equipment Issue',
    'Other'
  ];

  const priorities: Ticket['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

  const departments = [
    'Emergency Department',
    'Intensive Care Unit',
    'Radiology Department',
    'Laboratory',
    'Cardiology Department',
    'OB/GYN Department',
    'Operating Theater',
    'Pharmacy',
    'Physiotherapy',
    'Administration',
    'IT Department',
    'Human Resources',
    'Maintenance'
  ];

  const assignees = [
    'Dr. Priya Sharma',
    'IT Team Lead',
    'Biomedical Engineer',
    'Maintenance Supervisor',
    'Security Manager',
    'HR Manager',
    'Admin Manager'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Reporter name is required';
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...formData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      comments: []
    };

    onSubmit(newTicket);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Raise New Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the issue or request"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value as Ticket['category'])}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <div className="relative">
                <AlertTriangle className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value as Ticket['priority'])}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reporter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported By *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleChange('createdBy', e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.createdBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Equipment (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Equipment (Optional)
              </label>
              <select
                value={formData.equipmentId || ''}
                onChange={(e) => handleChange('equipmentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select equipment (if applicable)</option>
                {equipments.map(equipment => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name} - {equipment.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To (Optional)
              </label>
              <select
                value={formData.assignedTo || ''}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select assignee</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed description of the issue or request..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicketModal;