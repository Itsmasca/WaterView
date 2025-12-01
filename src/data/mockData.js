export const queryPerformanceData = [
  { time: "00:00", queries: 120, mutations: 45, latency: 23 },
  { time: "04:00", queries: 89, mutations: 32, latency: 18 },
  { time: "08:00", queries: 340, mutations: 128, latency: 45 },
  { time: "12:00", queries: 520, mutations: 234, latency: 67 },
  { time: "16:00", queries: 480, mutations: 198, latency: 52 },
  { time: "20:00", queries: 290, mutations: 87, latency: 31 },
  { time: "24:00", queries: 150, mutations: 56, latency: 25 },
];

export const schemaTypesData = [
  { name: "Query", value: 45, fill: "#00D9FF" },
  { name: "Mutation", value: 28, fill: "#FF6B6B" },
  { name: "Subscription", value: 12, fill: "#4ECDC4" },
  { name: "Types", value: 89, fill: "#FFE66D" },
  { name: "Inputs", value: 34, fill: "#95E1D3" },
];

export const resolverLatencyData = [
  { resolver: "users", p50: 12, p95: 45, p99: 89 },
  { resolver: "products", p50: 8, p95: 32, p99: 67 },
  { resolver: "orders", p50: 15, p95: 58, p99: 120 },
  { resolver: "payments", p50: 23, p95: 78, p99: 156 },
  { resolver: "analytics", p50: 34, p95: 112, p99: 234 },
];

export const errorRateData = [
  { hour: "1h", errors: 2, success: 98 },
  { hour: "2h", errors: 1, success: 99 },
  { hour: "3h", errors: 5, success: 95 },
  { hour: "4h", errors: 3, success: 97 },
  { hour: "5h", errors: 1, success: 99 },
  { hour: "6h", errors: 4, success: 96 },
];

export const cacheHitData = [
  { name: "Cache Hit", value: 78, fill: "#00D9FF" },
  { name: "Cache Miss", value: 22, fill: "#2A2A3E" },
];

export const recentQueries = [
  { id: 1, query: "GetUserProfile", time: "2ms", status: "success" },
  { id: 2, query: "ListProducts", time: "15ms", status: "success" },
  { id: 3, query: "CreateOrder", time: "45ms", status: "success" },
  { id: 4, query: "UpdateInventory", time: "8ms", status: "error" },
  { id: 5, query: "GetAnalytics", time: "234ms", status: "warning" },
];
