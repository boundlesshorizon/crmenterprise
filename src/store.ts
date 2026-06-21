import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Ticket, Role, TicketStatus } from './types';

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Acme Corp', email: 'it@acmecorp.com', phone: '555-0199', ltv: 12500, type: 'Corporate' },
  { id: 'c2', name: 'John Doe', email: 'john@example.com', phone: '555-0123', ltv: 350, type: 'Individual' },
  { id: 'c3', name: 'Stark Industries', email: 'tony@stark.com', phone: '555-9000', ltv: 85200, type: 'Corporate' },
];

const MOCK_TICKETS: Ticket[] = [
  { id: 't1', customerId: 'c1', device: 'ThinkPad T14', issue: 'Mainboard failure', status: 'Diagnostics', notes: 'Checked RAM, issue persists.', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 't2', customerId: 'c1', device: 'Dell XPS 13', issue: 'Screen replacement', status: 'Waiting on Parts', notes: 'Ordered Display Assembly #892', createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 't3', customerId: 'c2', device: 'iPhone 15 Pro', issue: 'Battery drain', status: 'Intake', notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't4', customerId: 'c2', device: 'MacBook Air M2', issue: 'Water damage', status: 'Ready for Pickup', notes: 'Cleaned logic board, passed stress test.', createdAt: new Date(Date.now() - 400000000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 't5', customerId: 'c3', device: 'Server Rack Module A', issue: 'PSU Fault', status: 'Intake', notes: 'Requires high-capacity swap.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  customers: Customer[];
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketNotes: (ticketId: string, notes: string) => void;
  addNotice: (msg: string) => void;
  notices: { id: string; msg: string; time: string }[];
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'Admin',
      setRole: (role) => set({ role }),
      customers: MOCK_CUSTOMERS,
      tickets: MOCK_TICKETS,
      notices: [],
      addNotice: (msg) => set((state) => ({
        notices: [{ id: Math.random().toString(), msg, time: new Date().toISOString() }, ...state.notices].slice(0, 8)
      })),
      addTicket: (ticketData) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newTicket: Ticket = {
          ...ticketData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { tickets: [...state.tickets, newTicket] };
      }),
      updateTicketStatus: (ticketId, status) => set((state) => {
        const ticket = state.tickets.find(t => t.id === ticketId);
        const customer = state.customers.find(c => c.id === ticket?.customerId);
        
        let notices = state.notices;
        if (ticket && ticket.status !== status) {
          // Automated silent status update trigger
          const msg = `Automated SMS/Email sent to ${customer?.name}: "Your device ${ticket.device} is now in ${status}"`;
          notices = [{ id: Math.random().toString(), msg, time: new Date().toISOString() }, ...state.notices].slice(0, 8);
        }

        return {
          tickets: state.tickets.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t),
          notices
        };
      }),
      updateTicketNotes: (ticketId, notes) => set((state) => ({
        tickets: state.tickets.map(t => t.id === ticketId ? { ...t, notes, updatedAt: new Date().toISOString() } : t)
      }))
    }),
    { name: 'lyra-crm-storage' }
  )
);
