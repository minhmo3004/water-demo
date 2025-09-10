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

  private mockData: BreakHistory[] = [
    { 
      id: '1', 
      clock: 'Name', 
      address: 'Address', 
      status: 'On fixing', 
      date: '03/10/2022',
      break: 2,
      pipeMaterial: 'HDPE',
      pipeLength: 1000,
      latestRepair: '03/10/2022'
    },
    { 
      id: '2', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 1,
      pipeMaterial: 'HDPE',
      pipeLength: 1000,
      latestRepair: '03/10/2022'
    },
    { 
      id: '3', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 0,
      pipeMaterial: 'PVC',
      pipeLength: 800,
      latestRepair: '15/09/2022'
    },
    { 
      id: '4', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 1,
      pipeMaterial: 'HDPE',
      pipeLength: 1200,
      latestRepair: '28/09/2022'
    },
    { 
      id: '5', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 3,
      pipeMaterial: 'Steel',
      pipeLength: 900,
      latestRepair: '10/10/2022'
    },
    { 
      id: '6', 
      clock: 'Name', 
      address: 'Address', 
      status: 'On fixing', 
      date: '03/10/2022',
      break: 1,
      pipeMaterial: 'HDPE',
      pipeLength: 1100,
      latestRepair: '05/10/2022'
    },
    { 
      id: '7', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Anomaly detected', 
      date: '03/10/2022',
      break: 4,
      pipeMaterial: 'PVC',
      pipeLength: 750,
      latestRepair: '01/10/2022'
    },
    { 
      id: '8', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 0,
      pipeMaterial: 'HDPE',
      pipeLength: 1300,
      latestRepair: '20/09/2022'
    },
    { 
      id: '9', 
      clock: 'Name', 
      address: 'Address', 
      status: 'Normal', 
      date: '03/10/2022',
      break: 2,
      pipeMaterial: 'Steel',
      pipeLength: 950,
      latestRepair: '12/10/2022'
    },
  ];

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
      filtered = filtered.filter(history =>
        history.clock.toLowerCase().includes(searchTerm) ||
        history.address.toLowerCase().includes(searchTerm) ||
        history.status.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (currentFilter.statusFilter) {
      filtered = filtered.filter(history => history.status === currentFilter.statusFilter);
    }

    this.filteredHistories.set(filtered);
    this.updateSelectAllState();
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
