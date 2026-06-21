import { useState, useEffect, FormEvent } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer } from '../types';
import { useStore } from '../store';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const addCustomer = useStore(state => state.addCustomer);
  const updateCustomer = useStore(state => state.updateCustomer);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Individual' as 'Corporate' | 'Individual',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        type: customer.type,
      });
    } else {
      setFormData({ name: '', email: '', phone: '', type: 'Individual' });
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (customer) {
      updateCustomer(customer.id, formData);
    } else {
      addCustomer(formData);
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
                {customer ? 'Edit Client' : 'New Client'}
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
                <label className="block text-xs font-medium text-zinc-400 mb-1">Company / Full Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                  placeholder="Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Email</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                    placeholder="contact@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Phone</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
                    placeholder="555-1234"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Client Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="Individual">Individual</option>
                  <option value="Corporate">Corporate / Enterprise</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
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
                   {customer ? 'Save Changes' : 'Create Client'}
                 </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
