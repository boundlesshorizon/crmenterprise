import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore } from '../store';
import { TicketStatus, Ticket } from '../types';
import { QrCode, Clock, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../utils';

const COLUMNS: TicketStatus[] = ['Intake', 'Diagnostics', 'Waiting on Parts', 'Ready for Pickup'];

interface KanbanBoardProps {
  onOpenQR: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
}

export function KanbanBoard({ onOpenQR, onEditTicket }: KanbanBoardProps) {
  const tickets = useStore(state => state.tickets);
  const customers = useStore(state => state.customers);
  const updateTicketStatus = useStore(state => state.updateTicketStatus);
  const deleteTicket = useStore(state => state.deleteTicket);
  const role = useStore(state => state.role);
  const updateTicketNotes = useStore(state => state.updateTicketNotes);

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    if (role === 'FrontDesk' && destination.droppableId !== 'Intake' && destination.droppableId !== 'Ready for Pickup') {
      alert("Front Desk can only process Intake or Pickup stages.");
      return;
    }

    const newStatus = destination.droppableId as TicketStatus;
    updateTicketStatus(draggableId, newStatus);
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full w-full gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colTickets = tickets.filter(t => t.status === col);
          
          return (
            <div key={col} className="flex-shrink-0 w-[320px] flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  {col}
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    col === 'Intake' ? "bg-blue-500" :
                    col === 'Diagnostics' ? "bg-amber-500" :
                    col === 'Waiting on Parts' ? "bg-zinc-500" : "bg-emerald-500"
                  )} />
                </h3>
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {colTickets.length}
                </span>
              </div>
              
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-[150px] transition-colors",
                      snapshot.isDraggingOver && "bg-zinc-800/30"
                    )}
                  >
                    {colTickets.map((ticket, index) => {
                      const customer = customers.find(c => c.id === ticket.customerId);
                      
                      return (
                        //@ts-expect-error key is standard in React but sometimes breaks types here
                        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "group bg-zinc-800 p-3 rounded-lg border flex flex-col gap-3 transition-all",
                                snapshot.isDragging ? "border-blue-500/50 shadow-blue-500/10 shadow-xl opacity-90 scale-105" : "border-zinc-700/50 hover:border-zinc-600"
                              )}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-[10px] text-blue-400 font-mono mb-1">
                                    QR: #{ticket.id.toUpperCase()}
                                  </div>
                                  <p className="font-medium text-zinc-100 text-xs leading-tight">{customer?.name}</p>
                                </div>
                                <div className="flex items-center">
                                  {role !== 'FrontDesk' && (
                                    <>
                                      <button
                                        onClick={() => onEditTicket(ticket)}
                                        className="text-zinc-500 hover:text-blue-400 transition-colors pb-1 px-1"
                                        title="Edit Ticket"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      {role === 'Admin' && (
                                        <button
                                          onClick={() => window.confirm('Delete ticket?') && deleteTicket(ticket.id)}
                                          className="text-zinc-500 hover:text-red-400 transition-colors pb-1 px-1"
                                          title="Delete Ticket"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </>
                                  )}
                                  <button
                                    onClick={() => onOpenQR(ticket)}
                                    className="text-zinc-500 hover:text-blue-400 transition-colors pb-1 pl-1"
                                    title="Tracking QR"
                                  >
                                    <QrCode className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <div className="text-xs font-medium text-zinc-300">{ticket.device}</div>
                                {ticket.serial && <div className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">SN: {ticket.serial}</div>}
                                <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{ticket.issue}</div>
                              </div>

                              {ticket.notes && (
                                <div className="text-[10px] text-zinc-400 border-l border-zinc-700 pl-2 mt-1">
                                  <p className="line-clamp-2 italic">{ticket.notes}</p>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-700/50 mt-1">
                                <span className="flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(ticket.updatedAt))}
                                </span>
                                <span className="font-mono">{customer?.type.toUpperCase()}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
