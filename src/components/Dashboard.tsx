import React, { useState } from "react";
import {
  Plus,
  Wrench,
  Package,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Building2 as HospitalIcon
} from "lucide-react";

import AddTicketModal from "./AddTicketModal";
import { useLocation } from "react-router-dom";

const Dashboard = ({ hospital, equipments, onAddTicket, onDepartmentClick }: any) => {
  const location = useLocation();

  // SELECTED UNIT ID FROM URL
  const unitId = new URLSearchParams(location.search).get("unit");

  // FILTER EQUIPMENT FOR THIS UNIT ONLY
  const filteredEquipments = equipments.filter(
    (eq) => String(eq.unitId) === String(unitId)
  );

  // SUMMARY COUNTS FOR THIS UNIT
  const totalEquipments = filteredEquipments.length;
  const activeEquipments = filteredEquipments.filter(
    (eq) => eq.status === "Active"
  ).length;
  const maintenanceEquipments = filteredEquipments.filter(
    (eq) => eq.status === "Maintenance"
  ).length;
  const outOfOrderEquipments = filteredEquipments.filter(
    (eq) => eq.status === "Out of Order"
  ).length;

  const totalValue = filteredEquipments.reduce((sum, eq) => sum + eq.cost, 0);

  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // STAT CARDS
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

  // RECENT EQUIPMENT FOR THIS UNIT
  const recentEquipments = filteredEquipments
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() -
        new Date(a.purchaseDate).getTime()
    )
    .slice(0, 5);

  // EQUIPMENT BY DEPARTMENT FOR THIS UNIT
  const getEquipmentCountByDepartment = (department) => {
    return filteredEquipments.filter((eq) =>
      eq.location.toLowerCase().includes(department.toLowerCase())
    ).length;
  };

  return (
    <div className=" p-4 bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Hospital Dashboard
            </h1>
            <p className="text-gray-500">
              Viewing data for Unit <b>{unitId}</b> – Neotia Hospital Inventory
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Raise Ticket
          </button>
        </div>

        {/* HOSPITAL DETAILS */}
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 mb-10">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <HospitalIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hospital.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm">
                <p><b>Address:</b> {hospital.address}</p>
                <p><b>Phone:</b> {hospital.phone}</p>
                <p><b>Email:</b> {hospital.email}</p>
                <p>
                  <b>Website:</b>{" "}
                  <a
                    href={hospital.website}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {hospital.website.replace("https://", "")}
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 flex flex-col items-center shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <IndianRupee className="w-6 h-6 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-700 mb-1 font-medium">
                Total Asset Value (Unit {unitId})
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(totalValue)}
              </p>
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
                className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>

                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: stat.color.replace("600", "100"),
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>

                <p
                  className={`text-3xl font-extrabold ${stat.textColor}`}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* DEPARTMENTS + RECENT EQUIPMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* DEPARTMENTS */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Departments (Unit {unitId})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {hospital.departments.map((department) => (
                <button
                  key={department}
                  onClick={() => onDepartmentClick(department)}
                  className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition border group hover:border-blue-400"
                >
                  <p className="text-base font-semibold text-gray-800 group-hover:text-blue-700">
                    {department}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getEquipmentCountByDepartment(department)} equipment
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT EQUIPMENT */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Equipment (Unit {unitId})
            </h3>

            <div className="space-y-4">
              {recentEquipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className="p-4 bg-gray-50 rounded-lg border hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">
                      {equipment.name}
                    </p>

                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
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

                  <p className="text-sm text-gray-600">
                    {equipment.category} • {equipment.location}
                  </p>

                  <p className="text-xs text-gray-400">
                    Purchased:{" "}
                    {new Date(equipment.purchaseDate).toLocaleDateString()}
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
          equipments={filteredEquipments} // ⭐ Only show equipment of this unit
        />
      )}
    </div>
  );
};

export default Dashboard;
