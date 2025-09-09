import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chart-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss']
})
export class ChartViewComponent implements OnInit {
  // Thông tin meter được truyền qua route params
  meterId = signal<string>('');
  meterName = signal<string>('Name');
  
  // Chart state management
  activeChartTab = signal<'general' | 'anomaly' | 'anomaly-ai'>('general');
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Lấy thông tin từ route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.meterId.set(params['id']);
      }
      if (params['name']) {
        this.meterName.set(decodeURIComponent(params['name']));
      }
    });
  }

  // Chart data cho từng tab (sử dụng dữ liệu từ dashboard)
  generalChartData = computed(() => ({
    title: 'Tổng quát',
    subtitle: 'General Flow Analysis (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'original', label: 'Flow Rate', color: '#ff8c00' },
      { key: 'reconstructed', label: 'Predicted Flow', color: '#4299e1' }
    ],
    originalPoints: "70,200 100,240 130,160 160,190 190,250 220,120 250,160 280,200 310,90 340,130 370,170 400,140 430,110 460,180 490,150 520,80 550,120 580,160 610,100 640,140 670,200 700,180 730,220 760,160 790,190 820,140 850,180",
    reconstructedPoints: "70,210 100,250 130,170 160,200 190,260 220,130 250,170 280,210 310,100 340,140 370,180 400,150 430,120 460,190 490,160 520,90 550,130 580,170 610,110 640,150 670,210 700,190 730,230 760,170 790,200 820,150 850,190"
  }));

  anomalyChartData = computed(() => ({
    title: 'Hiển thị bất thường',
    subtitle: 'Anomaly Detection Analysis (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'original', label: 'Normal Flow', color: '#00c851' },
      { key: 'reconstructed', label: 'Anomaly Pattern', color: '#ff4444' }
    ],
    originalPoints: "70,180 100,220 130,140 160,170 190,230 220,100 250,140 280,180 310,70 340,110 370,150 400,120 430,90 460,160 490,130 520,60 550,100 580,140 610,80 640,120 670,180 700,160 730,200 760,140 790,170 820,120 850,160",
    reconstructedPoints: "70,190 100,230 130,150 160,180 190,240 220,110 250,150 280,190 310,80 340,120 370,160 400,130 430,100 460,170 490,140 520,70 550,110 580,150 610,90 640,130 670,190 700,170 730,210 760,150 790,180 820,130 850,170"
  }));

  anomalyAiChartData = computed(() => ({
    title: 'Hiển thị bất thường - AI',
    subtitle: 'AI-Enhanced Anomaly Detection (2024-04-17 to 2024-06-01)',
    legend: [
      { key: 'original', label: 'AI Predicted', color: '#9c27b0' },
      { key: 'reconstructed', label: 'Confidence Level', color: '#ff5722' }
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

  // Navigation methods
  goBack(): void {
    this.location.back();
  }

  // Chart tab switching
  setActiveTab(tab: 'general' | 'anomaly' | 'anomaly-ai'): void {
    this.activeChartTab.set(tab);
  }


  // Parse SVG points string to array of coordinates
  getDataPoints(pointsString: string): {x: number, y: number}[] {
    if (!pointsString) return [];
    
    return pointsString.split(' ').map(point => {
      const [x, y] = point.split(',').map(Number);
      return { x, y };
    });
  }
}
