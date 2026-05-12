'use client';

import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
            <Icon size={24} />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}
