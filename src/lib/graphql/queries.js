/**
 * Queries GraphQL para el dashboard
 */

// ============ QUERIES ============

export const GET_FLOW_READINGS = `
  query GetFlowReadings($deviceId: String!, $limit: Int = 100) {
    flowReadings(deviceId: $deviceId, limit: $limit) {
      id
      deviceId
      flowRate
      totalVolume
      timestamp
      pulseCount
      unit
      temperature
      pressure
    }
  }
`;

export const GET_LATEST_FLOW_READING = `
  query GetLatestFlowReading($deviceId: String!) {
    latestFlowReading(deviceId: $deviceId) {
      id
      deviceId
      flowRate
      totalVolume
      timestamp
      pulseCount
      unit
      temperature
      pressure
    }
  }
`;

export const GET_FILLINGS = `
  query GetFillings($deviceId: String!, $limit: Int = 100) {
    fillings(deviceId: $deviceId, limit: $limit) {
      id
      deviceId
      startTime
      endTime
      initialVolume
      finalVolume
      targetVolume
      status
      durationSeconds
      avgFlowRate
      actualVolume
      efficiency
    }
  }
`;

export const GET_ACTIVE_FILLING = `
  query GetActiveFilling($deviceId: String!) {
    activeFilling(deviceId: $deviceId) {
      id
      deviceId
      startTime
      initialVolume
      targetVolume
      status
    }
  }
`;

export const GET_PUMP_STATUS = `
  query GetPumpStatus($deviceId: String!) {
    pumpStatus(deviceId: $deviceId) {
      id
      deviceId
      status
      currentLevel
      maxLevel
      thresholdStop
      thresholdWarning
      lastUpdated
      levelPercentage
      shouldStop
      shouldWarn
    }
  }
`;

export const GET_FLOW_METRICS = `
  query GetFlowMetrics($deviceId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    flowMetrics(deviceId: $deviceId, startDate: $startDate, endDate: $endDate) {
      avgFlowRate
      minFlowRate
      maxFlowRate
      totalVolume
      efficiency
      periodStart
      periodEnd
    }
  }
`;

export const GET_FILLING_METRICS = `
  query GetFillingMetrics($deviceId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    fillingMetrics(deviceId: $deviceId, startDate: $startDate, endDate: $endDate) {
      totalFillings
      completedFillings
      cancelledFillings
      avgDurationSeconds
      avgVolume
      avgEfficiency
      totalVolumeDispensed
      completionRate
      periodStart
      periodEnd
    }
  }
`;

export const GET_BUSINESS_METRICS = `
  query GetBusinessMetrics($deviceId: String!, $startDate: DateTime!, $endDate: DateTime!, $pricePerLiter: Float = 0.0) {
    businessMetrics(deviceId: $deviceId, startDate: $startDate, endDate: $endDate, pricePerLiter: $pricePerLiter) {
      revenue
      peakHours
      avgFillingsPerDay
      waterEfficiency
    }
  }
`;

// ============ MUTATIONS ============

export const RECORD_FLOW_READING = `
  mutation RecordFlowReading($input: CreateFlowReadingInput!) {
    recordFlowReading(input: $input) {
      id
      deviceId
      flowRate
      totalVolume
      timestamp
    }
  }
`;

export const START_FILLING = `
  mutation StartFilling($input: StartFillingInput!) {
    startFilling(input: $input) {
      id
      deviceId
      startTime
      targetVolume
      status
    }
  }
`;

export const COMPLETE_FILLING = `
  mutation CompleteFilling($input: CompleteFillingInput!) {
    completeFilling(input: $input) {
      id
      deviceId
      endTime
      finalVolume
      status
      actualVolume
      efficiency
    }
  }
`;

export const UPDATE_PUMP_LEVEL = `
  mutation UpdatePumpLevel($input: UpdatePumpLevelInput!) {
    updatePumpLevel(input: $input) {
      id
      deviceId
      currentLevel
      levelPercentage
      shouldStop
      shouldWarn
    }
  }
`;

export const CONTROL_PUMP = `
  mutation ControlPump($input: PumpControlInput!) {
    controlPump(input: $input) {
      id
      deviceId
      status
      lastUpdated
    }
  }
`;

// ============ SUBSCRIPTIONS ============

export const LIVE_FLOW_READING_SUBSCRIPTION = `
  subscription LiveFlowReading($deviceId: String!) {
    liveFlowReading(deviceId: $deviceId) {
      deviceId
      flowRate
      totalVolume
      timestamp
      pulseCount
      isFlowing
    }
  }
`;

export const PUMP_STATUS_SUBSCRIPTION = `
  subscription PumpStatusUpdates($deviceId: String!) {
    pumpStatusUpdates(deviceId: $deviceId) {
      id
      deviceId
      status
      currentLevel
      maxLevel
      levelPercentage
      shouldStop
      shouldWarn
      lastUpdated
    }
  }
`;

export const FILLING_PROGRESS_SUBSCRIPTION = `
  subscription FillingProgress($deviceId: String!) {
    fillingProgress(deviceId: $deviceId) {
      fillingId
      deviceId
      currentVolume
      targetVolume
      progressPercentage
      elapsedSeconds
      estimatedRemainingSeconds
      currentFlowRate
      status
    }
  }
`;

export const ALERTS_SUBSCRIPTION = `
  subscription Alerts($deviceId: String) {
    alerts(deviceId: $deviceId) {
      id
      deviceId
      alertType
      message
      severity
      timestamp
    }
  }
`;
