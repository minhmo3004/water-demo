import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakHistory, BreakHistoryFilter } from '../../models';

@Component({
  selector: 'app-break-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './break-history.component.html',
  styleUrls: ['./break-history.component.scss'],
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
export class BreakHistoryComponent implements OnInit {
  // Sử dụng signals để quản lý state
  breakHistories = signal<BreakHistory[]>([]);
  filteredHistories = signal<BreakHistory[]>([]);
  filter = signal<BreakHistoryFilter>({
    searchTerm: '',
    statusFilter: ''
  });
  selectAll = signal<boolean>(false);

  // Popup states
  showExportPopup = signal<boolean>(false);
  showSuccessNotification = signal<boolean>(false);

  constructor(private router: Router) {}

  // Sinh mock data thực tế, đa dạng và ổn định
  private generateMockData(total: number = 60): BreakHistory[] {
    const names = [
      'Văn Đẩu 8','Văn Đẩu 9','Văn Đẩu 10','Hoà Khánh 1','Hoà Khánh 2',
      'Liên Chiểu 1','Liên Chiểu 2','Thanh Khê 1','Thanh Khê 2','Sơn Trà 1',
      'Sơn Trà 2','Ngũ Hành Sơn 1','Ngũ Hành Sơn 2','Hải Châu 1','Hải Châu 2',
      'Cẩm Lệ 1','Cẩm Lệ 2','Hoà Vang 1','Hoà Vang 2','Hoà Tiến 1'
    ];
    const streets = [
      'Nguyễn Huệ','Lê Lợi','Đồng Khởi','Nguyễn Du','Pasteur',
      'Hai Bà Trưng','Lê Duẩn','Tôn Đức Thắng','Phan Chu Trinh','Trần Phú'
    ];
    const materials = ['HDPE','PVC','Steel','Ductile iron'];
    const statuses: Array<BreakHistory['status']> = ['Normal','On fixing','Anomaly detected'];
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const randomDate = (): string => {
      const start = new Date(2022, 0, 1).getTime();
      const end = new Date(2025, 11, 31).getTime();
      const d = new Date(start + Math.random() * (end - start));
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    return Array.from({ length: total }, (_, i) => {
      const clock = names[i % names.length] + ` - ${pad((i % 50) + 1)}`;
      const address = `${Math.floor(Math.random() * 200) + 1} ${streets[i % streets.length]}, Đà Nẵng`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const breaks = status === 'Anomaly detected' ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 2);
      return {
        id: String(i + 1),
        clock,
        address,
        status,
        date: randomDate(),
        break: breaks,
        pipeMaterial: materials[i % materials.length],
        pipeLength: 700 + (i % 10) * 50,
        latestRepair: randomDate()
      } as BreakHistory;
    });
  }

  private mockData: BreakHistory[] = this.generateMockData(60);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.breakHistories.set(this.mockData);
    this.filteredHistories.set(this.mockData);
  }

  onFilterChange(): void {
    const currentFilter = this.filter();
    this.filter.set({ ...currentFilter });
    this.applyFilters();
  }

  private applyFilters(): void {
    const currentFilter = this.filter();
    let filtered = this.breakHistories();

    // Apply search filter
    if (currentFilter.searchTerm) {
      const searchTerm = currentFilter.searchTerm.toLowerCase();
      // Yêu cầu: chỉ tìm theo TÊN (clock)
      filtered = filtered.filter(history =>
        history.clock.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (currentFilter.statusFilter) {
      filtered = filtered.filter(history => history.status === currentFilter.statusFilter);
    }

    this.filteredHistories.set(filtered);
    this.updateSelectAllState();
  }

  // Debounce tìm kiếm theo tên để UX mượt mà
  private searchTimeout: any;
  onSearchTermChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target?.value ?? '';
    this.filter.update(f => ({ ...f, searchTerm: value }));
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => this.applyFilters(), 250);
  }

  onSelectAll(): void {
    const newSelectAll = !this.selectAll();
    this.selectAll.set(newSelectAll);
    
    const updated = this.filteredHistories().map(history => ({
      ...history,
      selected: newSelectAll
    }));
    
    this.filteredHistories.set(updated);
    this.updateMainDataSelection(updated);
  }

  onItemSelect(historyId: string): void {
    const updated = this.filteredHistories().map(history =>
      history.id === historyId ? { ...history, selected: !history.selected } : history
    );
    
    this.filteredHistories.set(updated);
    this.updateMainDataSelection(updated);
    this.updateSelectAllState();
  }

  private updateMainDataSelection(filteredData: BreakHistory[]): void {
    const allData = this.breakHistories().map(history => {
      const filteredItem = filteredData.find(f => f.id === history.id);
      return filteredItem || history;
    });
    
    this.breakHistories.set(allData);
  }

  private updateSelectAllState(): void {
    const filtered = this.filteredHistories();
    const selectedCount = filtered.filter(history => history.selected).length;
    this.selectAll.set(selectedCount === filtered.length && filtered.length > 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Normal': return 'status-normal';
      case 'On fixing': return 'status-fixing';
      case 'Anomaly detected': return 'status-anomaly';
      default: return 'status-normal';
    }
  }

  trackByHistoryId(index: number, history: BreakHistory): string {
    return history.id;
  }

  private isValidBreakHistory(history: any): history is BreakHistory {
    return history && typeof history.id === 'string' && typeof history.clock === 'string';
  }

  // Export functionality
  exportData(): void {
    this.showExportPopup.set(true);
  }

  hasSelectedHistories(): boolean {
    return this.filteredHistories().some(history => history.selected);
  }

  closeExportPopup(): void {
    this.showExportPopup.set(false);
  }

  confirmExport(): void {
    const selectedHistories = this.filteredHistories().filter(history => history.selected);
    console.log('Xuất dữ liệu lịch sử vỡ:', selectedHistories);
    this.showExportPopup.set(false);
    this.showSuccessNotification.set(true);
  }

  closeSuccessNotification(): void {
    this.showSuccessNotification.set(false);
  }

  // Detail functionality
  toggleDetails(historyId: string): void {
    const histories = this.filteredHistories();
    const updatedHistories = histories.map(history =>
      history.id === historyId ? { ...history, expanded: !history.expanded } : history
    );
    this.filteredHistories.set(updatedHistories);

    const allHistories = this.breakHistories();
    const updatedAllHistories = allHistories.map(history =>
      history.id === historyId ? { ...history, expanded: !history.expanded } : history
    );
    this.breakHistories.set(updatedAllHistories);
  }

  viewDetails(historyId: string): void {
    this.toggleDetails(historyId);
  }

  isExpanded(historyId: string): boolean {
    const history = this.filteredHistories().find(h => h.id === historyId);
    return history?.expanded || false;
  }
}
