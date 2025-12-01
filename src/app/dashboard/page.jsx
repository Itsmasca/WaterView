'use client';

import Link from 'next/link';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Zap,
  Activity,
  Database,
  CheckCircle,
  Clock,
  GitBranch,
} from 'lucide-react';

import StatCard from '@/components/StatCard';
import CustomTooltip from '@/components/CustomTooltip';
import {
  queryPerformanceData,
  schemaTypesData,
  resolverLatencyData,
  errorRateData,
  recentQueries,
} from '@/data/mockData';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <div className="logo-icon">
            <GitBranch size={24} color="#0A0A0F" />
          </div>
          <span className="logo-text">GraphQL Monitor</span>
        </div>
        <div className="header-actions">
          <div className="nav-tabs">
            <button className="nav-tab active">Dashboard</button>
            <button className="nav-tab">Schema</button>
            <button className="nav-tab">Playground</button>
            <button className="nav-tab">Settings</button>
          </div>
          <Link href="/login" className="btn btn-secondary">
            Cerrar sesión
          </Link>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard
          icon={Zap}
          value="12.4K"
          label="Total de Queries"
          trend="+23.5%"
          trendDirection="up"
          iconColor="cyan"
          delay={1}
        />
        <StatCard
          icon={Activity}
          value="34ms"
          label="Latencia Promedio"
          trend="-12.3%"
          trendDirection="up"
          iconColor="pink"
          delay={2}
        />
        <StatCard
          icon={Database}
          value="208"
          label="Tipos en Schema"
          trend="+8 nuevos"
          trendDirection="up"
          iconColor="purple"
          delay={3}
        />
        <StatCard
          icon={CheckCircle}
          value="99.2%"
          label="Tasa de Éxito"
          trend="+0.5%"
          trendDirection="up"
          iconColor="green"
          delay={4}
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Rendimiento de Queries</div>
              <div className="chart-subtitle">Queries y mutaciones por hora</div>
            </div>
            <button className="btn btn-ghost">
              <Clock size={16} /> Últimas 24h
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={queryPerformanceData}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMutations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B9D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="queries" stroke="#00D9FF" fill="url(#colorQueries)" strokeWidth={2} name="Queries" />
              <Area type="monotone" dataKey="mutations" stroke="#FF6B9D" fill="url(#colorMutations)" strokeWidth={2} name="Mutations" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Tipos del Schema</div>
              <div className="chart-subtitle">Distribución por categoría</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={schemaTypesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {schemaTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Latencia de Resolvers</div>
              <div className="chart-subtitle">Percentiles p50, p95, p99 (ms)</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={resolverLatencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis dataKey="resolver" type="category" stroke="#6B7280" fontSize={12} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="p50" fill="#00D9FF" radius={[0, 4, 4, 0]} name="p50" />
              <Bar dataKey="p95" fill="#A855F7" radius={[0, 4, 4, 0]} name="p95" />
              <Bar dataKey="p99" fill="#FF6B9D" radius={[0, 4, 4, 0]} name="p99" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Tasa de Errores</div>
              <div className="chart-subtitle">Últimas 6 horas</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={errorRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
              <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} name="Errores" />
              <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} name="Éxitos" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Queries Recientes</div>
              <div className="chart-subtitle">Últimas operaciones</div>
            </div>
          </div>
          <div className="queries-list">
            {recentQueries.map((query) => (
              <div key={query.id} className="query-item">
                <span className="query-name">{query.query}</span>
                <div className="query-meta">
                  <span className="query-time">{query.time}</span>
                  <div className={`query-status ${query.status}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
