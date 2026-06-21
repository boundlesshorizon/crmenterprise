import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from '../types';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export function QRCodeModal({ isOpen, onClose, ticket }: QRCodeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && ticket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-100">Device Tracking QR</h3>
              <button 
                onClick={onClose}
                className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeCanvas 
                  value={JSON.stringify({ id: ticket.id, device: ticket.device, serial: ticket.serial })}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center space-y-1 mt-6">
                <p className="text-zinc-100 font-medium">{ticket.device}</p>
                {ticket.serial && <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase">SN: {ticket.serial}</p>}
                <p className="text-zinc-500 text-xs font-mono tracking-widest mt-2">{ticket.id.toUpperCase()}</p>
              </div>
            </div>
            
            <div className="bg-zinc-950 p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
              Scan with mobile companion app to update status.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
