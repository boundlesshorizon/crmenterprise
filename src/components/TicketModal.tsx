import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketStatus } from '../types';
import { useStore } from '../store';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket;
}

export function TicketModal({ isOpen, onClose, ticket }: TicketModalProps) {
  const customers = useStore(state => state.customers);
  const addTicket = useStore(state => state.addTicket);
  const updateTicket = useStore(state => state.updateTicket);

  const [formData, setFormData] = useState({
    customerId: '',
    device: '',
    serial: '',
    issue: '',
    notes: '',
    status: 'Intake' as TicketStatus,
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        customerId: ticket.customerId,
        device: ticket.device,
        serial: ticket.serial || '',
        issue: ticket.issue,
        notes: ticket.notes,
        status: ticket.status,
      });
    } else {
      setFormData({
        customerId: customers[0]?.id || '',
        device: '',
        serial: '',
        issue: '',
        notes: '',
        status: 'Intake',
      });
    }
  }, [ticket, customers, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) return alert("Select a client");

    if (ticket) {
      updateTicket(ticket.id, formData);
    } else {
      addTicket(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100">
                {ticket ? 'Edit Ticket' : 'New Ticket'}
              </h3>
              <button 
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Client</label>
                <select 
                  required
                  value={formData.customerId}
                  onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="" disabled>Select client...</option>
                  {customers.map(c => (
                     <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Item / Vehicle (Make & Model)</label>
                <input 
                  required
                  type="text"
                  value={formData.device}
                  onChange={e => setFormData({ ...formData, device: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. MacBook Pro M3, Ford F150, Samsung A/C"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Serial Number / VIN / Plate (Optional)</label>
                <input 
                  type="text"
                  value={formData.serial}
                  onChange={e => setFormData({ ...formData, serial: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 font-mono uppercase"
                  placeholder="e.g. C02X1234, ABC-1234"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Reported Issue</label>
                <input 
                  required
                  type="text"
                  value={formData.issue}
                  onChange={e => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Screen cracked, Check engine light, Board fried"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Internal Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 resize-none h-20"
                  placeholder="Diagnostics info, part orders, progress..."
                />
              </div>

              {ticket && (
                 <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as TicketStatus })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="Intake">Intake</option>
                      <option value="Diagnostics">Diagnostics</option>
                      <option value="Waiting on Parts">Waiting on Parts</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                    </select>
                 </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                 <button 
                   type="button"
                   onClick={onClose}
                   className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                 >
                   {ticket ? 'Save Changes' : 'Create Ticket'}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
