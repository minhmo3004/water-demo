import { Component, OnDestroy, OnInit } from '@angular/core';
import { MeterModel } from '../../models/meter.model';
import { MeterSearchService } from '../../services/meter-search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  meters = ['Văn Đẩu 8', 'Văn Đẩu 9', 'Văn Đẩu 10', 'Văn Đẩu 11'];
  selectedMeter = this.meters[0];
  selectedDate = this.getToday();


  // Dữ liệu hiện tại để hiển thị
  currentModels: MeterModel[] = [];
  currentDays: string[] = [];

  private subscriptions = new Subscription();

  constructor(private meterSearchService: MeterSearchService) {}

  ngOnInit() { 
    this.updateCurrentData();
    this.observeSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  getToday(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }

  onMeterChange(meter: string) {
    this.selectedMeter = meter;
    this.updateCurrentData();
  }

  onDateChange(date: string) {
    this.selectedDate = date;
    this.updateCurrentData();
  }

  updateCurrentData() {
    
    // Tạo dữ liệu mới dựa trên ngày được chọn
    this.currentModels = this.createModelsForSelectedDate(this.selectedDate);
    
    // Cập nhật danh sách ngày để hiển thị (7 ngày từ ngày được chọn)
    this.currentDays = this.generateDaysFromSelectedDate(this.selectedDate);
  }

  private observeSearch(): void {
    const sub = this.meterSearchService.searchTerm$.subscribe(term => {
      if (!term) {
        return;
      }
      const match = this.meters.find(m => m.toLowerCase().includes(term.toLowerCase())) || null;
      if (match) {
        this.onMeterChange(match);
      }
    });
    this.subscriptions.add(sub);
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  generateDaysFromSelectedDate(selectedDate: string): string[] {
    const date = new Date(selectedDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(date);
      currentDate.setDate(date.getDate() + i);
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      days.push(`${day}/${month}/${year}`);
    }
    
    return days;
  }

  createDefaultModels(): MeterModel[] {
    return [
      {
        name: 'LSTM_minflow',
        values: Array(7).fill('Chưa có dữ liệu')
      },
      {
        name: 'LSTM_maxflow',
        values: Array(7).fill('Chưa có dữ liệu')
      },
      {
        name: 'Isolation_minflow',
        values: Array(7).fill('Chưa có dữ liệu')
      },
      {
        name: 'Isolation_maxflow',
        values: Array(7).fill('Chưa có dữ liệu')
      },
      {
        name: 'Kết luận',
        values: Array(7).fill('Chưa xác định')
      }
    ];
  }

  createModelsForSelectedDate(selectedDate: string): MeterModel[] {
    const models: MeterModel[] = [];
    
    // Tạo dữ liệu cho 7 ngày từ ngày được chọn
    const days = this.generateDaysFromSelectedDate(selectedDate);
    
    // Tạo dữ liệu cho từng model
    const modelNames = ['LSTM_minflow', 'LSTM_maxflow', 'Isolation_minflow', 'Isolation_maxflow', 'Kết luận'];
    
    modelNames.forEach(modelName => {
      const values: string[] = [];
      
      days.forEach((day, index) => {
        if (modelName === 'Kết luận') {
          values.push(this.getRandomConclusionValue(index));
        } else {
          values.push(this.getRandomModelValue(index));
        }
      });
      
      models.push({
        name: modelName,
        values: values
      });
    });
    
    return models;
  }

  getRandomModelValue(dayIndex: number): string {
    const values = ['Chưa có dữ liệu', 'Nghi ngờ thấp', 'Nghi ngờ cao'];
    if (dayIndex === 0) {
      return values[Math.floor(Math.random() * values.length)];
    } else {
      return values[Math.floor(Math.random() * values.length)];
    }
  }

  getRandomConclusionValue(dayIndex: number): string {
    const values = ['Chưa xác định', 'Nghi ngờ thấp', 'Nghi ngờ trung bình', 'Nghi ngờ cao'];
    if (dayIndex === 0) {
      return values[Math.floor(Math.random() * values.length)];
    } else {
      return values[Math.floor(Math.random() * values.length)];
    }
  }
}