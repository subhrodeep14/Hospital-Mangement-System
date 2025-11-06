

import React from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Package,
  Settings,
  Ticket,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import orangePlus from "../assets/images - Logo 3.png";
import roboLogo from "../assets/finallogob.png"

interface SidebarProps {
  onNavClick: (path: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/equipment", label: "Equipment", icon: Package },
    { path: "/purchases", label: "Purchases", icon: ShoppingCart },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 h-screen overflow-y-auto p-6 flex flex-col">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-white p-2 rounded-lg">
          <img src={orangePlus} alt="Hospital Logo" className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Neotia Hospital</h1>
          <p className="text-sm text-slate-400">Inventory System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-3 border-t  border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 mb-6  rounded-lg transition-all duration-200 text-slate-300 hover:bg-red-600 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
       
      </div>
      {/* <div className="mt-4">
        <img src={roboLogo} alt="Robo Logo" className="w-72 h-14" />
      </div> */}
    </div>
  );
};

export default Sidebar;
