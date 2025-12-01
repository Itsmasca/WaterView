import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import {
  LayoutDashboard,
  Activity,
  Database,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Server,
  GitBranch,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Github,
  Chrome,
} from "lucide-react";

// GraphQL Mock Data
const queryPerformanceData = [
  { time: "00:00", queries: 120, mutations: 45, latency: 23 },
  { time: "04:00", queries: 89, mutations: 32, latency: 18 },
  { time: "08:00", queries: 340, mutations: 128, latency: 45 },
  { time: "12:00", queries: 520, mutations: 234, latency: 67 },
  { time: "16:00", queries: 480, mutations: 198, latency: 52 },
  { time: "20:00", queries: 290, mutations: 87, latency: 31 },
  { time: "24:00", queries: 150, mutations: 56, latency: 25 },
];

const schemaTypesData = [
  { name: "Query", value: 45, fill: "#00D9FF" },
  { name: "Mutation", value: 28, fill: "#FF6B6B" },
  { name: "Subscription", value: 12, fill: "#4ECDC4" },
  { name: "Types", value: 89, fill: "#FFE66D" },
  { name: "Inputs", value: 34, fill: "#95E1D3" },
];

const resolverLatencyData = [
  { resolver: "users", p50: 12, p95: 45, p99: 89 },
  { resolver: "products", p50: 8, p95: 32, p99: 67 },
  { resolver: "orders", p50: 15, p95: 58, p99: 120 },
  { resolver: "payments", p50: 23, p95: 78, p99: 156 },
  { resolver: "analytics", p50: 34, p95: 112, p99: 234 },
];

const errorRateData = [
  { hour: "1h", errors: 2, success: 98 },
  { hour: "2h", errors: 1, success: 99 },
  { hour: "3h", errors: 5, success: 95 },
  { hour: "4h", errors: 3, success: 97 },
  { hour: "5h", errors: 1, success: 99 },
  { hour: "6h", errors: 4, success: 96 },
];

const cacheHitData = [
  { name: "Cache Hit", value: 78, fill: "#00D9FF" },
  { name: "Cache Miss", value: 22, fill: "#2A2A3E" },
];

const recentQueries = [
  { id: 1, query: "GetUserProfile", time: "2ms", status: "success" },
  { id: 2, query: "ListProducts", time: "15ms", status: "success" },
  { id: 3, query: "CreateOrder", time: "45ms", status: "success" },
  { id: 4, query: "UpdateInventory", time: "8ms", status: "error" },
  { id: 5, query: "GetAnalytics", time: "234ms", status: "warning" },
];

// Styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --bg-primary: #0A0A0F;
    --bg-secondary: #12121A;
    --bg-card: #1A1A25;
    --bg-elevated: #222230;
    --accent-cyan: #00D9FF;
    --accent-pink: #FF6B9D;
    --accent-purple: #A855F7;
    --accent-green: #10B981;
    --accent-yellow: #FBBF24;
    --accent-red: #EF4444;
    --text-primary: #FFFFFF;
    --text-secondary: #9CA3AF;
    --text-muted: #6B7280;
    --border-color: #2D2D3A;
    --gradient-1: linear-gradient(135deg, #00D9FF 0%, #A855F7 100%);
    --gradient-2: linear-gradient(135deg, #FF6B9D 0%, #FFE66D 100%);
    --glow-cyan: 0 0 40px rgba(0, 217, 255, 0.3);
    --glow-pink: 0 0 40px rgba(255, 107, 157, 0.3);
  }

  body {
    font-family: 'Space Grotesk', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
  }

  .app-container {
    min-height: 100vh;
    background: var(--bg-primary);
    background-image: 
      radial-gradient(ellipse at top left, rgba(0, 217, 255, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
  }

  /* Dashboard Styles */
  .dashboard {
    padding: 24px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    background: var(--gradient-1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--glow-cyan);
  }

  .logo-text {
    font-size: 24px;
    font-weight: 700;
    background: var(--gradient-1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    font-size: 14px;
  }

  .btn-primary {
    background: var(--gradient-1);
    color: var(--bg-primary);
    box-shadow: var(--glow-cyan);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 60px rgba(0, 217, 255, 0.5);
  }

  .btn-secondary {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    background: var(--bg-elevated);
    border-color: var(--accent-cyan);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
  }

  .btn-ghost:hover {
    color: var(--accent-cyan);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-1);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-cyan);
    box-shadow: var(--glow-cyan);
  }

  .stat-card:hover::before {
    opacity: 1;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .stat-icon.cyan { background: rgba(0, 217, 255, 0.15); color: var(--accent-cyan); }
  .stat-icon.pink { background: rgba(255, 107, 157, 0.15); color: var(--accent-pink); }
  .stat-icon.purple { background: rgba(168, 85, 247, 0.15); color: var(--accent-purple); }
  .stat-icon.green { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 14px;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    margin-top: 8px;
  }

  .stat-trend.up { color: var(--accent-green); }
  .stat-trend.down { color: var(--accent-red); }

  /* Charts Grid */
  .charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }

  .chart-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
  }

  .chart-card:hover {
    border-color: rgba(0, 217, 255, 0.3);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 18px;
    font-weight: 600;
  }

  .chart-subtitle {
    color: var(--text-secondary);
    font-size: 13px;
    margin-top: 4px;
  }

  /* Bottom Grid */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  /* Recent Queries */
  .queries-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .query-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  .query-item:hover {
    background: var(--bg-elevated);
  }

  .query-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--accent-cyan);
  }

  .query-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .query-time {
    color: var(--text-muted);
    font-size: 12px;
  }

  .query-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .query-status.success { background: var(--accent-green); box-shadow: 0 0 8px var(--accent-green); }
  .query-status.error { background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red); }
  .query-status.warning { background: var(--accent-yellow); box-shadow: 0 0 8px var(--accent-yellow); }

  /* Auth Pages */
  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .auth-card {
    width: 100%;
    max-width: 440px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .auth-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-1);
  }

  .auth-logo {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;
  }

  .auth-title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
  }

  .auth-subtitle {
    color: var(--text-secondary);
    text-align: center;
    margin-bottom: 32px;
    font-size: 15px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--text-secondary);
  }

  .input-wrapper {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }

  .form-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15px;
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent-cyan);
    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
  }

  .form-input::placeholder {
    color: var(--text-muted);
  }

  .password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .password-toggle:hover {
    color: var(--accent-cyan);
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox {
    width: 18px;
    height: 18px;
    accent-color: var(--accent-cyan);
  }

  .checkbox-label {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .forgot-link {
    font-size: 14px;
    color: var(--accent-cyan);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .forgot-link:hover {
    color: var(--accent-pink);
  }

  .btn-auth {
    width: 100%;
    padding: 16px;
    background: var(--gradient-1);
    color: var(--bg-primary);
    border: none;
    border-radius: 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-auth:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-cyan);
  }

  .btn-auth:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 28px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .divider-text {
    color: var(--text-muted);
    font-size: 13px;
  }

  .social-buttons {
    display: flex;
    gap: 12px;
  }

  .btn-social {
    flex: 1;
    padding: 14px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
  }

  .btn-social:hover {
    background: var(--bg-elevated);
    border-color: var(--accent-cyan);
  }

  .auth-switch {
    text-align: center;
    margin-top: 28px;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .auth-switch-link {
    color: var(--accent-cyan);
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .auth-switch-link:hover {
    color: var(--accent-pink);
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 24px;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: var(--accent-cyan);
  }

  .success-message {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid var(--accent-green);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .success-message svg {
    color: var(--accent-green);
    flex-shrink: 0;
  }

  .success-message p {
    color: var(--accent-green);
    font-size: 14px;
  }

  /* Nav Tabs */
  .nav-tabs {
    display: flex;
    gap: 4px;
    background: var(--bg-card);
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .nav-tab {
    padding: 10px 20px;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: var(--text-secondary);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-tab:hover {
    color: var(--text-primary);
  }

  .nav-tab.active {
    background: var(--gradient-1);
    color: var(--bg-primary);
    font-weight: 600;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  .fade-in-delay-1 { animation-delay: 0.1s; opacity: 0; }
  .fade-in-delay-2 { animation-delay: 0.2s; opacity: 0; }
  .fade-in-delay-3 { animation-delay: 0.3s; opacity: 0; }
  .fade-in-delay-4 { animation-delay: 0.4s; opacity: 0; }

  .spin {
    animation: spin 1s linear infinite;
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .charts-grid {
      grid-template-columns: 1fr;
    }
    .bottom-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .auth-card {
      padding: 32px 24px;
    }
    .dashboard-header {
      flex-direction: column;
      gap: 16px;
    }
  }
`;

// Components
const StatCard = ({ icon: Icon, value, label, trend, trendDirection, iconColor, delay }) => (
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '13px' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Dashboard Component
const Dashboard = ({ onNavigate }) => (
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
        <button className="btn btn-secondary" onClick={() => onNavigate('login')}>
          Cerrar sesión
        </button>
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

// Login Component
const Login = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="logo-icon">
            <GitBranch size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para acceder al dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-footer">
            <div className="checkbox-wrapper">
              <input type="checkbox" className="checkbox" id="remember" />
              <label htmlFor="remember" className="checkbox-label">Recordarme</label>
            </div>
            <span className="forgot-link" onClick={() => onNavigate('forgot')}>
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Ingresando...
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">o continúa con</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <button className="btn-social">
            <Github size={20} />
            GitHub
          </button>
          <button className="btn-social">
            <Chrome size={20} />
            Google
          </button>
        </div>

        <p className="auth-switch">
          ¿No tienes una cuenta?{' '}
          <span className="auth-switch-link" onClick={() => onNavigate('register')}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

// Register Component
const Register = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('login');
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="logo-icon">
            <GitBranch size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para comenzar a monitorear tu API GraphQL</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="checkbox-wrapper" style={{ marginBottom: '24px' }}>
            <input type="checkbox" className="checkbox" id="terms" />
            <label htmlFor="terms" className="checkbox-label">
              Acepto los términos de servicio y política de privacidad
            </label>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">o continúa con</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <button className="btn-social">
            <Github size={20} />
            GitHub
          </button>
          <button className="btn-social">
            <Chrome size={20} />
            Google
          </button>
        </div>

        <p className="auth-switch">
          ¿Ya tienes una cuenta?{' '}
          <span className="auth-switch-link" onClick={() => onNavigate('login')}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

// Forgot Password Component
const ForgotPassword = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="back-link" onClick={() => onNavigate('login')}>
          <ArrowLeft size={18} />
          Volver al login
        </div>

        <div className="auth-logo">
          <div className="logo-icon">
            <GitBranch size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Recuperar contraseña</h1>
        <p className="auth-subtitle">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        {sent ? (
          <div className="success-message">
            <CheckCircle size={24} />
            <p>
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
              Revisa tu bandeja de entrada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar enlace de recuperación
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}

        <p className="auth-switch" style={{ marginTop: '32px' }}>
          ¿Recordaste tu contraseña?{' '}
          <span className="auth-switch-link" onClick={() => onNavigate('login')}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
        {currentPage === 'login' && <Login onNavigate={navigate} />}
        {currentPage === 'register' && <Register onNavigate={navigate} />}
        {currentPage === 'forgot' && <ForgotPassword onNavigate={navigate} />}
      </div>
    </>
  );
}