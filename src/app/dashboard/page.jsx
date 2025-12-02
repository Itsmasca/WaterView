'use client';

import { useState } from 'react';
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
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  Zap,
  Activity,
  Droplets,
  CheckCircle,
  Clock,
  LogOut,
  User,
  Wifi,
  WifiOff,
  Gauge,
  Power,
  Loader2,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/StatCard';
import CustomTooltip from '@/components/CustomTooltip';
import { useDashboardData } from '@/hooks/useGraphQL';

// ID del dispositivo por defecto (puedes cambiarlo o hacerlo configurable)
const DEFAULT_DEVICE_ID = 'flowsensor_001';

function ConnectionStatus({ connected }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      borderRadius: '8px',
      border: `1px solid ${connected ? 'var(--accent-green)' : 'var(--accent-red)'}`,
    }}>
      {connected ? (
        <Wifi size={14} style={{ color: 'var(--accent-green)' }} />
      ) : (
        <WifiOff size={14} style={{ color: 'var(--accent-red)' }} />
      )}
      <span style={{
        fontSize: '12px',
        color: connected ? 'var(--accent-green)' : 'var(--accent-red)',
        fontWeight: 500,
      }}>
        {connected ? 'En vivo' : 'Desconectado'}
      </span>
    </div>
  );
}

function PumpGauge({ level = 0, status = 'off', shouldWarn = false, shouldStop = false }) {
  const gaugeData = [
    { name: 'Nivel', value: level, fill: shouldStop ? '#EF4444' : shouldWarn ? '#FBBF24' : '#00D9FF' },
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={12}
          data={gaugeData}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background={{ fill: '#2D2D3A' }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '-60px' }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: gaugeData[0].fill }}>
          {level.toFixed(1)}%
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          background: status === 'on' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
          borderRadius: '6px',
          marginTop: '8px',
        }}>
          <Power size={14} style={{ color: status === 'on' ? '#10B981' : '#6B7280' }} />
          <span style={{
            fontSize: '12px',
            color: status === 'on' ? '#10B981' : '#6B7280',
            fontWeight: 500,
          }}>
            Bomba {status === 'on' ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>
    </div>
  );
}


