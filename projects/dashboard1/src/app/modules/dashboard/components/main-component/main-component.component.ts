import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardMainServiceService } from '../../services/dashboard-main-service.service';
import { DashBoardData, Status } from '../../models';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  allData = signal<DashBoardData[]>([]);
  searchTerm = signal<string>('');
  
  // Chart state management
  activeChartTab = signal<'general' | 'anomaly' | 'anomaly-ai'>('general');

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

  // Chart data for different tabs
  generalChartData = computed(() => ({
    title: 'Tổng quát',
    subtitle: 'Original vs Reconstructed Flow (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'original', label: 'Original Flow', color: '#4285f4' },
      { key: 'reconstructed', label: 'Reconstructed Flow', color: '#ff9800' }
    ],
    originalPoints: "70,160 100,140 130,200 160,170 190,120 220,190 250,150 280,100 310,210 340,140 370,80 400,180 430,120 460,70 490,160 520,110 550,60 580,150 610,100 640,50 670,140 700,90 730,40 760,130 790,80 820,30 850,120",
    reconstructedPoints: "70,170 100,150 130,210 160,180 190,130 220,200 250,160 280,110 310,220 340,150 370,90 400,190 430,130 460,80 490,170 520,120 550,70 580,160 610,110 640,60 670,150 700,100 730,50 760,140 790,90 820,40 850,130"
  }));

  anomalyChartData = computed(() => ({
    title: 'Hiển thị bất thường',
    subtitle: 'Anomaly Detection Results (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'normal', label: 'Normal Flow', color: '#4caf50' },
      { key: 'anomaly', label: 'Anomaly Detected', color: '#f44336' }
    ],
    originalPoints: "70,180 100,160 130,180 160,170 190,140 220,160 250,170 280,120 310,200 340,160 370,100 400,190 430,140 460,90 490,180 520,130 550,80 580,170 610,120 640,70 670,160 700,110 730,60 760,150 790,100 820,50 850,140",
    reconstructedPoints: "70,180 100,160 130,300 160,170 190,140 220,280 250,170 280,120 310,290 340,160 370,100 400,270 430,140 460,90 490,260 520,130 550,80 580,250 610,120 640,70 670,240 700,110 730,60 760,230 790,100 820,50 850,220"
  }));

  anomalyAiChartData = computed(() => ({
    title: 'Hiển thị bất thường - AI',
    subtitle: 'AI-Enhanced Anomaly Detection (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'predicted', label: 'AI Predicted', color: '#9c27b0' },
      { key: 'confidence', label: 'Confidence Level', color: '#ff5722' }
    ],
    originalPoints: "70,170 100,150 130,190 160,160 190,130 220,180 250,160 280,110 310,200 340,150 370,90 400,180 430,130 460,80 490,170 520,120 550,70 580,160 610,110 640,60 670,150 700,100 730,50 760,140 790,90 820,40 850,130",
    reconstructedPoints: "70,175 100,155 130,195 160,165 190,135 220,185 250,165 280,115 310,205 340,155 370,95 400,185 430,135 460,85 490,175 520,125 550,75 580,165 610,115 640,65 670,155 700,105 730,55 760,145 790,95 820,45 850,135"
  }));

  // Current chart data based on active tab
  currentChartData = computed(() => {
    switch (this.activeChartTab()) {
      case 'anomaly':
        return this.anomalyChartData();
      case 'anomaly-ai':
        return this.anomalyAiChartData();
      default:
        return this.generalChartData();
    }
  });

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

  navigateToDetail(item: DashBoardData) {
    this.router.navigate(['/detail', item.meter_data.id, item.meter_data.name]);
  }

  // Chart tab methods
  switchChartTab(tab: 'general' | 'anomaly' | 'anomaly-ai') {
    this.activeChartTab.set(tab);
  }

  isActiveTab(tab: 'general' | 'anomaly' | 'anomaly-ai'): boolean {
    return this.activeChartTab() === tab;
  }
}
