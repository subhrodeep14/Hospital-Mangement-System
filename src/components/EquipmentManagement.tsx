import React, { useEffect, useState } from 'react';
import { Equipment } from '../types';
//import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertTriangle, Wrench, Wrench, CheckCircle, CheckCircle } from 'lucide-react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  Wrench,
  CheckCircle,
} from "lucide-react";
import AddEquipmentModal from './AddEquipmentModal';
import ShowEquipmentModal from './ShowEquipmentModal';
import { axiosClient } from '../api/axiosClient';

interface EquipmentManagementProps {
  equipments: Equipment[];
  onAddEquipment: (equipment: Equipment) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
  departmentFilter?: string;
  onClearDepartmentFilter?: () => void;
}

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({
  equipments,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  departmentFilter,
  onClearDepartmentFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showEquipment, setShowEquipment] = useState<Equipment | null>(null);

  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || equipment.category === categoryFilter;
    
    // Department filter logic
    let matchesDepartment = true;
    if (departmentFilter) {
      matchesDepartment = equipment.location.includes(departmentFilter) || 
        (departmentFilter === 'Emergency Medicine' && equipment.location.includes('Emergency')) ||
        (departmentFilter === 'Intensive Care Unit' && equipment.location.includes('ICU')) ||
        (departmentFilter === 'Operating Theater' && equipment.location.includes('Operating')) ||
        (departmentFilter === 'Blood Bank' && equipment.location.includes('Blood'));
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDepartment;
  });

  const categories = Array.from(new Set(equipments.map(eq => eq.category)));
  const statuses = ['Active', 'Maintenance', 'Retired', 'Out of Order'];

  

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

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowAddModal(true);
  };
  const handleShow = (equipment: Equipment) => {
    setShowEquipment(equipment);
    setShowEquipmentModal(true);
  };
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingEquipment(null);
  };
  const handleShowClose = () => {
    setShowEquipment(null);
    setShowEquipmentModal(false);
  };

  const handleModalSubmit = (equipment: Equipment) => {
    if (editingEquipment) {
      onUpdateEquipment(equipment);
    } else {
      onAddEquipment(equipment);
    }
    handleModalClose();
  };

  useEffect(() => {
    if (!showAddModal) {
      setEditingEquipment(null);
    }
  }, [showAddModal]);

  const [equipmentStats, setEquipmentStats] = useState({
  total: 0,
  active: 0,
  maintenance: 0,
  outOfOrder: 0,
  totalValue: 0,
});

// useEffect(() => {
//   const unitId = equipments[0]?.unitId;
//   if (!unitId) return;

//   fetch(`api/equipments/stats?unitId=${unitId}`, {
//     credentials: "include",
//   })
//     .then(res => res.json())
//     .then(setEquipmentStats)
//     .catch(console.error);
// }, [equipments]);
// useEffect(() => {
//   const unitId = equipments[0]?.unitId;
//   if (!unitId) return;

//   fetch(`api/equipments/stats?unitId=${unitId}`, {
//     credentials: "include",
//   })
//     .then(res => res.json())
//     .then(setEquipmentStats)
//     .catch(console.error);
// }, [equipments]); 
useEffect(() => {
  const unitId = equipments[0]?.unitId;
  if (!unitId) return;

  axiosClient
    .get("/equipments/stats", {
      params: { unitId },
    })
    .then(res => {
      setEquipmentStats(res.data);
    })
    .catch(err => {
      console.error("Stats fetch failed:", err);
    });
}, [equipments]);

const statCards = [
  {
    title: "Total Equipment",
    value: equipmentStats.total,
    icon: <Package className="w-6 h-6 text-blue-600" />,
    accent: "from-blue-500 to-blue-400",
  },
  {
    title: "Active Equipment",
    value: equipmentStats.active,
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    accent: "from-green-500 to-green-400",
  },
  {
    title: "Under Maintenance",
    value: equipmentStats.maintenance,
    icon: <Wrench className="w-6 h-6 text-yellow-600" />,
    accent: "from-yellow-500 to-yellow-400",
  },
  {
    title: "Out of Order",
    value: equipmentStats.outOfOrder,
    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
    accent: "from-red-500 to-red-400",
  },
];

  //  
  return (
    <div className="min-h-screen bg-gradient-to-b text-md from-slate-100 to-white py-10 px-10">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Equipment Management
              {departmentFilter && (
                <span className="text-xl font-normal text-blue-600 ml-2">- {departmentFilter}</span>
              )}
            </h1>
            <p className="text-gray-600">
              {departmentFilter 
                ? `Viewing equipment for ${departmentFilter} department` 
                : 'Manage all hospital equipment and their maintenance schedules'
              }
            </p>
            {departmentFilter && onClearDepartmentFilter && (
              <button
                onClick={onClearDepartmentFilter}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ← Back to all equipment
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
          
        </div>
       

        <section className="pt-2">
						<div className="rounded-2xl border-2 border-blue-100 bg-white/80 p-2 shadow-sm">
							<div className="grid grid-cols-1 gap-10 p-4  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
								{statCards.map((card) => (
									<button
										key={card.title}
									
										className="w-full rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 group text-left relative"
									>
										<div className="p-5 flex items-start justify-between">
											<div>
												<p className="text-slate-500 text-sm">{card.title}</p>
												<p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
											</div>
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-inner`}>
												{card.icon}
											</div>
										</div>
										<div className="absolute inset-x-3 bottom-3 h-1 rounded-full bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition" />
									</button>
								))}
							</div>
						</div>
					</section>

        {/* Department Filter Alert */}
        {departmentFilter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-blue-800 font-medium">
                  Showing equipment for: {departmentFilter}
                </p>
                <span className="text-blue-600 text-sm">
                  ({filteredEquipments.length} equipment{filteredEquipments.length !== 1 ? 's' : ''} found)
                </span>
              </div>
              {onClearDepartmentFilter && (
                <button
                  onClick={onClearDepartmentFilter}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search equipment..."
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
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Next Maintenance</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipments.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{equipment.name}</p>
                        <p className="text-sm text-gray-500">{equipment.manufacturer} • {equipment.model}</p>
                        <p className="text-sm text-gray-400">S/N: {equipment.serialNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{equipment.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{equipment.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        equipment.status === 'Active' ? 'bg-green-100 text-green-700' :
                        equipment.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                        equipment.status === 'Out of Order' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {equipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(equipment.nextMaintenance)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(equipment.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"  onClick={() => handleShow(equipment)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(equipment)}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEquipment(equipment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredEquipments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {departmentFilter ? `No equipment found in ${departmentFilter}` : 'No equipment found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {departmentFilter 
                ? `There are currently no equipment items assigned to the ${departmentFilter} department.`
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        )}

        {/* Add/Edit Equipment Modal */}
        {showAddModal && (
          <AddEquipmentModal
            isOpen={showAddModal}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            equipment={editingEquipment}
          />
        )}
        {showEquipment && (
          <ShowEquipmentModal
            isOpen={showEquipmentModal}
            onClose={handleShowClose}
            equipment={showEquipment}
          />
        )}
      </div>
    </div>
  );
};

export default EquipmentManagement;