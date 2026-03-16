import { useStore } from '../../store/useStore';
import { formatTimestamp } from '../../utils/helpers';
import type { OrderStatus, Order } from '../../types';
import { Clock, ChefHat, CheckCircle, ArrowRight, Package, Flame, Coffee, Check, Search } from 'lucide-react';
import { useState } from 'react';

const statuses: OrderStatus[] = ['Pending', 'Preparing', 'Ready'];

const statusConfig: Record<OrderStatus, { color: string; bg: string; borderColor: string; icon: any; title: string; btnColor: string }> = {
  Pending: { 
    color: 'text-tomato', 
    bg: 'bg-tomato/5', 
    borderColor: 'border-tomato/20',
    icon: Flame, 
    title: 'New Orders',
    btnColor: 'from-tomato to-tomato-light hover:shadow-tomato/20'
  },
  Preparing: { 
    color: 'text-gold-dark', 
    bg: 'bg-[#C38D2F]/10', 
    borderColor: 'border-[#C38D2F]/30',
    icon: ChefHat, 
    title: 'In Progress',
    btnColor: 'from-[#C38D2F] to-[#D4A34F] hover:shadow-gold/20'
  },
  Ready: { 
    color: 'text-olive', 
    bg: 'bg-olive/10', 
    borderColor: 'border-olive/30',
    icon: CheckCircle, 
    title: 'Ready for Pickup',
    btnColor: 'from-olive to-olive-light hover:shadow-olive/20'
  },
  Completed: { 
    color: 'text-warm-gray', 
    bg: 'bg-warm-gray/10', 
    borderColor: 'border-warm-gray/20',
    icon: Package, 
    title: 'Completed',
    btnColor: ''
  },
};

const nextStatus: Record<OrderStatus, OrderStatus | null> = {
  Pending: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
  Completed: null,
};

function OrderCard({ order, onMove }: { order: Order; onMove: (id: string, next: OrderStatus) => void }) {
  const next = nextStatus[order.status];
  const config = statusConfig[order.status];

  return (
    <div className={`bg-white rounded-2xl border-2 ${config.borderColor} shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden mb-4
      ${order.status === 'Pending' ? 'pulse-pending' : ''}
    `}>
      <div className={`px-4 py-3 border-b border-latte/20 flex items-between justify-between bg-white`}>
        <div>
          <h3 className="font-display font-bold text-lg text-espresso tracking-tight">{order.id}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-warm-gray font-medium">
            <Clock className="w-3.5 h-3.5" />
            {formatTimestamp(order.timestamp)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {order.tableNumber ? (
            <div className="bg-espresso text-cream px-3 py-1 rounded-lg text-sm font-bold border border-espresso-light">
              Table {order.tableNumber}
            </div>
          ) : (
            <div className="bg-warm-gray/10 text-espresso px-3 py-1 rounded-lg text-sm font-bold border border-latte/50">
              Takeaway
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-4 flex-grow bg-[#FAFAFA]">
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className={`min-w-[2rem] h-8 ${config.bg} ${config.color} rounded-lg flex items-center justify-center text-sm font-bold border ${config.borderColor}`}>
                {item.quantity}
              </span>
              <div className="pt-1">
                <span className="text-sm font-bold text-espresso block leading-tight">{item.product.name}</span>
                {item.product.category === 'Espresso' || item.product.category === 'Cappuccino' || item.product.category === 'Latte' ? (
                   <span className="text-xs text-warm-gray flex items-center gap-1 mt-1 font-medium"><Coffee className="w-3 h-3"/> Hot Beverage</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {next && (
        <div className="p-3 bg-white border-t border-latte/30">
          <button
            onClick={() => onMove(order.id, next)}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${config.btnColor} shadow-md transition-all active:scale-[0.98] border border-white/20`}
          >
            {next === 'Completed' ? 'Mark Completed' : `Start ${next}`}
            {next === 'Completed' ? <Check className="w-4.5 h-4.5" /> : <ArrowRight className="w-4.5 h-4.5" />}
          </button>
        </div>
      )}
    </div>
  );
}

export default function KitchenPage() {
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber?.toString().includes(searchQuery)
  );

  const getOrdersByStatus = (status: OrderStatus) => filteredOrders.filter((o) => o.status === status);
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex flex-col">
      {/* Kitchen Header */}
      <div className="bg-white border-b border-latte/30 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-espresso to-espresso-light text-white rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-espresso">Kitchen Display</h1>
              <p className="text-warm-gray text-sm mt-0.5">Kanban Board • Real-time tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-warm-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order or table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-cream border border-latte rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive w-64"
              />
            </div>

            {/* Status Pills */}
            <div className="hidden lg:flex gap-2">
              {statuses.map(status => {
                 const count = getOrdersByStatus(status).length;
                 const config = statusConfig[status];
                 const Icon = config.icon;
                 return (
                   <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.bg} ${config.borderColor}`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-sm font-bold ${config.color}`}>{status}</span>
                      <span className={`bg-white px-2 py-0.5 rounded-md text-xs font-bold border ${config.borderColor} ${config.color}`}>
                        {count}
                      </span>
                   </div>
                 )
              })}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-warm-gray/5 border-warm-gray/20">
                <Package className="w-4 h-4 text-warm-gray" />
                <span className="text-sm font-bold text-warm-gray">Completed</span>
                <span className="bg-white px-2 py-0.5 rounded-md text-xs font-bold border border-warm-gray/20 text-warm-gray">
                  {completedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-grow p-6 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto min-w-[1000px] grid grid-cols-3 gap-6 h-full items-start">
          {statuses.map(status => {
            const laneOrders = getOrdersByStatus(status);
            const config = statusConfig[status];
            const Icon = config.icon;
            
            return (
              <div key={status} className="flex flex-col h-[calc(100vh-10rem)] bg-white/40 rounded-3xl p-4 border border-latte/30">
                {/* Lane Header */}
                <div className={`flex items-center justify-between pb-4 border-b-2 mb-4 ${config.borderColor}`}>
                   <div className="flex items-center gap-2.5">
                     <div className={`p-2 rounded-xl ${config.bg} ${config.color}`}>
                        <Icon className="w-5 h-5" />
                     </div>
                     <h2 className="font-display text-xl font-bold text-espresso">{config.title}</h2>
                   </div>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-white border-2 ${config.borderColor} ${config.color} shadow-sm`}>
                     {laneOrders.length}
                   </div>
                </div>

                {/* Lane Body */}
                <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pb-10">
                  {laneOrders.length === 0 ? (
                    <div className="h-48 border-2 border-dashed border-latte/50 rounded-2xl flex flex-col items-center justify-center text-warm-gray bg-white/30">
                       <Icon className="w-8 h-8 mb-3 opacity-20" />
                       <span className="text-sm font-medium">No {status.toLowerCase()} orders</span>
                    </div>
                  ) : (
                    laneOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onMove={updateOrderStatus} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
