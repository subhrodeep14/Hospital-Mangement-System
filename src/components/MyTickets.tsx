import React, { useEffect, useState } from "react";
import {
  Calendar,
  AlertTriangle,
  Users,
  MapPin,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Edit,
  Eye,
  ArrowRight
} from "lucide-react";
import { Ticket } from "../types";
import { axiosClient } from "../api/axiosClient";
import { useAuth } from "../hooks/useAuth";

interface ExtendedTicket extends Ticket {
  assignedToName?: string;
  comment?: string;
}

const MyTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<ExtendedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ExtendedTicket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updateComment, setUpdateComment] = useState("");

  useEffect(() => {
    if (!user) return;

    let url = "";
    if (user.role === "admin") url = "/tickets/admin/assigned";
    else if (user.role === "manager") url = "/tickets/manager/assigned";
    else if (user.role === "employee") url = "/tickets/employee/assigned";

    axiosClient.get(url)
      .then(res => setTickets(res.data.tickets))
      .finally(() => setLoading(false));
  }, [user]);

  const handleAction = async (id: number, action: string, data?: any) => {
    try {
      let endpoint = "";
      if (action === "assign") endpoint = `/tickets/${id}/assign`;
      else if (action === "accept") endpoint = `/tickets/${id}/accept`;
      else if (action === "update") endpoint = `/tickets/${id}/update`;
      else if (action === "close") endpoint = `/tickets/${id}/close`;
      else if (action === "verify") endpoint = `/tickets/${id}/verify`;

      const method = action === "assign" ? "post" : "patch";
      await axiosClient[method](endpoint, data);

      // Refresh tickets
      window.location.reload();
    } catch (error) {
      alert("Action failed");
    }
  };

  const openModal = (ticket: ExtendedTicket) => {
    setSelectedTicket(ticket);
    setUpdateComment(ticket.comment || "");
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Tickets
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === "admin" && "New tickets awaiting assignment"}
            {user?.role === "manager" && "Tickets assigned to you and pending verification"}
            {user?.role === "employee" && "Tickets assigned to you"}
          </p>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <button
                    onClick={() => openModal(ticket)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                  >
                    <Eye size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {ticket.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">
                  {ticket.description}
                </p>
              </div>

              {/* Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span>{ticket.department}</span>
                </div>

                {ticket.Floor && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span>Floor {ticket.Floor}, Room {ticket.Room || 'N/A'}, Bed {ticket.Bed || 'N/A'}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Layers size={16} className="mr-2" />
                  <span>{ticket.category}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>

                {ticket.assignedToName && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2" />
                    <span>Assigned to: {ticket.assignedToName}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex space-x-2">
                  {user?.role === "admin" && ticket.status === "Pending" && (
                    <button
                      onClick={() => handleAction(ticket.id, "assign", { assignedToId: 2 })} // Example manager ID
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      Assign Manager
                    </button>
                  )}

                  {user?.role === "manager"  && (
                    <button
                      onClick={() => handleAction(ticket.id, "assign", { assignedToId: 3 })} // Example employee ID
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <ArrowRight size={16} className="mr-2" />
                      Assign Employee
                    </button>
                  )}

                  {user?.role === "manager" && ticket.status === "Resolved" && (
                    <button
                      onClick={() => handleAction(ticket.id, "verify")}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Verify & Close
                    </button>
                  )}

                  {user?.role === "employee"  && (
                    <button
                      onClick={() => handleAction(ticket.id, "accept")}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Accept
                    </button>
                  )}

                  {user?.role === "employee"&& (
                    <>
                      <button
                        onClick={() => openModal(ticket)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Edit size={16} className="mr-2" />
                        Update
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, "close")}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">You don't have any assigned tickets at the moment.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.title}</h2>
                  <div className="flex space-x-2 mt-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Department:</strong> {selectedTicket.department}</p>
                    <p><strong>Category:</strong> {selectedTicket.category}</p>
                    <p><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                    {selectedTicket.Floor && (
                      <p><strong>Location:</strong> Floor {selectedTicket.Floor}, Room {selectedTicket.Room}, Bed {selectedTicket.Bed}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Assignment</h3>
                  <div className="space-y-2 text-sm">
                    {selectedTicket.assignedToName ? (
                      <p><strong>Assigned to:</strong> {selectedTicket.assignedToName}</p>
                    ) : (
                      <p className="text-gray-500">Not assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {user?.role === "employee" && selectedTicket.status === "In Progress" && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Update Work Progress</h3>
                  <textarea
                    value={updateComment}
                    onChange={(e) => setUpdateComment(e.target.value)}
                    placeholder="Describe your progress, equipment used, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <button
                    onClick={() => {
                      handleAction(selectedTicket.id, "update", { comment: updateComment });
                      setShowModal(false);
                    }}
                    className="mt-3 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Progress
                  </button>
                </div>
              )}

              {selectedTicket.comment && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Work Updates</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTicket.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;