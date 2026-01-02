
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  Outlet,
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EquipmentManagement from "./components/EquipmentManagement";
import TicketManagement from "./components/TicketManagement";
import Settings from "./components/Settings";
import AddRoomManagement from "./components/AddRoomManagement";
import SelectUnitPage from "./components/SelectUnitPage";

import { mockEquipments, hospitalInfo} from "./data/mockData";
import Reviewticket from "./components/Reviewticket";
import ReviewList from "./components/Reviewlist";
import ServiceSlip from "./components/Serviceslip";

import { Ticket } from "./types";
import { axiosClient } from "./api/axiosClient";
import Register from "./components/Register";

/* -------------------------------- Protected Route --------------------------- */
function ProtectedRoute({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: JSX.Element;
}) {
  if (!isAuthed) return <Navigate to="/" replace />;
  return children;
}

/* -------------------------------- UNIT LAYOUT --------------------------- */
function UnitLayout({ onLogout }: { onLogout: () => void }) {
  const { unitId } = useParams();
  const navigate = useNavigate();

  const handleNavClick = (key: string) => {
    navigate(`/unit/${unitId}/${key}`);
  };

  return (
    <div className="flex">
      <Sidebar onNavClick={handleNavClick} onLogout={onLogout} />
      <div className="flex-1 ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
}

/* -------------------------------- MAIN APP --------------------------- */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedUser, setLoggedUser] = useState<any>(null);

  const [equipments] = useState(mockEquipments);
  // const [tickets, setTickets] = useState<Ticket[]>([]);

  // const [reviewTicket, setReviewTicket] = useState<Ticket | null>(null);
  // const [showSlip, setShowSlip] = useState(false);
  // const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const navigate = useNavigate();

  /* ------------------------------ LOGIN ------------------------------ */
  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setLoggedUser(user);

    if (user.role === "admin") {
      navigate("/select-unit");
      return;
    }

    if (!user.unitId) {
      alert("Employee has no assigned unit!");
      return;
    }

    navigate(`/unit/${user.unitId}/dashboard`);
  };

  /* ------------------------------ LOGOUT ------------------------------ */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedUser(null);
    navigate("/");
  };

  /* ------------------------------ TICKETS ------------------------------ */
//   const handleAddTicket = async (ticket: Ticket) => {
//     setTickets((prev) => [...prev, ticket]);
//   };

//   const handleUpdateTicket = async (updated: Ticket) => {
//     setTickets((prev) =>
//       prev.map((t) => (t.id === updated.id ? updated : t))
//     );
//   };



// const { unitId } = useParams();

// useEffect(() => {
//   if (!isAuthenticated) return;
//   if (location.pathname === "/select-unit") return;
//    if (!location.pathname.endsWith("/tickets")) return;
//   const fetchTickets = async () => {
//     try {
    
//       const res = await axiosClient.get("/tickets");

//       const normalizedTickets = res.data.tickets.map((t: any) => ({
//         ...t,
//         comments: t.comments ?? [],
//         attachments: t.attachments ?? [],
//         assignedTo: t.assignedTo ?? null,
//       }));

//       setTickets(normalizedTickets);

//     } catch (err) {
//       console.error("Failed to fetch tickets", err);
//     }
//   };

//   fetchTickets();
// }, [isAuthenticated, unitId, location.pathname]);



 // const visibleTickets = tickets;

  return (
    <div className="flex">
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<Register  />} />

        {/* SELECT UNIT */}
        <Route
          path="/select-unit"
          element={
            <ProtectedRoute isAuthed={isAuthenticated}>
              <SelectUnitPage />
            </ProtectedRoute>
          }
        />

        {/* UNIT ROUTES */}
        <Route
          path="/unit/:unitId"
          element={
            <ProtectedRoute isAuthed={isAuthenticated}>
              <UnitLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<Dashboard hospital={hospitalInfo} equipments={equipments} />}
          />

          <Route
            path="equipment"
            element={<EquipmentManagement equipments={equipments} />}
          />

          <Route
            path="tickets"
            element={
              <TicketManagement
               // tickets={visibleTickets}
              //  equipments={equipments}
                // onAddTicket={handleAddTicket}
                // onUpdateTicket={handleUpdateTicket}
                // onSlip={(ticket) => {
                //   setSelectedTicket(ticket);
                //   setShowSlip(true);
                // }}
              />
            }
          />
{/* 
          <Route
            path="review"
            element={
              !reviewTicket ? (
                <ReviewList
                  tickets={tickets}
                  onSelect={(t) => setReviewTicket(t)}
                />
              ) : (
                <Reviewticket
                  ticket={reviewTicket}
                  onUpdate={handleUpdateTicket}
                  onApprove={() =>
                    handleUpdateTicket({ ...reviewTicket, status: "Open" })
                  }
                  onReject={() =>
                    handleUpdateTicket({ ...reviewTicket, status: "Closed" })
                  }
                />
              )
            }
          /> */}

          <Route path="settings" element={<Settings />} />
          <Route path="rooms" element={<AddRoomManagement />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* SERVICE SLIP */}
      {/* {showSlip && selectedTicket && (
        <ServiceSlip
          ticket={selectedTicket}
          onClose={() => setShowSlip(false)}
          onAccept={handleUpdateTicket}
          onDecline={handleUpdateTicket}
        />
      )} */}
    </div>
  );
}

export default App;
