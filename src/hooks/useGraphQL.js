'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { graphqlRequest, createSubscription } from '@/lib/graphql/client';
import {
  GET_FLOW_READINGS,
  GET_LATEST_FLOW_READING,
  GET_PUMP_STATUS,
  GET_FLOW_METRICS,
  GET_FILLING_METRICS,
  GET_FILLINGS,
  GET_ACTIVE_FILLING,
  LIVE_FLOW_READING_SUBSCRIPTION,
  PUMP_STATUS_SUBSCRIPTION,
  ALERTS_SUBSCRIPTION,
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
 * Hook para subscriptions GraphQL en tiempo real
 */
export function useSubscription(query, variables = {}, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const unsubscribeRef = useRef(null);
  const { skip = false, onData } = options;

  useEffect(() => {
    if (skip || typeof window === 'undefined') return;

    const handleData = (newData) => {
      setData(newData);
      setConnected(true);
      if (onData) onData(newData);
    };

    const handleError = (err) => {
      setError(err);
      setConnected(false);
    };

    unsubscribeRef.current = createSubscription(query, variables, handleData, handleError);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [query, JSON.stringify(variables), skip]);

  return { data, error, connected };
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
 * Hook para subscription de flujo en tiempo real
 */
export function useLiveFlowReading(deviceId) {
  return useSubscription(LIVE_FLOW_READING_SUBSCRIPTION, { deviceId }, {
    skip: !deviceId,
  });
}

/**
 * Hook para subscription de estado de bomba
 */
export function useLivePumpStatus(deviceId) {
  return useSubscription(PUMP_STATUS_SUBSCRIPTION, { deviceId }, {
    skip: !deviceId,
  });
}

/**
 * Hook para subscription de alertas
 */
export function useAlerts(deviceId = null) {
  const [alerts, setAlerts] = useState([]);

  const { data, error, connected } = useSubscription(
    ALERTS_SUBSCRIPTION,
    { deviceId },
    {
      onData: (newData) => {
        if (newData.alerts) {
          setAlerts((prev) => [newData.alerts, ...prev].slice(0, 50));
        }
      },
    }
  );

  return { alerts, latestAlert: data?.alerts, error, connected };
}

/**
 * Hook combinado para dashboard con todos los datos
 */
export function useDashboardData(deviceId) {
  const [flowHistory, setFlowHistory] = useState([]);

  // Queries
  const { data: latestReading, loading: loadingLatest } = useLatestFlowReading(deviceId);
  const { data: pumpStatus, loading: loadingPump } = usePumpStatus(deviceId);
  const { data: fillingsData, loading: loadingFillings } = useFillings(deviceId, 10);

  // Métricas (últimas 24 horas)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const { data: flowMetrics, loading: loadingFlowMetrics } = useFlowMetrics(deviceId, yesterday, now);
  const { data: fillingMetrics, loading: loadingFillingMetrics } = useFillingMetrics(deviceId, yesterday, now);

  // Subscriptions en tiempo real
  const { data: liveFlow, connected: flowConnected } = useLiveFlowReading(deviceId);
  const { data: livePump, connected: pumpConnected } = useLivePumpStatus(deviceId);
  const { alerts } = useAlerts(deviceId);

  // Actualizar historial con datos en tiempo real
  useEffect(() => {
    if (liveFlow?.liveFlowReading) {
      const reading = liveFlow.liveFlowReading;
      setFlowHistory((prev) => {
        const newHistory = [...prev, {
          time: new Date(reading.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          flowRate: reading.flowRate,
          totalVolume: reading.totalVolume,
        }];
        return newHistory.slice(-24); // Mantener solo las últimas 24 lecturas
      });
    }
  }, [liveFlow]);

  const loading = loadingLatest || loadingPump || loadingFillings || loadingFlowMetrics || loadingFillingMetrics;

  return {
    // Datos actuales
    latestReading: liveFlow?.liveFlowReading || latestReading?.latestFlowReading,
    pumpStatus: livePump?.pumpStatusUpdates || pumpStatus?.pumpStatus,
    fillings: fillingsData?.fillings || [],

    // Métricas
    flowMetrics: flowMetrics?.flowMetrics,
    fillingMetrics: fillingMetrics?.fillingMetrics,

    // Historial para gráficas
    flowHistory,

    // Alertas
    alerts,

    // Estado
    loading,
    connected: flowConnected || pumpConnected,
  };
}
