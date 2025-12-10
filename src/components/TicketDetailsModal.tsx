import React, { useState } from 'react';
import { Ticket, Equipment, TicketComment } from '../types';
import { TICKET_CATEGORIES } from '../constants/category';

import { 
  X, 
  User, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  MessageSquare, 
  Send,
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

  // ⬅ Category added here
  const [editData, setEditData] = useState({
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
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
    return `${Math.floor(diffInHours / 24)}d ago`;
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

  const relatedEquipment = equipments.find(eq => eq.id === ticket.id);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: TicketComment = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      author: 'Current User',
      content: newComment,
      createdAt: new Date().toISOString(),
      isInternal: false
    };

    onUpdate({
      ...ticket,
      comments: [...ticket.comments, comment],
      updatedAt: new Date().toISOString()
    });

    setNewComment('');
  };

  const handleSaveChanges = () => {
    onUpdate({
      ...ticket,
      ...editData,
      updatedAt: new Date().toISOString(),
      resolvedAt:
        editData.status === 'Resolved' && ticket.status !== 'Resolved'
          ? new Date().toISOString()
          : ticket.resolvedAt
    });

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
      <div className="bg-white rounded-xl max-w-5xl w-full max-height-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
            <span className="text-sm text-gray-500">#{ticket.id}</span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
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

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* HEADER DETAILS */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{ticket.title}</h3>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>

                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>

                {/* CATEGORY DISPLAY */}
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {ticket.category}
                </span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-3">Description</h4>
              <p className="text-gray-700">{ticket.description}</p>
            </div>

            {/* COMMENTS */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments ({ticket.comments.length})
              </h4>

              {ticket.comments.map(comment => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg mb-4 ${
                    comment.isInternal
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{comment.author}</span>

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

              {/* ADD COMMENT */}
              <div className="border-t pt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border rounded-lg"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                  >
                    Add Comment
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* EDIT MODE */}
            {isEditing ? (
              <div className="p-6 border rounded-lg space-y-4">

                {/* STATUS */}
                <div>
                  <label>Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* PRIORITY */}
                <div>
                  <label>Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {priorities.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                {/* CATEGORY — NEW */}
                <div>
                  <label>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    {TICKET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* ASSIGN TO */}
                <div>
                  <label>Assign To</label>
                  <select
                    value={editData.assignedTo}
                    onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Unassigned</option>
                    {assignees.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveChanges}
                  className="w-full bg-blue-600 text-white p-2 rounded-lg"
                >
                  Save Changes
                </button>

              </div>
            ) : (

              /* VIEW MODE */
              <div className="p-6 border rounded-lg space-y-4">
                <div>
                  <p>Status:</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>

                <div>
                  <p>Priority:</p>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div>
                  <p>Category:</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {ticket.category}
                  </span>
                </div>

                <div>
                  <p>Assigned To:</p>
                  <span>{ticket.assignedTo || 'Unassigned'}</span>
                </div>

                <div>
                  <p>Created:</p>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketDetailsModal;
