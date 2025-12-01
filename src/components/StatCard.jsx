'use client';

import { TrendingUp } from 'lucide-react';

export default function StatCard({ icon: Icon, value, label, trend, trendDirection, iconColor, delay }) {
  return (
    <div className={`stat-card fade-in fade-in-delay-${delay}`}>
      <div className={`stat-icon ${iconColor}`}>
        <Icon size={22} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trendDirection}`}>
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}
