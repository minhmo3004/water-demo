import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterMeter, WaterMeterFilter } from '../../models';

@Component({
  selector: 'app-water-meter-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './water-meter-info.component.html',
  styleUrls: ['./water-meter-info.component.scss']
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

  // Mock data giống như trong hình
  private mockData: WaterMeter[] = [
    { id: '1', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '2', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '3', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '4', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '5', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '6', name: 'Name', address: 'Address', status: 'On fixing', joinDate: '03/10/2022' },
    { id: '7', name: 'Name', address: 'Address', status: 'Anomaly detected', joinDate: '03/10/2022' },
    { id: '8', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
    { id: '9', name: 'Name', address: 'Address', status: 'Normal', joinDate: '03/10/2022' },
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
    const selectedMeters = this.filteredMeters().filter(meter => meter.selected);
    console.log('Xuất dữ liệu:', selectedMeters);
    // Implement logic xuất dữ liệu ở đây
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

  viewDetails(meterId: string): void {
    console.log('Xem chi tiết meter:', meterId);
    // Implement logic xem chi tiết ở đây
  }
}
