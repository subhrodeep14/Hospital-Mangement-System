// import  { useState } from 'react';
// import LoginPage from './components/LoginPage';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import EquipmentManagement from './components/EquipmentManagement';
// import PurchaseManagement from './components/PurchaseManagement';
// import TicketManagement from './components/TicketManagement';
// import Settings from './components/Settings';
// import AddRoomManagement from './components/AddRoomManagement';
// // import AddBedManagement from './components/AddBedManagement';
// import { Equipment, Purchase, Ticket } from './types';
// import { mockEquipments, hospitalInfo, mockPurchases, mockTickets } from './data/mockData';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [activeSection, setActiveSection] = useState('home');
//   const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
//   const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
//   const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
//   const [departmentFilter, setDepartmentFilter] = useState<string>('');

//   const handleAddEquipment = (equipment: Equipment) => {
//     setEquipments(prev => [...prev, equipment]);
//   };

//   const handleUpdateEquipment = (updatedEquipment: Equipment) => {
//     setEquipments(prev =>
//       prev.map(eq => eq.id === updatedEquipment.id ? updatedEquipment : eq)
//     );
//   };

//   const handleDeleteEquipment = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this equipment?')) {
//       setEquipments(prev => prev.filter(eq => eq.id !== id));
//     }
//   };

//   const handleAddPurchase = (purchase: Purchase) => {
//     setPurchases(prev => [...prev, purchase]);
//   };

//   const handleAddTicket = (ticket: Ticket) => {
//     setTickets(prev => [...prev, ticket]);
//   };

//   const handleUpdateTicket = (updatedTicket: Ticket) => {
//     setTickets(prev =>
//       prev.map(ticket => ticket.id === updatedTicket.id ? updatedTicket : ticket)
//     );
//   };

//   const handleDepartmentClick = (department: string) => {
//     setDepartmentFilter(department);
//     setActiveSection('equipment');
//   };

//   const handleClearDepartmentFilter = () => {
//     setDepartmentFilter('');
//   };

//   const handleLogin = () => {
//     // In a real application, you would validate credentials against a backend
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setActiveSection('home');
//     setDepartmentFilter('');
//   };

//   // Show login page if not authenticated
//   if (!isAuthenticated) {
//     return <LoginPage onLogin={handleLogin} />;
//   }

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'home':
//         return (
//           <Dashboard 
//             hospital={hospitalInfo} 
//             equipments={equipments} 
//             onDepartmentClick={handleDepartmentClick}
//           />
//         );
//       case 'equipment':
//         return (
//           <EquipmentManagement
//             equipments={equipments}
//             onAddEquipment={handleAddEquipment}
//             onUpdateEquipment={handleUpdateEquipment}
//             onDeleteEquipment={handleDeleteEquipment}
//             departmentFilter={departmentFilter}
//             onClearDepartmentFilter={handleClearDepartmentFilter}
//           />
//         );
//       case 'rooms':
//         return <AddRoomManagement />;
//       // case 'beds':
//       //   return <AddBedManagement />;
//       case 'purchases':
//         return (
//           <PurchaseManagement
//             purchases={purchases}
//             onAddPurchase={handleAddPurchase}
//           />
//         );
//       case 'tickets':
//         return (
//           <TicketManagement
//             tickets={tickets}
//             equipments={equipments}
//             onAddTicket={handleAddTicket}
//             onUpdateTicket={handleUpdateTicket}
//           />
//         );
//       case 'settings':
//         return <Settings />;
//       default:
//         return (
//           <Dashboard 
//             hospital={hospitalInfo} 
//             equipments={equipments} 
//             onDepartmentClick={handleDepartmentClick}
//           />
//         );
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar 
//         activeSection={activeSection} 
//         onSectionChange={(section) => {
//           setActiveSection(section);
//           if (section !== 'equipment') {
//             setDepartmentFilter('');
//           }
//         }}
//         onLogout={handleLogout}
//       />
//       <div className="flex-1">
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default App;




import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EquipmentManagement from "./components/EquipmentManagement";
import PurchaseManagement from "./components/PurchaseManagement";
import TicketManagement from "./components/TicketManagement";
import Settings from "./components/Settings";
import AddRoomManagement from "./components/AddRoomManagement";
// import AddBedManagement from './components/AddBedManagement';

import { Equipment, Purchase, Ticket } from "./types";
import { mockEquipments, hospitalInfo, mockPurchases, mockTickets } from "./data/mockData";

// --- ProtectedRoute wrapper ---
function ProtectedRoute({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: React.ReactNode;
}) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // CRUD handlers stay the same
  const handleAddEquipment = (equipment: Equipment) => {
    setEquipments((prev) => [...prev, equipment]);
  };
  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    setEquipments((prev) =>
      prev.map((eq) => (eq.id === updatedEquipment.id ? updatedEquipment : eq))
    );
  };
  const handleDeleteEquipment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      setEquipments((prev) => prev.filter((eq) => eq.id !== id));
    }
  };

  const handleAddPurchase = (purchase: Purchase) => {
    setPurchases((prev) => [...prev, purchase]);
  };

  const handleAddTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  // --- Routing-aware handlers ---
  const handleDepartmentClick = (department: string) => {
    // Go to /equipment?dept=<department>
    setSearchParams({ dept: department });
    navigate("/equipment");
  };

  const handleClearDepartmentFilter = () => {
    // Remove dept query param
    setSearchParams({});
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/"); // go to dashboard after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSearchParams({});
    navigate("/login");
  };

  // Read current department filter from URL query (?dept=...)
  const departmentFilter = searchParams.get("dept") ?? "";

  return (
    <div className="flex min-h-screen  bg-gray-100">
      {/* Sidebar shows only when authed */}
      <div className="fixed left-0 top-0 h-full w-[300px] overflow-y-auto">
      
      {isAuthenticated && (
        <Sidebar
          // Use onClick -> navigate() instead of setActiveSection
          onNavClick={(path: string) => {
            // If leaving equipment, clear the dept filter for a clean URL
            if (path !== "/equipment") setSearchParams({});
            navigate(path);
          }}
          onLogout={handleLogout}
        />
      )}
      </div>
      <div className={`flex-1`}>
        <Routes>
          {/* Public route: login */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <Dashboard
                  hospital={hospitalInfo}
                  equipments={equipments}
                  onDepartmentClick={handleDepartmentClick}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipment"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <EquipmentManagement
                  equipments={equipments}
                  onAddEquipment={handleAddEquipment}
                  onUpdateEquipment={handleUpdateEquipment}
                  onDeleteEquipment={handleDeleteEquipment}
                  departmentFilter={departmentFilter}
                  onClearDepartmentFilter={handleClearDepartmentFilter}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <AddRoomManagement />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/beds"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <AddBedManagement />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/purchases"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <PurchaseManagement
                  purchases={purchases}
                  onAddPurchase={handleAddPurchase}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <TicketManagement
                  tickets={tickets}
                  equipments={equipments}
                  onAddTicket={handleAddTicket}
                  onUpdateTicket={handleUpdateTicket}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
