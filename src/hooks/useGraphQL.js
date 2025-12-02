'use client';

import { useState, useEffect, useCallback } from 'react';
import { graphqlRequest } from '@/lib/graphql/client';
import {
  GET_FLOW_READINGS,
  GET_LATEST_FLOW_READING,
  GET_PUMP_STATUS,
  GET_FLOW_METRICS,
  GET_FILLING_METRICS,
  GET_FILLINGS,
  GET_ACTIVE_FILLING,
} from '@/lib/graphql/queries';

/**
 * Hook para ejecutar queries GraphQL
 */
export function useQuery(query, variables = {}, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { skip = false, pollInterval = 0 } = options;

  const fetchData = useCallback(async () => {
    if (skip) return;

    try {
      setLoading(true);
      const result = await graphqlRequest(query, variables);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(variables), skip]);

  useEffect(() => {
    fetchData();

    if (pollInterval > 0) {
      const interval = setInterval(fetchData, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, pollInterval]);

  return { data, loading, error, refetch: fetchData };
}


/**
 * Hook para obtener lecturas de flujo
 */
export function useFlowReadings(deviceId, limit = 100) {
  return useQuery(GET_FLOW_READINGS, { deviceId, limit }, {
    skip: !deviceId,
    pollInterval: 30000, // Actualizar cada 30 segundos
  });
}

/**
 * Hook para obtener la última lectura de flujo
 */
export function useLatestFlowReading(deviceId) {
  return useQuery(GET_LATEST_FLOW_READING, { deviceId }, {
    skip: !deviceId,
    pollInterval: 5000, // Actualizar cada 5 segundos
  });
}

/**
 * Hook para obtener el estado de la bomba
 */
export function usePumpStatus(deviceId) {
  return useQuery(GET_PUMP_STATUS, { deviceId }, {
    skip: !deviceId,
    pollInterval: 10000, // Actualizar cada 10 segundos
  });
}

/**
 * Hook para métricas de flujo
 */
export function useFlowMetrics(deviceId, startDate, endDate) {
  return useQuery(GET_FLOW_METRICS, {
    deviceId,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  }, {
    skip: !deviceId || !startDate || !endDate,
  });
}

/**
 * Hook para métricas de llenado
 */
export function useFillingMetrics(deviceId, startDate, endDate) {
  return useQuery(GET_FILLING_METRICS, {
    deviceId,
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
  }, {
    skip: !deviceId || !startDate || !endDate,
  });
}

/**
 * Hook para llenados
 */
export function useFillings(deviceId, limit = 100) {
  return useQuery(GET_FILLINGS, { deviceId, limit }, {
    skip: !deviceId,
  });
}

/**
 * Hook para llenado activo
 */
export function useActiveFilling(deviceId) {
  return useQuery(GET_ACTIVE_FILLING, { deviceId }, {
    skip: !deviceId,
    pollInterval: 2000, // Actualizar cada 2 segundos cuando hay llenado activo
  });
}

/**
 * Hook para obtener lecturas de flujo con polling frecuente (simula tiempo real)
 */
export function useLiveFlowReading(deviceId) {
  return useQuery(GET_LATEST_FLOW_READING, { deviceId }, {
    skip: !deviceId,
    pollInterval: 3000, // Polling cada 3 segundos
  });
}

/**
 * Hook para estado de bomba con polling
 */
export function useLivePumpStatus(deviceId) {
  return useQuery(GET_PUMP_STATUS, { deviceId }, {
    skip: !deviceId,
    pollInterval: 5000, // Polling cada 5 segundos
  });
}

/**
 * Hook combinado para dashboard con todos los datos reales
 */
export function useDashboardData(deviceId) {
  const [flowHistory, setFlowHistory] = useState([]);
  const [connected, setConnected] = useState(false);

  // Queries con polling para datos en tiempo real
  const { data: latestReading, loading: loadingLatest, error: errorLatest } = useLiveFlowReading(deviceId);
  const { data: pumpStatus, loading: loadingPump } = useLivePumpStatus(deviceId);
  const { data: fillingsData, loading: loadingFillings } = useFillings(deviceId, 10);
  const { data: flowReadings } = useFlowReadings(deviceId, 24);

  // Métricas (últimas 24 horas)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const { data: flowMetrics, loading: loadingFlowMetrics } = useFlowMetrics(deviceId, yesterday, now);
  const { data: fillingMetrics, loading: loadingFillingMetrics } = useFillingMetrics(deviceId, yesterday, now);

  // Actualizar estado de conexión
  useEffect(() => {
    if (latestReading?.latestFlowReading && !errorLatest) {
      setConnected(true);
    } else if (errorLatest) {
      setConnected(false);
    }
  }, [latestReading, errorLatest]);

  // Construir historial de flujo desde las lecturas
  useEffect(() => {
    if (flowReadings?.flowReadings?.length > 0) {
      const history = flowReadings.flowReadings
        .slice(-24)
        .map(reading => ({
          time: new Date(reading.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          flowRate: reading.flowRate || 0,
          totalVolume: reading.totalVolume || 0,
        }));
      setFlowHistory(history);
    }
  }, [flowReadings]);

  const loading = loadingLatest || loadingPump || loadingFillings || loadingFlowMetrics || loadingFillingMetrics;

  return {
    // Datos actuales
    latestReading: latestReading?.latestFlowReading,
    pumpStatus: pumpStatus?.pumpStatus,
    fillings: fillingsData?.fillings || [],

    // Métricas
    flowMetrics: flowMetrics?.flowMetrics,
    fillingMetrics: fillingMetrics?.fillingMetrics,

    // Historial para gráficas
    flowHistory,

    // Estado
    loading,
    connected,
  };
}
