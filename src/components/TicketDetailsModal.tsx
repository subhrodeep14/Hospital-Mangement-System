import React, { useState } from 'react';
import { Ticket, Equipment, TicketComment } from '../types';
import { 
  X, 
  User, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  MessageSquare, 
  Send,
  Clock,
  CheckCircle,
  Edit
} from 'lucide-react';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onUpdate: (ticket: Ticket) => void;
  equipments: Equipment[];
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onUpdate,
  equipments
}) => {
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: ticket.status,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo || ''
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-purple-100 text-purple-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const relatedEquipment = equipments.find(eq => eq.id === ticket.equipmentId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: TicketComment = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      author: 'Current User', // In real app, this would be the logged-in user
      content: newComment,
      createdAt: new Date().toISOString(),
      isInternal: false
    };

    const updatedTicket: Ticket = {
      ...ticket,
      comments: [...ticket.comments, comment],
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedTicket);
    setNewComment('');
  };

  const handleSaveChanges = () => {
    const updatedTicket: Ticket = {
      ...ticket,
      ...editData,
      updatedAt: new Date().toISOString(),
      resolvedAt: editData.status === 'Resolved' && ticket.status !== 'Resolved' 
        ? new Date().toISOString() 
        : ticket.resolvedAt
    };

    onUpdate(updatedTicket);
    setIsEditing(false);
  };

  const statuses: Ticket['status'][] = ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];
  const priorities: Ticket['priority'][] = ['Low', 'Medium', 'High', 'Critical'];
  const assignees = [
    'Dr. Priya Sharma',
    'IT Team Lead',
    'Biomedical Engineer',
    'Maintenance Supervisor',
    'Security Manager',
    'HR Manager',
    'Admin Manager'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
            <span className="text-sm text-gray-500">#{ticket.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Ticket"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Header */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{ticket.title}</h3>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {ticket.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed">{ticket.description}</p>
              </div>

              {/* Related Equipment */}
              {relatedEquipment && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Related Equipment</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{relatedEquipment.name}</p>
                      <p className="text-sm text-gray-600">{relatedEquipment.manufacturer} • {relatedEquipment.model}</p>
                      <p className="text-sm text-gray-500">Location: {relatedEquipment.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      relatedEquipment.status === 'Active' ? 'bg-green-100 text-green-700' :
                      relatedEquipment.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {relatedEquipment.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Comments ({ticket.comments.length})
                </h4>
                
                <div className="space-y-4 mb-6">
                  {ticket.comments.map((comment) => (
                    <div key={comment.id} className={`p-4 rounded-lg ${comment.isInternal ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          {comment.isInternal && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              Internal
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{getTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="border-t pt-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {isEditing ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Edit Ticket</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as Ticket['status'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={editData.priority}
                        onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                      <select
                        value={editData.assignedTo}
                        onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Unassigned</option>
                        {assignees.map(assignee => (
                          <option key={assignee} value={assignee}>{assignee}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveChanges}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Ticket Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.assignedTo || 'Unassigned'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
                      </div>
                    </div>

                    {ticket.resolvedAt && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Resolved</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(ticket.resolvedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Reporter Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Reporter Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.createdBy}</p>
                      <p className="text-sm text-gray-600">{ticket.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Status Updates */}
              {!isEditing && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    {ticket.status === 'Open' && (
                      <button
                        onClick={() => {
                          const updatedTicket = { ...ticket, status: 'In Progress' as Ticket['status'], updatedAt: new Date().toISOString() };
                          onUpdate(updatedTicket);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Start Working
                      </button>
                    )}
                    {(ticket.status === 'In Progress' || ticket.status === 'Pending') && (
                      <button
                        onClick={() => {
                          const updatedTicket = { 
                            ...ticket, 
                            status: 'Resolved' as Ticket['status'], 
                            updatedAt: new Date().toISOString(),
                            resolvedAt: new Date().toISOString()
                          };
                          onUpdate(updatedTicket);
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    )}
                    {ticket.status === 'Resolved' && (
                      <button
                        onClick={() => {
                          const updatedTicket = { ...ticket, status: 'Closed' as Ticket['status'], updatedAt: new Date().toISOString() };
                          onUpdate(updatedTicket);
                        }}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;