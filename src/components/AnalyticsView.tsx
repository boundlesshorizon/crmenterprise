import { useStore } from '../store';
import { BarChart3, TrendingUp, DollarSign, Activity, Building2 } from 'lucide-react';
import { ReactNode } from 'react';

export function AnalyticsView() {
  const customers = useStore(state => state.customers);
  const tickets = useStore(state => state.tickets);
  
  const totalLtv = customers.reduce((acc, c) => acc + c.ltv, 0);
  const activeTickets = tickets.filter(t => t.status !== 'Ready for Pickup').length;
  const corporateValue = customers.filter(c => c.type === 'Corporate').reduce((acc, c) => acc + c.ltv, 0);

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Enterprise Analytics</h2>
        <p className="text-sm text-zinc-500 mt-1">Multi-branch roll-up and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={<DollarSign />} label="Total Revenue (LTV)" value={`$${totalLtv.toLocaleString()}`} trend="+12.5%" trendGood />
        <StatsCard icon={<Activity />} label="Active Repairs" value={activeTickets.toString()} />
        <StatsCard icon={<Building2 />} label="Corporate Rev." value={`$${corporateValue.toLocaleString()}`} trend="+8.2%" trendGood />
        <StatsCard icon={<BarChart3 />} label="Avg Repair Time" value="48h" trend="-4h" trendGood />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-80 flex flex-col items-center justify-center overflow-hidden">
             <div className="text-zinc-600 font-mono text-sm border border-zinc-800/50 bg-zinc-950/50 px-4 py-2 rounded-full z-10">
                [ VISUALIZATION ENGINE OFFLINE IN PREVIEW ]
             </div>
             <p className="text-xs text-zinc-700 mt-4 z-10 max-w-xs text-center">
                 D3/Recharts modules load dynamic revenue series across regions natively here during standard operations.
             </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-zinc-300 mb-4">Branch Performance</h3>
            <div className="space-y-4">
               {['Downtown Hub', 'Westside', 'Uptown Kiosk'].map((branch, i) => (
                   <div key={branch} className="flex justify-between items-center text-sm">
                       <span className="text-zinc-400">{branch}</span>
                       <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${80 - i * 15}%` }} />
                           </div>
                           <span className="text-xs font-mono text-zinc-500">{80 - i * 15}%</span>
                       </div>
                   </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, trend, trendGood }: { icon: ReactNode, label: string, value: string, trend?: string, trendGood?: boolean }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</p>
                <div className="p-1 bg-zinc-800/50 rounded text-zinc-400">{icon}</div>
            </div>
            <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
            {trend && (
                <p className={`text-xs mt-2 ${trendGood ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend}
                </p>
            )}
        </div>
    )
}
