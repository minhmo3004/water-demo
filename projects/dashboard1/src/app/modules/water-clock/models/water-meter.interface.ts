export interface WaterMeter {
  id: string;
  name: string;
  address: string;
  status: 'Normal' | 'On fixing' | 'Anomaly detected';
  joinDate: string;
  selected?: boolean;
  expanded?: boolean;
  anomalyDetected?: number;
}

export interface WaterMeterFilter {
  searchTerm: string;
  statusFilter: string;
}
