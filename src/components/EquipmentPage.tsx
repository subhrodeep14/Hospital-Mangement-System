import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import { Equipment } from "../types";
import EquipmentManagement from "../components/EquipmentManagement";

const EquipmentPage = () => {
  const { unitId } = useParams<{ unitId: string }>();

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    if (!unitId) return;

    const fetchEquipments = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/equipments", {
          params: { unitId },
        });
        setEquipments(res.data.equipments ?? []);
      } catch (err) {
        console.error("Failed to fetch equipments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, [unitId]);

  /* ---------------- ADD ---------------- */
  const handleAddEquipment = async (equipment: Equipment) => {
    const res = await axiosClient.post("/equipments", {
      ...equipment,
      unitId,
    });
    setEquipments((prev) => [res.data.equipment, ...prev]);
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdateEquipment = async (equipment: Equipment) => {
    const res = await axiosClient.put(
      `/equipments/${equipment.id}`,
      equipment
    );

    setEquipments((prev) =>
      prev.map((e) => (e.id === equipment.id ? res.data.equipment : e))
    );
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteEquipment = async (id: string) => {
    await axiosClient.delete(`/equipments/${id}`);
    setEquipments((prev) => prev.filter((e) => e.id !== id));
  };

  /* ---------------- FILTER HANDLERS ---------------- */
//   const handleDepartmentFilter = (dept: string) => {
//     setDepartmentFilter(dept);
//   };

  const handleClearDepartmentFilter = () => {
    setDepartmentFilter(undefined);
  };

  return (
    <EquipmentManagement
      equipments={equipments}
      onAddEquipment={handleAddEquipment}
      onUpdateEquipment={handleUpdateEquipment}
      onDeleteEquipment={handleDeleteEquipment}
      departmentFilter={departmentFilter}
      onClearDepartmentFilter={handleClearDepartmentFilter}
    />
  );
};

export default EquipmentPage;
