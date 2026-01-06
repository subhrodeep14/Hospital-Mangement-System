
// import {
//   Plus,
//   Wrench,
//   Package,
//   TrendingUp,
//   IndianRupee,
//   AlertTriangle,
//   CheckCircle,
//   Building2 as HospitalIcon,
// } from "lucide-react";
// import { useLocation } from "react-router-dom";
// import AddTicketModal from "./AddTicketModal";
// import {axiosClient} from "../api/axiosClient";
// import { useEffect, useState } from "react";

// const Dashboard = ({ hospital, onAddTicket, onDepartmentClick }: any) => {
//   const location = useLocation();
//   const unitId = new URLSearchParams(location.search).get("unit");

//   const [loading, setLoading] = useState(true);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const [equipmentStats, setEquipmentStats] = useState<any>( {
//      total: 0,
//   active: 0,
//   maintenance: 0,
//   outOfOrder: 0,
//   totalValue: 0,});
//   const [recentEquipments, setRecentEquipments] = useState<any[]>([]);
//   const [departmentStats, setDepartmentStats] = useState<Record<string, number>>({});

//   /* ===========================
//      FETCH DASHBOARD DATA
//   =========================== */
//   useEffect(() => {
//     if (!unitId) return;

//     setLoading(true);
//     axiosClient
//       .get("/dashboard", { params: { unitId } })
//       .then((res) => {
//         setEquipmentStats(res.data.equipmentStats);
//         setRecentEquipments(res.data.recentEquipments);
//         setDepartmentStats(res.data.departmentStats);
//       })
//       .finally(() => setLoading(false));
//   }, [unitId]);

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount);

//   if (loading) {
//     return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
//   }

//   const stats = [
//     {
//       title: "Total Equipment",
//       value: equipmentStats.total,
//       icon: Package,
//       color: "bg-blue-600",
//       textColor: "text-blue-600",
//     },
//     {
//       title: "Active Equipment",
//       value: equipmentStats.active,
//       icon: CheckCircle,
//       color: "bg-green-600",
//       textColor: "text-green-600",
//     },
//     {
//       title: "Under Maintenance",
//       value: equipmentStats.maintenance,
//       icon: Wrench,
//       color: "bg-yellow-600",
//       textColor: "text-yellow-600",
//     },
//     {
//       title: "Out of Order",
//       value: equipmentStats.outOfOrder,
//       icon: AlertTriangle,
//       color: "bg-red-600",
//       textColor: "text-red-600",
//     },
//   ];

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="mx-auto max-w-7xl">

//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-10">
//           <div>
//             <h1 className="text-4xl font-extrabold text-gray-900">
//               Hospital Dashboard
//             </h1>
//             <p className="text-gray-500">
//               Viewing data for Unit <b>{unitId}</b>
//             </p>
//           </div>

//           <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Raise Ticket
//           </button>
//         </div>

//         {/* HOSPITAL INFO */}
//         <div className="bg-white rounded-xl p-8 mb-10 shadow">
//           <div className="flex justify-between">
//             <div>
//               <div className="flex items-center gap-4 mb-4">
//                 <HospitalIcon className="w-8 h-8 text-blue-600" />
//                 <h2 className="text-2xl font-bold">{hospital.name}</h2>
//               </div>

//               <p><b>Address:</b> {hospital.address}</p>
//               <p><b>Phone:</b> {hospital.phone}</p>
//               <p><b>Email:</b> {hospital.email}</p>
//             </div>

//             <div className="bg-blue-50 p-6 rounded-xl text-center">
//               <IndianRupee className="mx-auto text-blue-600 mb-2" />
//               <p className="text-sm">Total Asset Value</p>
//               <p className="text-2xl font-bold text-blue-700">
//                 {formatCurrency(equipmentStats.totalValue)}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           {stats.map((s) => {
//             const Icon = s.icon;
//             return (
//               <div key={s.title} className="bg-white p-6 rounded-xl shadow">
//                 <div className="flex justify-between mb-4">
//                   <p className="text-sm">{s.title}</p>
//                   <Icon className="text-gray-400" />
//                 </div>
//                 <p className={`text-3xl font-bold ${s.textColor}`}>{s.value}</p>
//               </div>
//             );
//           })}
//         </div>

//         {/* DEPARTMENTS + RECENT */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* DEPARTMENTS */}
//           <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
//             <h3 className="text-xl font-semibold mb-4">Departments</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {Object.entries(departmentStats).map(([dept, count]) => (
//                 <button
//                   key={dept}
//                   onClick={() => onDepartmentClick(dept)}
//                   className="bg-gray-50 p-4 rounded-lg hover:bg-blue-50"
//                 >
//                   <p className="font-semibold">{dept}</p>
//                   <p className="text-sm text-gray-500">{count} equipment</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RECENT EQUIPMENT */}
//           <div className="bg-white p-6 rounded-xl shadow">
//             <h3 className="text-xl font-semibold mb-4">Recent Equipment</h3>
//             <div className="space-y-4">
//               {recentEquipments.map((eq) => (
//                 <div key={eq.id} className="border p-3 rounded">
//                   <p className="font-semibold">{eq.name}</p>
//                   <p className="text-sm text-gray-500">{eq.category}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADD TICKET */}
//       {showAddModal && (
//         <AddTicketModal
//           isOpen
//           onClose={() => setShowAddModal(false)}
//           onSubmit={onAddTicket}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;
