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

import { Equipment, Purchase, Ticket } from "./types";
import { mockEquipments, hospitalInfo, mockPurchases, mockTickets } from "./data/mockData";

//// 🟢 ADDED — Service Slip + Review Pages
import ServiceSlip from "./components/Serviceslip";
import Reviewticket from "./components/Reviewticket";
import ReviewList from "./components/Reviewlist";

// Protected Route
function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [equipments, setEquipments] = useState(mockEquipments);
  const [purchases, setPurchases] = useState(mockPurchases);
  const [tickets, setTickets] = useState(mockTickets);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  //// 🟢 ADDED — Global Slip Control
  const [showSlip, setShowSlip] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  //// 🟢 ADDED — Selected Review Ticket
  const [reviewTicket, setReviewTicket] = useState(null);

  // CRUD HANDLERS
  const handleAddEquipment = (equipment) => {
    setEquipments((prev) => [...prev, equipment]);
  };

  const handleUpdateEquipment = (updatedEquipment) => {
    setEquipments((prev) =>
      prev.map((eq) => (eq.id === updatedEquipment.id ? updatedEquipment : eq))
    );
  };

  const handleDeleteEquipment = (id) => {
    if (window.confirm("Delete equipment?")) {
      setEquipments((prev) => prev.filter((eq) => eq.id !== id));
    }
  };

  const handleAddPurchase = (purchase) => {
    setPurchases((prev) => [...prev, purchase]);
  };

  //// 🔵 UPDATED — New ticket now redirects to review page
  const handleAddTicket = (ticket) => {
    const updated = { ...ticket, status: "Review Pending" }; //// 🟢 ADDED
    setTickets((prev) => [...prev, updated]);
    navigate("/review"); //// 🟢 ADDED
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  const handleDepartmentClick = (department) => {
    setSearchParams({ dept: department });
    navigate("/equipment");
  };

  const handleClearDepartmentFilter = () => {
    setSearchParams({});
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  const visibltickets = tickets.filter(t => t.status!=="Rejected");

  const departmentFilter = searchParams.get("dept") ?? "";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-[300px] overflow-y-auto">
        {isAuthenticated && (
          <Sidebar
            onNavClick={(path) => {
              if (path !== "/equipment") setSearchParams({});
              navigate(path);
            }}
            onLogout={handleLogout}
          />
        )}
      </div>

      <div className="flex-1 ml-[300px]">
        <Routes>
          
          {/* LOGIN */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          {/* DASHBOARD */}
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

          {/* EQUIPMENT */}
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

          {/* ROOMS */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <AddRoomManagement />
              </ProtectedRoute>
            }
          />

          {/* PURCHASES */}
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

          {/* TICKETS */}
          <Route
            path="/tickets"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <TicketManagement
                  tickets={visibltickets}
                  equipments={equipments}
                  onAddTicket={handleAddTicket}
                  onUpdateTicket={handleUpdateTicket}

                  //// 🟢 ADDED - OPEN SERVICE SLIP
                  onSlip={(ticket) => {
                    setSelectedTicket(ticket);
                    setShowSlip(true);
                  }}
                />
              </ProtectedRoute>
            }
          />

          {/* 🟢 REVIEW PAGE (LIST + SINGLE) */}
          <Route
            path="/review"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                {!reviewTicket ? (
                  
                  //// 🟢 Show list of all pending review tickets
                  <ReviewList
                    tickets={tickets}
                    onSelect={(ticket) => setReviewTicket(ticket)}
                  />

                ) : (

                  //// 🟢 Show selected ticket review
                  <Reviewticket
                    ticket={reviewTicket}
                    onUpdate={(updated) => {
                      handleUpdateTicket(updated);
                    }}
                    onApprove={() => {
                      handleUpdateTicket({
                        ...reviewTicket,
                        status: "Open", //// 🟢 Approve means OPEN
                      });
                      setReviewTicket(null);
                    }}
                    onReject={() => {
                      handleUpdateTicket({
                        ...reviewTicket,
                        status: "Rejected",
                      });
                      setReviewTicket(null);
                    }}
                  />

                )}
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* 🟢 GLOBAL SERVICE SLIP */}
      {showSlip && selectedTicket && (
        <ServiceSlip
          ticket={selectedTicket}
          onClose={() => setShowSlip(false)}

          //// 🟢 Accept / Decline Handlers
          onAccept={(updated) => handleUpdateTicket(updated)}
          onDecline={(updated) => handleUpdateTicket(updated)}
        />
      )}

    </div>
  );
}

export default App;
