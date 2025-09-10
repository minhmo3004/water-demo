export interface BreakHistory {
  id: string;
  clock: string;
  address: string;
  status: 'Normal' | 'On fixing' | 'Anomaly detected';
  date: string;
  break: number; // Số lần vỡ
  pipeMaterial: string; // Chất liệu ống
  pipeLength: number; // Chiều dài ống (m)
  latestRepair: string; // Ngày sửa chữa gần nhất
  detail?: string;
  selected?: boolean;
  expanded?: boolean;
}

export interface BreakHistoryFilter {
  searchTerm: string;
  statusFilter: string;
}
