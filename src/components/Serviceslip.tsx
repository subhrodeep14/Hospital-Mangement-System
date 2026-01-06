
import React, { useEffect, useMemo, useState } from "react";
import { Equipment, Ticket, User } from "../types";
import { X, CalendarClock, Building2, User2, FileText } from "lucide-react";
import { axiosClient } from "../api/axiosClient";

interface ServiceSlipProps {
  ticket: Ticket | null;
  onClose: () => void;
  onAccept: (updated: Ticket) => void;
  onDecline: (updated: Ticket) => void;
}

const FALLBACK_UNIT = "NGHC – SILIGURI";

const statusPill = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Closed":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-rose-100 text-rose-700";
  }
};

const ServiceSlip: React.FC<ServiceSlipProps> = ({
  ticket,
  onClose,
  onAccept,
  onDecline,
}) => {
  if (!ticket) return null;

  const [remarks, setRemarks] = useState("");
  const [isAccepted, setIsAccepted] = useState(ticket.status === "In Progress");
  const [isAccepting, setIsAccepting] = useState(false);

  // Assignment state
  const [users, setUsers] = useState<User[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [assignedToId, setAssignedToId] = useState<number | null>(null);
  const [requiredEquipmentIds] = useState<number[]>([]);
  const [equipmentNote, setEquipmentNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [extraCost, setExtraCost] = useState<number | "">("");

  const [actionDate, setActionDate] = useState(
    () => new Date().toISOString().slice(0, 16)
  );

  const postedDate = useMemo(() => {
    return ticket.createdAt
      ? new Date(ticket.createdAt).toLocaleString("en-IN")
      : "—";
  }, [ticket.createdAt]);

  /* ---------------- ACCEPT ---------------- */
  const handleAccept = async () => {
    if (isAccepted || isAccepting) return;

    try {
      setIsAccepting(true);
      await axiosClient.patch(`/tickets/${ticket.id}/status`, {
        status: "In Progress",
      });

      setIsAccepted(true);
      onAccept({ ...ticket, status: "In Progress" });
    } catch (e) {
      console.error("Accept failed", e);
    } finally {
      setIsAccepting(false);
    }
  };

  /* ---------------- DECLINE ---------------- */
  const handleDecline = async () => {
    if (isAccepted) return;

    try {
      await axiosClient.patch(`/tickets/${ticket.id}/status`, {
        status: "Closed",
      });

      onDecline({ ...ticket, status: "Closed" });
      onClose();
    } catch (e) {
      console.error("Decline failed", e);
    }
  };

  /* ---------------- LOAD ASSIGNABLE USERS + EQUIPMENTS ---------------- */
  useEffect(() => {
    if (!isAccepted) return;

    axiosClient
      .get("/users/assignable", { params: { unitId: ticket.unitId } })
      .then((res) => setUsers(res.data.users));
	 
    axiosClient
      .get("/equipments", { params: { unitId: ticket.unitId } })
      .then((res) => setEquipments(res.data.equipments));
  }, [isAccepted, ticket.unitId]);

  /* ---------------- ASSIGN ---------------- */
  const handleAssign = async () => {
    if (!assignedToId || !deadline) {
      alert("Employee and deadline are required");
      return;
    }

    try {
      const res = await axiosClient.post(
        `/tickets/${ticket.id}/assign`,
        {
          assignedToId,
          requiredEquipmentIds,
          equipmentNote,
          deadline,
          extraCost: extraCost || 0,
        }
      );

      onAccept(res.data.ticket);
      alert("Work assigned & notification sent");
    } catch (e) {
      console.error("Assignment failed", e);
      alert("Failed to assign work");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center overflow-auto">
      <div className="w-full h-screen max-w-5xl bg-white rounded-none md:rounded-3xl shadow-xl">

       

        {/* CONTENT */}
        <div className="px-8 py-6 bg-white overflow-scroll space-y-6">

          {/* BASIC INFO */}
          
		  
							<div className="grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
								<div className="flex items-center gap-3">
                  <div className=" flex items-center justify-between">
                              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Service Call Slip</p>
                              <h2 className="text-2xl font-semibold text-slate-900 mt-1">Ticket #{ticket.id}</h2>
                            </div>
                            <button
                              onClick={onClose}
                              className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                              aria-label="Close"
                            >
                              <X className="h-5 w-5" />
                            </button>
									{/* <FileText className="h-4 w-4 text-slate-400" />
									<span>
										<strong className="text-slate-900">Ticket Number :</strong> #{ticket.id}
									</span> */}
								</div>
								<div className="flex items-center gap-3">
									<Building2 className="h-4 w-4 text-slate-400" />
									<span>
										<strong className="text-slate-900">Unit Name :</strong> {ticket.unitId || FALLBACK_UNIT}
									</span>
								</div>
							</div>
		  
							<div className="grid gap-6 text-sm text-slate-700 md:grid-cols-2">
								<div className="space-y-3">
									<p>
										<strong className="text-slate-900">Posted Date:</strong> {postedDate}
									</p>
									<p>
										<strong className="text-slate-900">Description:</strong> {ticket.description || 'No description provided.'}
									</p>
									<p>
										<strong className="text-slate-900">Room No:</strong> {ticket.Room || 'N/A'}
									</p>
									<p>
										<strong className="text-slate-900">Assigned:</strong> {ticket.assignedTo || 'Unassigned'}
									</p>
								</div>
		  
								<div className="space-y-3">
									<p className="text-rose-600 font-semibold">
										<strong className="text-slate-900">Service Request For:</strong> {ticket.title}
									</p>
									<p>
										<strong className="text-slate-900">Department:</strong> {ticket.department}
									</p>
									<p>
										<strong className="text-slate-900">Bed No:</strong> {ticket.Bed || 'N/A'}
									</p>
									<p>
										<strong className="text-slate-900">Remarks:</strong> {remarks || 'N/A'}
									</p>
								</div>
							</div>
		  
							<div className="grid gap-4 rounded-2xl border border-slate-100 p-4 text-sm text-slate-700 md:grid-cols-3">
								<p>
									<strong className="text-slate-900">Requested by:</strong> {ticket.createdBy}
								</p>
								<p>
									<strong className="text-slate-900">Floor No:</strong> {ticket.Floor || 'N/A'}
								</p>
								<div className="flex items-center gap-2">
									<strong className="text-slate-900">Call Status:</strong>
									<span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPill(ticket.status)}`}>
										{ticket.status}
									</span>
								</div>
							</div>
		  
							<div className="grid gap-4 md:grid-cols-[1fr,1fr]">
								<label className="flex flex-col gap-2 text-sm text-slate-700">
									<span className="font-semibold text-slate-900">Date & Time of Accept/Decline</span>
									<div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2">
										<CalendarClock className="h-5 w-5 text-slate-400" />
										<input
											type="datetime-local"
											value={actionDate}
											onChange={(e) => setActionDate(e.target.value)}
											className="flex-1 bg-transparent text-slate-900 focus:outline-none"
										/>
									</div>
								</label>
		  
								<label className="flex flex-col gap-2 text-sm text-slate-700">
									<span className="font-semibold text-slate-900">Remarks</span>
									<textarea
										value={remarks}
										onChange={(e) => setRemarks(e.target.value)}
										rows={3}
										className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
										placeholder="Add any notes for the engineer"
									/>
								</label>
							</div>
						
		  
						<div className="flex flex-col gap-3 border-t border-slate-100 px-8 py-6 md:flex-row md:items-center md:justify-end">
							<div className="flex flex-1 flex-wrap items-center gap-3 text-sm text-slate-500 md:justify-start">
								<div className="inline-flex items-center gap-2">
									<User2 className="h-4 w-4 text-slate-400" />
									<span>Logged by {ticket.createdBy}</span>
								</div>
								<div className="inline-flex items-center gap-2">
									<FileText className="h-4 w-4 text-slate-400" />
									<span>Category: {ticket.category}</span>
								</div>
							</div>
		  
						
						{/* </div> */}

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end">
            <button
              disabled={isAccepted}
              onClick={handleAccept}
              className={`px-6 py-2 rounded-full text-white ${
                isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600"
              }`}
            >
              Accept
            </button>

            <button
              disabled={isAccepted}
              onClick={handleDecline}
              className={`px-6 py-2 rounded-full ${
                isAccepted ? "bg-gray-200 cursor-not-allowed" : "border border-rose-300 text-rose-600"
              }`}
            >
              Decline
            </button>
          </div>
              </div>
          {/* ASSIGN SECTION */}
          {/* {isAccepted && (
            <div className="border-t pt-6 space-y-4 bg-slate-50 p-6 rounded-xl">
              <h3 className="font-semibold text-lg">Assign Work</h3>

              <select
                className="w-full border p-2 rounded"
                onChange={(e) => setAssignedToId(Number(e.target.value))}
              >
                <option value="">Select employee / admin</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>

              <input
                type="datetime-local"
                className="w-full border p-2 rounded"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />

              <input
                type="number"
                placeholder="Extra cost (optional)"
                className="w-full border p-2 rounded"
                value={extraCost}
                onChange={(e) => setExtraCost(Number(e.target.value))}
              />

              <textarea
                placeholder="Equipment / work notes"
                className="w-full border p-2 rounded"
                value={equipmentNote}
                onChange={(e) => setEquipmentNote(e.target.value)}
              />

              <button
                onClick={handleAssign}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Assign & Notify
              </button>
            </div>
          )} */}
		  {isAccepted && (
  <div className="border-t pt-6 space-y-4 bg-slate-50 p-6 rounded-xl">
    <h3 className="font-semibold text-lg">Assign Work</h3>

    {/* Assign User */}
    <select
      className="w-full border p-2 rounded"
      value={assignedToId ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        setAssignedToId(val ? Number(val) : null);
      }}
    >
      <option value="">Select employee / admin</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name} ({u.role})
        </option>
      ))}
    </select>

    {/* Deadline */}
    <input
      type="datetime-local"
      className="w-full border p-2 rounded"
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
    />

    {/* Extra Cost */}
    <input
      type="number"
      placeholder="Extra cost (optional)"
      className="w-full border p-2 rounded"
      value={extraCost}
      onChange={(e) =>
        setExtraCost(e.target.value === "" ? "" : Number(e.target.value))
      }
    />

    {/* Notes */}
    <textarea
      placeholder="Equipment / work notes"
      className="w-full border p-2 rounded"
      value={equipmentNote}
      onChange={(e) => setEquipmentNote(e.target.value)}
    />

    {/* Assign Button */}
    <button
      onClick={handleAssign}
      disabled={!assignedToId || !deadline}
      className={`px-6 py-2 rounded text-white ${
        !assignedToId || !deadline
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      Assign & Notify
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default ServiceSlip;
