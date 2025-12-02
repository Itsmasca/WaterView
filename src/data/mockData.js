/**
 * Datos de respaldo para cuando no hay conexión a la API
 */

// Historial de flujo por hora
export const flowHistoryData = [
  { time: "00:00", flowRate: 0.0, volume: 0 },
  { time: "04:00", flowRate: 0.0, volume: 0 },
  { time: "08:00", flowRate: 2.3, volume: 45 },
  { time: "10:00", flowRate: 2.8, volume: 120 },
  { time: "12:00", flowRate: 3.2, volume: 280 },
  { time: "14:00", flowRate: 2.5, volume: 180 },
  { time: "16:00", flowRate: 2.9, volume: 220 },
  { time: "18:00", flowRate: 1.8, volume: 95 },
  { time: "20:00", flowRate: 1.2, volume: 45 },
  { time: "22:00", flowRate: 0.5, volume: 15 },
];

// Distribución de consumo por dispositivo/sensor
export const deviceDistributionData = [
  { name: "Sensor 001", value: 45, fill: "#00D9FF" },
  { name: "Sensor 002", value: 28, fill: "#FF6B9D" },
  { name: "Sensor 003", value: 18, fill: "#A855F7" },
  { name: "Sensor 004", value: 9, fill: "#10B981" },
];

// Rendimiento de sensores (latencia en ms)
export const sensorPerformanceData = [
  { sensor: "Sensor 001", p50: 12, p95: 28, p99: 45 },
  { sensor: "Sensor 002", p50: 8, p95: 22, p99: 38 },
  { sensor: "Sensor 003", p50: 15, p95: 35, p99: 52 },
  { sensor: "Sensor 004", p50: 10, p95: 25, p99: 42 },
];

// Estado del sistema (últimas 6 horas)
export const systemStatusData = [
  { hour: "1h", online: 100, offline: 0 },
  { hour: "2h", online: 100, offline: 0 },
  { hour: "3h", online: 98, offline: 2 },
  { hour: "4h", online: 100, offline: 0 },
  { hour: "5h", online: 100, offline: 0 },
  { hour: "6h", online: 99, offline: 1 },
];

// Nivel del tanque/bomba
export const tankLevelData = [
  { name: "Nivel Actual", value: 75, fill: "#00D9FF" },
  { name: "Espacio Libre", value: 25, fill: "#2A2A3E" },
];

// Últimas lecturas/operaciones
export const recentReadings = [
  { id: 1, operation: "Lectura Flujo", value: "2.5 L/min", status: "success", time: "hace 2s" },
  { id: 2, operation: "Llenado Completado", value: "15.2 L", status: "success", time: "hace 5min" },
  { id: 3, operation: "Nivel Actualizado", value: "75%", status: "success", time: "hace 8min" },
  { id: 4, operation: "Alerta Nivel Bajo", value: "30%", status: "warning", time: "hace 15min" },
  { id: 5, operation: "Bomba Encendida", value: "ON", status: "success", time: "hace 20min" },
];

// Métricas de respaldo
export const defaultMetrics = {
  totalVolume: 1248.5,
  avgFlowRate: 2.4,
  totalFillings: 156,
  efficiency: 94.5,
  uptime: 99.2,
};

// Alertas de ejemplo
export const sampleAlerts = [
  {
    id: "alert_1",
    deviceId: "sensor_001",
    alertType: "info",
    message: "Sistema funcionando correctamente",
    severity: "info",
    timestamp: new Date(),
  },
];
