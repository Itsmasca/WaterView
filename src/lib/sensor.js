/**
 * Servicio para el sensor de flujo
 */

import apiClient from './api';

/**
 * Servicio para manejar datos del sensor
 */
export const sensorService = {
  /**
   * Registra una lectura del sensor
   * @param {object} data - Datos del sensor
   * @returns {Promise<object>}
   */
  async createReading(data) {
    return apiClient.post('/sensor/readings', {
      device_id: data.deviceId,
      timestamp: data.timestamp || new Date().toISOString(),
      flow_rate: data.flowRate,
      pulse_count: data.pulseCount,
      unit: data.unit || 'L/min',
      temperature: data.temperature,
      pressure: data.pressure,
    });
  },

  /**
   * Verifica el estado del servicio
   * @returns {Promise<{status: string, timestamp: string, service: string}>}
   */
  async healthCheck() {
    return apiClient.get('/health');
  },
};

export default sensorService;
