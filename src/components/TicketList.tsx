import React from 'react';
import { Clock, User, AlertTriangle, Trash2 } from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority } from '../types/Ticket';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  onDeleteTicket: (id: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  onUpdateTicket,
  onDeleteTicket,
}) => {
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

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (ticket: Ticket, newStatus: TicketStatus) => {
    onUpdateTicket(ticket.id, { status: newStatus });
  };

  const handleDelete = (e: React.MouseEvent, ticketId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      onDeleteTicket(ticketId);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500">Create your first ticket to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Tickets ({tickets.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {ticket.title}
                  </h3>
                  <div className={`flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityIcon(ticket.priority)}
                    <span className="text-xs font-medium capitalize">{ticket.priority}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {ticket.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(ticket.createdAt)}
                  </div>
                  {ticket.assignee && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ticket.assignee}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>Reporter:</span>
                    {ticket.reporter}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket, e.target.value as TicketStatus)}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(ticket.status)}`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                
                <button
                  onClick={(e) => handleDelete(e, ticket.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Delete ticket"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;