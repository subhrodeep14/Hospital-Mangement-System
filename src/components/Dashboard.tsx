import React, { useState } from "react";
import {
  Plus,
  HardHat,
  Package,
  Wrench,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Building2 as HospitalIcon
} from "lucide-react";

import AddTicketModal from "./AddTicketModal";

const Dashboard = ({ hospital, equipments, onAddTicket, onDepartmentClick }) => {
  const totalEquipments = equipments.length;
  const activeEquipments = equipments.filter(eq => eq.status === "Active").length;
  const maintenanceEquipments = equipments.filter(eq => eq.status === "Maintenance").length;
  const outOfOrderEquipments = equipments.filter(eq => eq.status === "Out of Order").length;
  const totalValue = equipments.reduce((sum, eq) => sum + eq.cost, 0);

  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Equipment",
      value: totalEquipments,
      icon: Package,
      color: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Active Equipment",
      value: activeEquipments,
      icon: CheckCircle,
      color: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Under Maintenance",
      value: maintenanceEquipments,
      icon: Wrench,
      color: "bg-yellow-600",
      textColor: "text-yellow-600",
    },
    {
      title: "Out of Order",
      value: outOfOrderEquipments,
      icon: AlertTriangle,
      color: "bg-red-600",
      textColor: "text-red-600",
    },
  ];

  const recentEquipments = equipments
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5);

  const getEquipmentCountByDepartment = (department) => {
    return equipments.filter(
      (eq) =>
        eq.location.toLowerCase().includes(department.toLowerCase()) ||
        (department.includes("Emergency") && eq.location.includes("Emergency")) ||
        (department.includes("Intensive Care") && eq.location.includes("ICU")) ||
        (department.includes("Operating") && eq.location.includes("Operating"))
    ).length;
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              Hospital Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome to the Neotia Hospital Inventory Management System
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Raise Ticket
          </button>
        </div>

        {/* HOSPITAL CARD */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row items-start justify-between">

            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <HospitalIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{hospital.name}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-600 text-sm">
                <p><span className="font-medium text-gray-800">Address:</span> {hospital.address}</p>
                <p><span className="font-medium text-gray-800">Phone:</span> {hospital.phone}</p>
                <p><span className="font-medium text-gray-800">Email:</span> {hospital.email}</p>
                <p>
                  <span className="font-medium text-gray-800">Website:</span>{" "}
                  <a href={hospital.website} target="_blank" className="text-blue-500 hover:underline">
                    {hospital.website.replace("https://", "")}
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex flex-col items-center min-w-48 shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <IndianRupee className="w-6 h-6 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Total Asset Value</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalValue)}</p>
            </div>

          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <div className="p-2 rounded-lg bg-opacity-20" style={{ backgroundColor: stat.color.replace("600", "100") }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className={`text-3xl font-extrabold ${stat.textColor}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* DEPARTMENTS + RECENT EQUIPMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* DEPARTMENTS */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Hospital Departments</h3>
            <p className="text-sm text-gray-600 mb-6">Click a department to view related equipment.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {hospital.departments.map((department, index) => (
                <button
                  key={index}
                  onClick={() => onDepartmentClick(department)}
                  className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl text-left transition-all duration-200 border border-gray-200 group hover:border-blue-400 hover:shadow-md"
                >
                  <p className="text-base font-semibold text-gray-800 group-hover:text-blue-700">
                    {department}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {getEquipmentCountByDepartment(department)} equipment
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT EQUIPMENT */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Recent Equipment
            </h3>

            <div className="space-y-4">
              {recentEquipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className="flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{equipment.name}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        equipment.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : equipment.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {equipment.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {equipment.category} • {equipment.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ADD TICKET MODAL */}
      {showAddModal && (
        <AddTicketModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={onAddTicket}
          equipments={equipments}
        />
      )}
    </div>
  );
};

export default Dashboard;