function DashboardContent() {
  const { user, logout } = useAuth();
  const [deviceId, setDeviceId] = useState(DEFAULT_DEVICE_ID);

  // Obtener datos del dashboard desde GraphQL
  const {
    latestReading,
    pumpStatus,
    fillings,
    flowMetrics,
    fillingMetrics,
    flowHistory,
    loading,
    connected,
  } = useDashboardData(deviceId);

  // Métricas con valores reales
  const displayMetrics = {
    totalVolume: flowMetrics?.totalVolume ?? 0,
    avgFlowRate: flowMetrics?.avgFlowRate ?? latestReading?.flowRate ?? 0,
    totalFillings: fillingMetrics?.totalFillings ?? 0,
    efficiency: fillingMetrics?.avgEfficiency ?? 0,
  };

  // Datos para gráficas
  const chartFlowData = flowHistory.length > 0 ? flowHistory.map(item => ({
    time: item.time,
    flowRate: item.flowRate || 0,
    volume: item.totalVolume || 0,
  })) : [];

  // Datos del nivel del tanque
  const tankLevel = pumpStatus?.levelPercentage ?? 0;

  // Pantalla de carga inicial
  if (loading && !latestReading && !pumpStatus) {
    return (
      <div className="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} className="spin" style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Conectando con el servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <div className="logo-icon">
            <Droplets size={24} color="#0A0A0F" />
          </div>
          <span className="logo-text">Water Dispenser</span>
        </div>
        <div className="header-actions">
          <ConnectionStatus connected={connected} />
          <div className="nav-tabs">
            <button className="nav-tab active">Dashboard</button>
            <button className="nav-tab">Sensores</button>
            <button className="nav-tab">Historial</button>
            <button className="nav-tab">Configuración</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                }}>
                  <User size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {user.username}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: 'var(--accent-cyan)',
                    color: 'var(--bg-primary)',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}>
                    {user.role}
                  </span>
                </div>
                <button className="btn btn-secondary" onClick={logout}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
              }}>
                <User size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Invitado
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Lectura actual en tiempo real */}
      {latestReading && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: latestReading.isFlowing ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: latestReading.isFlowing ? 'var(--glow-cyan)' : 'none',
            }}>
              <Gauge size={24} color={latestReading.isFlowing ? '#0A0A0F' : '#6B7280'} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Flujo Actual</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {latestReading.flowRate?.toFixed(2) ?? '0.00'} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>L/min</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Volumen Total</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent-pink)' }}>
                {latestReading.totalVolume?.toFixed(1) ?? '0.0'} L
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Última Actualización</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {new Date(latestReading.timestamp).toLocaleTimeString('es-MX')}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          icon={Droplets}
          value={`${displayMetrics.totalVolume.toFixed(1)} L`}
          label="Volumen Total (24h)"
          trend={flowMetrics ? `+${((flowMetrics.totalVolume / 100) * 5).toFixed(1)}%` : null}
          trendDirection="up"
          iconColor="cyan"
          delay={1}
        />
        <StatCard
          icon={Activity}
          value={`${displayMetrics.avgFlowRate.toFixed(2)} L/min`}
          label="Flujo Promedio"
          trend={flowMetrics ? `${flowMetrics.efficiency?.toFixed(1)}% eficiencia` : null}
          trendDirection="up"
          iconColor="pink"
          delay={2}
        />
        <StatCard
          icon={Zap}
          value={displayMetrics.totalFillings.toString()}
          label="Llenados Completados"
          trend={fillingMetrics ? `${fillingMetrics.completionRate?.toFixed(0)}% éxito` : null}
          trendDirection="up"
          iconColor="purple"
          delay={3}
        />
        <StatCard
          icon={CheckCircle}
          value={`${displayMetrics.efficiency.toFixed(1)}%`}
          label="Eficiencia del Sistema"
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
              <div className="chart-title">Consumo de Agua</div>
              <div className="chart-subtitle">Flujo y volumen en tiempo real</div>
            </div>
            <button className="btn btn-ghost">
              <Clock size={16} /> Últimas 24h
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartFlowData}>
              <defs>
                <linearGradient id="colorFlowRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B9D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF6B9D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="flowRate" stroke="#00D9FF" fill="url(#colorFlowRate)" strokeWidth={2} name="Flujo (L/min)" />
              <Area type="monotone" dataKey="volume" stroke="#FF6B9D" fill="url(#colorVolume)" strokeWidth={2} name="Volumen (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Nivel del Tanque</div>
              <div className="chart-subtitle">Estado de la bomba</div>
            </div>
          </div>
          <PumpGauge
            level={pumpStatus?.levelPercentage ?? 0}
            status={pumpStatus?.status ?? 'off'}
            shouldWarn={pumpStatus?.shouldWarn ?? false}
            shouldStop={pumpStatus?.shouldStop ?? false}
          />
        </div>
      </div>

      <div className="bottom-grid">
        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Resumen de Llenados</div>
              <div className="chart-subtitle">Por estado</div>
            </div>
          </div>
          {fillingMetrics ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completados', value: fillingMetrics.completedFillings || 0, fill: '#10B981' },
                    { name: 'Cancelados', value: fillingMetrics.cancelledFillings || 0, fill: '#EF4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span style={{ color: '#9CA3AF', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {loading ? 'Cargando...' : 'Sin datos de llenados'}
            </div>
          )}
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Métricas de Flujo</div>
              <div className="chart-subtitle">Últimas 24 horas</div>
            </div>
          </div>
          {flowMetrics ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: 'Min', value: flowMetrics.minFlowRate || 0, fill: '#00D9FF' },
                { name: 'Promedio', value: flowMetrics.avgFlowRate || 0, fill: '#A855F7' },
                { name: 'Max', value: flowMetrics.maxFlowRate || 0, fill: '#FF6B9D' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="L/min" radius={[4, 4, 0, 0]}>
                  <Cell fill="#00D9FF" />
                  <Cell fill="#A855F7" />
                  <Cell fill="#FF6B9D" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {loading ? 'Cargando...' : 'Sin datos de flujo'}
            </div>
          )}
        </div>

        <div className="chart-card fade-in">
          <div className="chart-header">
            <div>
              <div className="chart-title">Estado de Conexión</div>
              <div className="chart-subtitle">Información del dispositivo</div>
            </div>
          </div>
          <div style={{ padding: '20px', height: 180 }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Device ID</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{deviceId}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Estado</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderRadius: '6px',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: connected ? '#10B981' : '#EF4444',
                  boxShadow: connected ? '0 0 8px #10B981' : 'none',
                }} />
                <span style={{ fontSize: '13px', color: connected ? '#10B981' : '#EF4444' }}>
                  {connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
            </div>
            {flowMetrics && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Eficiencia</div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {flowMetrics.efficiency?.toFixed(1) ?? 0}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Llenados recientes */}
      {fillings.length > 0 && (
        <div className="chart-card fade-in" style={{ marginTop: '20px' }}>
          <div className="chart-header">
            <div>
              <div className="chart-title">Últimos Llenados</div>
              <div className="chart-subtitle">Historial de operaciones</div>
            </div>
          </div>
          <div className="queries-list">
            {fillings.slice(0, 5).map((filling) => (
              <div key={filling.id} className="query-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Droplets size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span className="query-name">
                    Llenado #{filling.id}
                  </span>
                </div>
                <div className="query-meta">
                  <span style={{ color: 'var(--accent-pink)', fontSize: '12px' }}>
                    {filling.actualVolume?.toFixed(1) ?? '0'} L
                  </span>
                  <span className="query-time">
                    {filling.efficiency?.toFixed(0) ?? 0}% efic.
                  </span>
                  <div className={`query-status ${filling.status === 'completed' ? 'success' : filling.status === 'cancelled' ? 'error' : 'warning'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
