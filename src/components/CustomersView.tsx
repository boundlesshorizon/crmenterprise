import { useState } from 'react';
import { useStore } from '../store';
import { Customer } from '../types';
import { Building2, User, Phone, Mail, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { CustomerModal } from './CustomerModal';

export function CustomersView() {
  const customers = useStore(state => state.customers);
  const deleteCustomer = useStore(state => state.deleteCustomer);
  const role = useStore(state => state.role);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const openNewCustomer = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Client Database</h2>
          <p className="text-sm text-zinc-500 mt-1">Manage corporate accounts and individuals.</p>
        </div>
        <button 
          onClick={openNewCustomer}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
        >
          New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                  {customer.type === 'Corporate' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-zinc-100 font-medium">{customer.name}</h3>
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">{customer.type}</span>
                </div>
              </div>
              {role === 'Admin' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEditCustomer(customer)}
                    className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.confirm('Delete client and all their tickets?') && deleteCustomer(customer.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Mail className="w-4 h-4 text-zinc-600" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <Phone className="w-4 h-4 text-zinc-600" />
                <span>{customer.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">LIFETIME VALUE</span>
              <span className="text-emerald-400 font-mono font-medium flex items-center">
                <DollarSign className="w-3.5 h-3.5" />
                {customer.ltv.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <CustomerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
      />
    </div>
  );
}
