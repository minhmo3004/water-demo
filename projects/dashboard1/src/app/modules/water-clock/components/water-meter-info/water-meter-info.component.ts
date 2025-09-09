import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WaterMeter, WaterMeterFilter } from '../../models';

@Component({
  selector: 'app-water-meter-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './water-meter-info.component.html',
  styleUrls: ['./water-meter-info.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '0', opacity: 0 }))
      ])
    ])
  ]
})
export class WaterMeterInfoComponent implements OnInit {
  // Sử dụng signals để quản lý state
  waterMeters = signal<WaterMeter[]>([]);
  filteredMeters = signal<WaterMeter[]>([]);
  filter = signal<WaterMeterFilter>({
    searchTerm: '',
    statusFilter: ''
  });
  selectAll = signal<boolean>(false);
  
  // Popup states
  showExportPopup = signal<boolean>(false);
  showSuccessNotification = signal<boolean>(false);

  constructor(private router: Router) {}

  // Mock data giống như trong hình
  private mockData: WaterMeter[] = [
    { id: '1', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 2 },
    { id: '2', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 0 },
    { id: '3', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 1 },
    { id: '4', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 0 },
    { id: '5', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 3 },
    { id: '6', name: 'Name', address: 'Address', status: 'On fixing', joinDate: '03/10/2022', anomalyDetected: 1 },
    { id: '7', name: 'Name', address: 'Address', status: 'Anomaly detected', joinDate: '03/10/2022', anomalyDetected: 5 },
    { id: '8', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 0 },
    { id: '9', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022', anomalyDetected: 2 },
  ];

  ngOnInit(): void {
    this.waterMeters.set(this.mockData);
    this.filteredMeters.set(this.mockData);
  }

  // Type guard để kiểm tra type safe
  private isValidWaterMeter(meter: any): meter is WaterMeter {
    return meter && 
           typeof meter.id === 'string' &&
           typeof meter.name === 'string' &&
           typeof meter.address === 'string' &&
           ['Normal', 'On fixing', 'Anomaly detected'].includes(meter.status) &&
           typeof meter.joinDate === 'string';
  }

  onSearch(): void {
    const currentFilter = this.filter();
    const meters = this.waterMeters();
    
    if (!meters || !Array.isArray(meters)) return;

    let filtered = meters.filter(meter => {
      if (!this.isValidWaterMeter(meter)) return false;
      
      const matchesSearch = !currentFilter.searchTerm || 
        meter.name.toLowerCase().includes(currentFilter.searchTerm.toLowerCase()) ||
        meter.address.toLowerCase().includes(currentFilter.searchTerm.toLowerCase());
        
      const matchesStatus = !currentFilter.statusFilter || 
        meter.status === currentFilter.statusFilter;
        
      return matchesSearch && matchesStatus;
    });

    this.filteredMeters.set(filtered);
  }

  onFilterChange(): void {
    this.onSearch();
  }

  onSelectAll(): void {
    const newSelectAll = !this.selectAll();
    this.selectAll.set(newSelectAll);
    
    const meters = this.filteredMeters();
    const updatedMeters = meters.map(meter => ({
      ...meter,
      selected: newSelectAll
    }));
    
    this.filteredMeters.set(updatedMeters);
  }

  onSelectMeter(meterId: string): void {
    const meters = this.filteredMeters();
    const updatedMeters = meters.map(meter => 
      meter.id === meterId ? { ...meter, selected: !meter.selected } : meter
    );
    
    this.filteredMeters.set(updatedMeters);
    
    // Cập nhật selectAll state
    const allSelected = updatedMeters.every(meter => meter.selected);
    this.selectAll.set(allSelected);
  }

  exportData(): void {
    this.showExportPopup.set(true);
  }

  // Kiểm tra có đồng hồ nào được chọn không
  hasSelectedMeters(): boolean {
    return this.filteredMeters().some(meter => meter.selected);
  }

  // Đóng popup xuất dữ liệu
  closeExportPopup(): void {
    this.showExportPopup.set(false);
  }

  // Xác nhận xuất dữ liệu
  confirmExport(): void {
    const selectedMeters = this.filteredMeters().filter(meter => meter.selected);
    console.log('Xuất dữ liệu:', selectedMeters);
    
    // Đóng popup và hiển thị thông báo thành công
    this.showExportPopup.set(false);
    this.showSuccessNotification.set(true);
    
    // Implement logic xuất dữ liệu thực tế ở đây
    // Ví dụ: call API, tạo file Excel, etc.
  }

  // Đóng thông báo thành công
  closeSuccessNotification(): void {
    this.showSuccessNotification.set(false);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Normal': return 'status-normal';
      case 'On fixing': return 'status-fixing';
      case 'Anomaly detected': return 'status-anomaly';
      default: return '';
    }
  }

  trackByMeterId(index: number, meter: WaterMeter): string {
    return meter.id;
  }

  toggleDetails(meterId: string): void {
    const meters = this.filteredMeters();
    const updatedMeters = meters.map(meter => 
      meter.id === meterId ? { ...meter, expanded: !meter.expanded } : meter
    );
    
    this.filteredMeters.set(updatedMeters);
    
    // Cập nhật cả waterMeters để đồng bộ data
    const allMeters = this.waterMeters();
    const updatedAllMeters = allMeters.map(meter => 
      meter.id === meterId ? { ...meter, expanded: !meter.expanded } : meter
    );
    this.waterMeters.set(updatedAllMeters);
  }

  viewDetails(meterId: string): void {
    this.toggleDetails(meterId);
  }

  // Kiểm tra xem meter có đang expanded không
  isExpanded(meterId: string): boolean {
    const meter = this.filteredMeters().find(m => m.id === meterId);
    return meter?.expanded || false;
  }

  // Điều hướng đến trang biểu đồ
  viewChart(meterId: string): void {
    const meter = this.filteredMeters().find(m => m.id === meterId);
    if (meter && this.isValidWaterMeter(meter)) {
      const encodedName = encodeURIComponent(meter.name);
      this.router.navigate(['/chart', meterId, encodedName]);
    }
  }
}
