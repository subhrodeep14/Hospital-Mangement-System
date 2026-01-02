// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Building2 } from "lucide-react";

// const UNITS = [
//   { id: 1, name: "Unit-1", code: "CARD" },
//   { id: 2, name: "Unit-2", code: "NEUR" },
//   { id: 3, name: "Unit-3", code: "EMER" },
// ];

// const SelectUnitPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleSelect = (unitId: number) => {
//     // Redirect admin to dashboard with selected unit
//    // navigate(`/dashboard?unit=${unitId}`);/unit/:unitId/dashboard

//    navigate(`/unit/${unitId}/dashboard`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
//       <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg border border-gray-200">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <Building2 className="w-12 h-12 mx-auto text-blue-600 mb-4" />
//           <h1 className="text-3xl font-bold text-gray-900">
//             Select Hospital Unit
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Choose the unit you want to manage today
//           </p>
//         </div>

//         {/* Unit Buttons */}
//         <div className="grid gap-4">
//           {UNITS.map((unit) => (
//             <button
//               key={unit.id}
//               onClick={() => handleSelect(unit.id)}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-md transition transform hover:scale-[1.02]"
//             >
//               {unit.name}
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <p className="text-center text-gray-500 text-sm mt-8">
//           © 2025 Neotia Getwel Multispecialty Hospital
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SelectUnitPage;
import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const UNITS = [
  { id: 1, name: "Unit-1" },
  { id: 2, name: "Unit-2" },
  { id: 3, name: "Unit-3" },
];

const SelectUnitPage = () => {
  const navigate = useNavigate();

  const handleSelect = (unitId: number) => {
    navigate(`/unit/${unitId}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-lg">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 mx-auto text-blue-600" />
          <h1 className="text-3xl font-bold mt-4">Select Hospital Unit</h1>
        </div>

        <div className="space-y-4">
          {UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => handleSelect(u.id)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectUnitPage;
