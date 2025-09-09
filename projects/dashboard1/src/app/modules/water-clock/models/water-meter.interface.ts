export interface WaterMeter {
  id: string;
  name: string;
  address: string;
  status: 'Normal' | 'On fixing' | 'Anomaly detected';
  joinDate: string;
  selected?: boolean;
}

export interface WaterMeterFilter {
  searchTerm: string;
  statusFilter: string;
}
