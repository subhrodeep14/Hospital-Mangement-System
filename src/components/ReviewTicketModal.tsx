import { useState } from "react";
import { axiosClient } from "../api/axiosClient";

export default function TicketModal({ ticket, onClose, user }: any) {
  const [note, setNote] = useState("");

  const startWork = () =>
    axiosClient.patch(`/tickets/${ticket.id}/start`);

  const complete = () =>
    axiosClient.patch(`/tickets/${ticket.id}/complete`);

  const verifyManager = () =>
    axiosClient.patch(`/tickets/${ticket.id}/manager-verify`, {
      note,
    });

  const verifyDept = () =>
    axiosClient.patch(`/tickets/${ticket.id}/department-verify`, {
      note,
    });

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl w-[500px] space-y-4">

        <h2 className="text-xl font-bold">
          {ticket.title}
        </h2>

        <p>{ticket.description}</p>

        {/* EMPLOYEE */}
        {user.role === "employee" && (
          <>
            <button
              onClick={startWork}
              className="btn"
            >
              Start Work
            </button>

            <button
              onClick={complete}
              className="btn"
            >
              Complete Work
            </button>
          </>
        )}

        {/* MANAGER */}
        {user.role === "manager" && (
          <>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              placeholder="Review note"
              className="w-full border p-2"
            />

            <button
              onClick={verifyManager}
              className="btn"
            >
              Verify Work
            </button>
          </>
        )}

        {/* DEPARTMENT */}
        {user.role === "admin" && (
          <>
            <textarea
              onChange={(e) => setNote(e.target.value)}
              placeholder="Final note"
              className="w-full border p-2"
            />

            <button
              onClick={verifyDept}
              className="btn"
            >
              Close Ticket
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="btn bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}
