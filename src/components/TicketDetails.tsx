import React, { useState } from 'react';
import { X, Clock, User, AlertTriangle, Edit2, Save, Ambulance as Cancel } from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority } from '../types/Ticket';

interface TicketDetailsProps {
  ticket: Ticket | null;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onClose: () => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({
  ticket,
  onUpdateTicket,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Ticket>>({});

  if (!ticket) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No ticket selected</h3>
        <p className="text-gray-500">Select a ticket from the list to view details.</p>
      </div>
    );
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'urgent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    setEditData({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignee: ticket.assignee,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateTicket(ticket.id, editData);
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Ticket Details</h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Edit ticket"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-700 transition-colors p-1"
                title="Save changes"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Cancel editing"
              >
                <Cancel className="h-4 w-4" />
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 lg:hidden"
            title="Close details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editData.title || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
          )}
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={editData.status || ticket.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('-', ' ')}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            {isEditing ? (
              <select
                name="priority"
                value={editData.priority || ticket.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            ) : (
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {(ticket.priority === 'urgent' || ticket.priority === 'high') && (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {isEditing ? (
            <textarea
              name="description"
              rows={4}
              value={editData.description || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
          )}
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          {isEditing ? (
            <input
              type="text"
              name="assignee"
              value={editData.assignee || ''}
              onChange={handleChange}
              placeholder="Assign to someone"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{ticket.assignee || 'Unassigned'}</span>
            </div>
          )}
        </div>

        {/* Reporter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reporter</label>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900">{ticket.reporter}</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Created: {formatDate(ticket.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Updated: {formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;