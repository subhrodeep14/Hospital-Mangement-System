import React from 'react';
import { Home, Package, Settings, Ticket, ShoppingCart, LogOut } from 'lucide-react';
import orangePlus from '../assets/images - Logo 3.png';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogout }) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'equipment', label: 'Equipment', icon: Package },
    { id: 'rooms', label: 'Rooms', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-white p-2 rounded-lg">
          <img src={orangePlus} alt="Hospital Logo" className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Neotia Hospital</h1>
          <p className="text-sm text-slate-400">Inventory System</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-slate-300 hover:bg-red-600 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;