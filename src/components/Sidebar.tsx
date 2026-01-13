import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Settings,
  Ticket,
  LogOut,
  UserCheck,
} from "lucide-react";
import image001 from "../assets/image001.jpg";  

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ THE FIX — always read unitId from URL
  const { unitId } = useParams();

  // If unitId missing, block sidebar navigation
  const safeUnitId = unitId ?? "0";

  const menuItems = [
    // { key: "dashboard", label: "Dashboard", icon: Home },
   
    { key: "tickets", label: "Dashboard", icon: Home },
    // { key: "my-tickets", label: "My Tickets", icon: UserCheck },
    { key: "review", label: "Review Ticket", icon: Ticket },
     { key: "equipments", label: "Equipment", icon: Package },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (key: string) => {
    navigate(`/unit/${safeUnitId}/${key}`);
  };

  return (
    <div className="bg-slate-900 fixed left-0 top-0 text-white w-[300px] h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-white p-2 rounded-lg">
          <img src={image001} className="size-full" />
        </div>
        {/* <div>
          <h1 className="text-lg font-bold">Neotia Hospital</h1>
          <p className="text-sm text-slate-400">Inventory System</p>
        </div> */}
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = location.pathname.includes(item.key);

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
