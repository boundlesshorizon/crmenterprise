export type Role = 'Admin' | 'Technician' | 'FrontDesk';

export type TicketStatus = 'Intake' | 'Diagnostics' | 'Waiting on Parts' | 'Ready for Pickup';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ltv: number;
  type: 'Corporate' | 'Individual';
}

export interface Ticket {
  id: string;
  customerId: string;
  device: string;
  serial?: string;
  issue: string;
  status: TicketStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
