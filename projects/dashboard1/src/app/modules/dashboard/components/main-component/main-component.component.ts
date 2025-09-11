import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardMainServiceService } from '../../services/dashboard-main-service.service';
import { DashBoardData, Status } from '../../models';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartDataService } from '../../../../core/services/chart-data.service';
import { ChartType } from '../../../../core/models/chart-data.interface';

@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})

export class MainComponentComponent implements OnInit {

  dashBoardService = inject(DashboardMainServiceService);
  router = inject(Router);
  private chartDataService = inject(ChartDataService);
  allData = signal<DashBoardData[]>([]);
  searchTerm = signal<string>('');
  
  // Chart state management (dùng chung qua service)
  chartState = this.chartDataService.getState();
  selectedMeterId = signal<number | null>(null);
  selectedMeterName = signal<string | null>(null);
  

  // Computed signals for statistics
  totalAnomalies = computed(() =>
    this.allData().reduce((sum, item) => sum + item.anomaly_count, 0)
  );

  totalVerifiedAnomalies = computed(() =>
    this.allData().reduce((sum, item) => sum + item.anomaly_verified, 0)
  );

  // Filtered data based on search term
  filteredData = computed(() => {
    const searchLower = this.searchTerm().toLowerCase();
    if (!searchLower) return this.allData();

    return this.allData().filter(item =>
      item.meter_data.name.toLowerCase().includes(searchLower) ||
      item.meter_data.address.toLowerCase().includes(searchLower)
    );
  });

  // Dữ liệu biểu đồ dùng chung từ service
  currentChartData = computed(() => this.chartState().chartData);

  ngOnInit() {
    this.dashBoardService.getMockData().pipe(
      catchError((err) => {
        console.error('Error fetching data', err);
        throw err;
      })
    ).subscribe((data) => {
      this.allData.set(data);
    });
  }

  onSearchChange(event: any) {
    this.searchTerm.set(event.target.value);
  }

  getStatusText(status: number): string {
    switch (status) {
      case Status.NORMAL:
        return 'Bình thường';
      case Status.ANOMALY:
        return 'Rò Rỉ';
      case Status.LOST_CONNECTION:
        return 'Mất kết nối';
      default:
        return 'Không xác định';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case Status.NORMAL:
        return 'status-normal';
      case Status.ANOMALY:
        return 'status-anomaly';
      case Status.LOST_CONNECTION:
        return 'status-lost';
      default:
        return 'status-unknown';
    }
  }

  trackByFn(index: number, item: DashBoardData): number {
    return item.id;
  }


  // Chart tab methods
  switchChartTab(tab: 'general' | 'anomaly' | 'anomaly-ai') {
    this.chartDataService.changeChartType(tab);
  }

  isActiveTab(tab: 'general' | 'anomaly' | 'anomaly-ai'): boolean {
    return this.chartState().activeChartType === tab;
  }

  // Meter selection
  selectMeter(item: DashBoardData): void {
    // Cập nhật trạm được chọn
    this.selectedMeterId.set(item.meter_data.id);
    this.selectedMeterName.set(item.meter_data.name);

    // Tạo dữ liệu mới cho trạm được chọn
    this.updateChartDataForMeter(item);
  }

  // Kiểm tra trạm đang được chọn
  isMeterSelected(item: DashBoardData): boolean {
    return this.selectedMeterId() === item.meter_data.id;
  }

  // Cập nhật dữ liệu biểu đồ cho trạm được chọn
  private updateChartDataForMeter(item: DashBoardData): void {
    this.chartDataService.selectMeter(item.meter_data.id, item.meter_data.name);
  }

  // Không cần tự tạo points — dùng service chung

  // Helper để vẽ SVG (dùng trong template)
  getPolylinePoints(data: Array<{ timestamp: string; value: number; predictedValue?: number }>, key: 'value' | 'predictedValue'): string {
    if (!data || data.length === 0) return '';
    return data.map((point, index) => {
      const x = this.getXCoordinate(index, data.length);
      const raw = key === 'value' ? point.value : (point.predictedValue ?? point.value);
      const y = this.getYCoordinate(raw);
      return `${x},${y}`;
    }).join(' ');
  }

  getXAxisLabels(data: Array<{ timestamp: string }>): string[] {
    if (!data || data.length === 0) return [];
    const totalLabels = 7;
    const step = Math.max(1, Math.floor(data.length / totalLabels));
    const labels: string[] = [];
    for (let i = 0; i < data.length; i += step) {
      labels.push(data[i].timestamp);
    }
    if (labels[labels.length - 1] !== data[data.length - 1].timestamp) {
      labels[labels.length - 1] = data[data.length - 1].timestamp;
    }
    return labels;
  }

  private getXCoordinate(index: number, totalPoints: number): number {
    const chartWidth = 800;
    const margin = 70;
    if (totalPoints <= 1) return margin;
    const step = chartWidth / (totalPoints - 1);
    return margin + (index * step);
  }

  private getYCoordinate(value: number): number {
    const chartHeight = 280;
    const margin = 30;
    const maxValue = 40;
    const clamped = Math.max(0, Math.min(maxValue, value));
    const scale = chartHeight / maxValue;
    return margin + (chartHeight - (clamped * scale));
  }
}
