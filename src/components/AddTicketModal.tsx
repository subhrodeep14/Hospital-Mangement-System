import React, { useState } from 'react';
import { Ticket, Equipment } from '../types';
import { X, AlertTriangle, User, Tag, Bed } from 'lucide-react';
import { axiosClient } from '../api/axiosClient';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void | Promise<void>;
  equipments: Equipment[];
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipments
}) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    priority: 'Medium',
    status: 'Open',
  //  createdBy: '',
    department: '',
    floor: '',
    room: '',
    Bed: '',
   // equipmentId: '',
    //assignedTo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: Ticket['category'][] = [
    'Technical Issue',
    'Software Request', 
    'Access Request',
    'Equipment Issue',
    'Maintenance Request',
    'Biomedical Request',
    'Other'
  ];

  const priorities: Ticket['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
    const floor: Ticket['Floor'][] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];
     const room: Ticket['Room'][] = ['101', '110', '205', '300', '410', '512'];
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

  // const assignees = [
  //   'Dr. Priya Sharma',
  //   'IT Team Lead',
  //   'Biomedical Engineer',
  //   'Maintenance Supervisor',
  //   'Security Manager',
  //   'HR Manager',
  //   'Admin Manager'
  // ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
  
    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- SUBMIT ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Convert priority for backend
      const mappedPriority =
        formData.priority.toLowerCase() as "low" | "medium" | "high" | "critical";

      // Convert `/unit/3/tickets` → 3
      const unitId = Number(window.location.pathname.split("/")[2]);

      // FULL PAYLOAD — ALL FIELDS INCLUDED
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: mappedPriority === 'critical' ? 'high' : mappedPriority,
        department: formData.department,
      //  equipmentId: formData.equipmentId || null,
      //  assignedTo: formData.assignedTo || null,
        Floor: formData.floor || null,
        Room: formData.room || null,
        Bed: formData.Bed || null,
        unitId,
      };

      const response = await axiosClient.post("/tickets", payload);

      // Return backend ticket to parent
      // onSubmit(response.data.ticket);

      // onClose();

      if (typeof onSubmit === "function") {
  await onSubmit(response.data.ticket);
}else{
  console.error("onSubmit is not a function");
}
onClose();

    } catch (error: any) {
      console.error("Create ticket failed", error);
      
    }
  };

  // ---------------- FIELD UPDATE ----------------------------
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
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Raise New Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the issue or request"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Call Department *</label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <div className="relative">
                <AlertTriangle className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reporter */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reported By *</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleChange('createdBy', e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg w-full ${
                    errors.createdBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.createdBy && <p className="text-red-500 text-sm mt-1">{errors.createdBy}</p>}
            </div> */}

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floor </label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.floor}
                  onChange={(e) => handleChange('floor', e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                >
                  {floor.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room </label>
              <div className="relative">
                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.room}
                  onChange={(e) => handleChange('room', e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                >
                  {room.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bed Number</label>
              <input
                type="text"
                value={formData.Bed}
                onChange={(e) => handleChange('Bed', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.Bed ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter bed number if applicable"
              />
              {errors.Bed && <p className="text-red-500 text-sm mt-1">{errors.Bed}</p>}
            </div>

            {/* Equipment */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Equipment (Optional)
              </label>
              <select
                value={formData.equipmentId}
                onChange={(e) => handleChange('equipmentId', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select equipment</option>
                {equipments.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} - {eq.location}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Assigned To */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To (Optional)
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => handleChange('assignedTo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select assignee</option>
                {assignees.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div> */}

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide detailed description..."
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition-colors"
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
