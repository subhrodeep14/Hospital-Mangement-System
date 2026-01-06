
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
    navigate(`/unit/${unitId}/tickets`);
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
