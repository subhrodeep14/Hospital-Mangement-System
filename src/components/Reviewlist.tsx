
import React, { useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  Users,
  ArrowRightCircle,
  MapPin,
  Layers,
  Clock
} from "lucide-react";
import { Ticket } from "../types";
import { axiosClient } from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";

const ReviewTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  /* FETCH BY ROLE */
  useEffect(() => {
    if (!user) return;

    let url = "";

    if (user.role === "admin") url = "/tickets/admin/my";
    if (user.role === "manager") url = "/tickets/manager/my";
    if (user.role === "employee") url = "/tickets/employee/my";

    axiosClient.get(url)
      .then(res => setTickets(res.data.tickets))
      .finally(() => setLoading(false));
  }, [user]);

  const respond = (id: number, action: "accept" | "decline") => {
    axiosClient
      .patch(`/tickets/${id}/respond`, { action })
      .then(() => {
        setTickets(t =>
          t.map(ticket =>
           toString. ticket.id === id
              ? { ...ticket, status: action === "accept" ? "In Progress" : "Pending" }
              : ticket
          )
        );
      });
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {user?.role.toUpperCase()} DASHBOARD
        </h1>
        <p className="text-gray-500">
          All tickets related to you
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {tickets.map(ticket => (
          <div
            key={ticket.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >

            {/* TOP */}
            <div className="flex justify-between">
              <span className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700">
                {ticket.priority}
              </span>

              <span className="px-3 py-1 text-sm rounded bg-gray-100">
                {ticket.status}
              </span>
            </div>

            {/* TITLE */}
            <h2 className="mt-4 text-xl font-semibold">
              {ticket.title}
            </h2>

            <p className="mt-2 text-gray-600 line-clamp-3">
              {ticket.description}
            </p>

            {/* DETAILS */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p className="flex gap-2">
                <Users size={16} /> Department: {ticket.department}
              </p>

              <p className="flex gap-2">
                <Layers size={16} /> Category: {ticket.category}
              </p>

              <p className="flex gap-2">
                <MapPin size={16} /> Location:
                Floor {ticket.Floor || "-"} /
                Room {ticket.Room || "-"} /
                Bed {ticket.Bed || "-"}
              </p>

              <p className="flex gap-2">
                <Clock size={16} />
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <p className="text-sm">
                Created by:
                <span className="font-medium ml-1">
                  {ticket.createdBy}
                </span>
              </p>

              {/* EMPLOYEE ACTION */}
              {user?.role === "employee" &&
                ticket.status === "Pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => respond(ticket.id, "accept")}
                      className="px-4 py-1 bg-green-600 text-white rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => respond(ticket.id, "decline")}
                      className="px-4 py-1 bg-red-600 text-white rounded"
                    >
                      Decline
                    </button>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTickets;
