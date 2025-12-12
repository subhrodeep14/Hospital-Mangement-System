import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EquipmentManagement from "./components/EquipmentManagement";
import TicketManagement from "./components/TicketManagement";
import Settings from "./components/Settings";
import AddRoomManagement from "./components/AddRoomManagement";
import SelectUnitPage from "./components/SelectUnitPage";


import { mockEquipments, hospitalInfo, mockTickets } from "./data/mockData";

//// 🟢 ADDED — Service Slip + Review Pages
import ServiceSlip from "./components/Serviceslip";
import Reviewticket from "./components/Reviewticket";
import ReviewList from "./components/Reviewlist";
import { axiosClient } from "./api/axiosClient";

// Protected Route
function ProtectedRoute({ isAuthed, children }: { isAuthed: boolean; children: JSX.Element }) {
  if (!isAuthed) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [equipments, setEquipments] = useState(mockEquipments);
  //const [purchases, setPurchases] = useState(mockPurchases);
  const [tickets, setTickets] = useState(mockTickets);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  //// 🟢 ADDED — Global Slip Control
  const [showSlip, setShowSlip] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  //// 🟢 ADDED — Selected Review Ticket
  const [reviewTicket, setReviewTicket] = useState(null);

  // CRUD HANDLERS
  const handleAddEquipment = (equipment: any) => {
    setEquipments((prev) => [...prev, equipment]);
  };

  const handleUpdateEquipment = (updatedEquipment: any) => {
    setEquipments((prev) =>
      prev.map((eq) => (eq.id === updatedEquipment.id ? updatedEquipment : eq))
    );
  };

  const handleDeleteEquipment = (id: any) => {
    if (window.confirm("Delete equipment?")) {
      setEquipments((prev) => prev.filter((eq) => eq.id !== id));
    }
  };


  const handleAddTicket = async (ticketData: any) => {
  try {
    const unitId = new URLSearchParams(window.location.search).get("unit");

    if (!unitId) {
      alert("Unit ID missing in URL. Cannot create ticket.");
      return;
    }

    const res = await axiosClient.post("/tickets", {
      ...ticketData,
      unitId: Number(unitId),
    });

    // Add new ticket to UI state
    setTickets((prev) => [...prev, res.data.ticket]);

  } catch (error) {
    console.error("CREATE TICKET ERROR:", error);
    alert("Failed to create ticket");
  }
};


 

    const handleDepartmentClick = (department: string) => {
      setSearchParams({ dept: department });
      navigate("/equipment");
    };

  const handleClearDepartmentFilter = () => {
    setSearchParams({});
  };

  const handleUpdateTicket = async (updatedTicket:any) => {
  try {
    const res = await axiosClient.put(`/tickets/${updatedTicket.id}`, updatedTicket);

    // Update UI state with returned ticket
    setTickets((prev) =>
      prev.map((t) => (t.id === updatedTicket.id ? res.data.ticket : t))
    );

  } catch (error) {
    console.error("UPDATE TICKET ERROR:", error);
    alert("Failed to update ticket");
  }
};


  

   const handleLogin = (user: any) => {
    console.log("Logged-in user:", user);
      setIsAuthenticated(true);
    if (user.role === "admin") {
      // Admin always must select unit
    //  if (user.needsUnitSelection) {
        navigate("/select-unit");
      // } else {
      //   navigate("/");
      // }
    } else {
      // Employee: needs unit assigned
      if (!user.unitId) {
        alert("Employee does not have a unit assigned.");
        return;
      }
      navigate(`/unit/:unitId/dashboard`);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  const visibltickets = tickets.filter(t => t.status!=="Rejected");

  const departmentFilter = searchParams.get("dept") ?? "";

  return (
    <div className="">
      <div className=" ">
         <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
      </div>
     

      {/* SIDEBAR */}
      <div className=" left-0 top-0 h-full overflow-y-auto">
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

      <div className="flex-1">
        <Routes>
          
          {/* LOGIN */}
          {/* <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> */}
          <Route path="/select-unit" element={<ProtectedRoute isAuthed={isAuthenticated}>
               <SelectUnitPage />
              </ProtectedRoute>} />
          

          {/* DASHBOARD */}
          <Route
            path="/unit/:unitId/dashboard"
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
          {/* <Route
            path="/purchases"
            element={
              <ProtectedRoute isAuthed={isAuthenticated}>
                <PurchaseManagement
                  purchases={purchases}
                  onAddPurchase={handleAddPurchase}
                />
              </ProtectedRoute>
            }
          /> */}

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
