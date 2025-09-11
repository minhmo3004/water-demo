export interface ChartDataPoint {
  timestamp: string;
  value: number;
  predictedValue?: number;
}

export interface ChartConfig {
  title: string;
  subtitle?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  legend: {
    label: string;
    color: string;
  }[];
}

export interface ChartData {
  meterId: number;
  meterName: string;
  config: ChartConfig;
  data: ChartDataPoint[];
}

export type ChartType = 'general' | 'anomaly' | 'anomaly-ai';

export interface ChartState {
  selectedMeterId: number | null;
  selectedMeterName: string | null;
  activeChartType: ChartType;
  chartData: ChartData | null;
}
