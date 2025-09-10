export interface PredictionData {
  id: string;
  thoi_gian: string; // Thời gian
  luu_luong: string; // Lưu lượng
  trang_thai: string; // Trạng thái
}

export interface PredictionResponse {
  title: string;
  data: PredictionData[];
}

export interface ChartPanelState {
  showPredictionPanel: boolean;
  panelType: 'anomaly' | 'anomaly-ai' | null;
}
