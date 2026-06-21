import { useState, ReactNode } from 'react';
import { useStore } from './store';
import { Role, Ticket } from './types';
import { KanbanBoard } from './components/KanbanBoard';
import { CustomersView } from './components/CustomersView';
import { AnalyticsView } from './components/AnalyticsView';
import { QRCodeModal } from './components/QRCodeModal';
import { cn } from './utils';
import { 
  MonitorSmartphone, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Bell, 
  ShieldAlert,
  TerminalSquare
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type Tab = 'Board' | 'Clients' | 'Analytics';

export default function App() {
  const role = useStore(state => state.role);
  const setRole = useStore(state => state.setRole);
  const notices = useStore(state => state.notices);
  
  const [activeTab, setActiveTab] = useState<Tab>('Board');
  const [qrTicket, setQrTicket] = useState<Ticket | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex overflow-hidden selection:bg-blue-500/30">
      
      {/* Sidebar - Collapsed on small, wide on large */}
      <aside className="w-16 lg:w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col pt-0 shrink-0 z-20">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-center lg:justify-start gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white">
            L
          </div>
          <span className="text-xl font-semibold tracking-tight hidden lg:block text-zinc-100">
            LYRA <span className="text-zinc-500 font-normal underline underline-offset-4 decoration-blue-500">4-D</span>
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-3">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Service Board" 
            active={activeTab === 'Board'} 
            onClick={() => setActiveTab('Board')} 
          />
          <NavItem 
            icon={<Users className="w-5 h-5" />} 
            label="Client Database" 
            active={activeTab === 'Clients'} 
            onClick={() => setActiveTab('Clients')} 
          />
          {role === 'Admin' && (
            <NavItem 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Analytics" 
              active={activeTab === 'Analytics'} 
              onClick={() => setActiveTab('Analytics')} 
            />
          )}
        </nav>

        <div className="px-3 mt-auto flex flex-col gap-4">
          <div className="hidden lg:block">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 px-3 mb-2 block">System Role (RBAC Demo)</label>
            <select 
              value={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
                if (e.target.value !== 'Admin' && activeTab === 'Analytics') {
                  setActiveTab('Board');
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="Admin">Owner / Admin</option>
              <option value="Technician">Technician</option>
              <option value="FrontDesk">Front Desk</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen relative">
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center px-10 shrink-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-semibold text-zinc-100 hidden sm:block">Enterprise Overview</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors relative">
               <Bell className="w-5 h-5" />
               {notices.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300">
               {role.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto bg-[#09090b]">
          <div className="p-6 md:p-10 max-w-[1600px] mx-auto h-full">
            {activeTab === 'Board' && <KanbanBoard onOpenQR={setQrTicket} />}
            {activeTab === 'Clients' && <CustomersView />}
            {activeTab === 'Analytics' && <AnalyticsView />}
          </div>
        </div>

        {/* Real-time Automation Logs overlay floating */}
        <div className="absolute bottom-6 right-6 w-80 pointer-events-none flex flex-col justify-end gap-2 z-50 overflow-hidden">
          <AnimatePresence>
            {notices.slice(0, 3).map((notice) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 shadow-2xl flex gap-3 items-start pointer-events-auto"
              >
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0 animate-pulse" />
                 <p className="text-xs text-zinc-300 leading-relaxed font-medium">{notice.msg}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <QRCodeModal 
        isOpen={!!qrTicket} 
        onClose={() => setQrTicket(null)} 
        ticket={qrTicket} 
      />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group w-full",
        active ? "bg-zinc-800 text-blue-400 font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
      )}
    >
      <div className={cn("transition-colors", active ? "text-blue-400" : "text-zinc-400 group-hover:text-white")}>
        {icon}
      </div>
      <span className="hidden lg:block text-sm">{label}</span>
    </button>
  );
}

