import { Component, Input } from '@angular/core';
import { MeterModel } from '../../models/meter.model';

@Component({
  selector: 'app-meter-table',
  templateUrl: './meter-table.component.html',
  styleUrls: ['./meter-table.component.scss']
})
export class MeterTableComponent {
  @Input() meter: string = '';
  @Input() days: string[] = [];
  @Input() models: MeterModel[] = [];

  getValueClass(value: string): string {
    if (value.includes('thấp')) {
      return 'low';
    } else if (value.includes('trung bình')) {
      return 'medium';
    } else if (value.includes('cao')) {
      return 'high';
    } else if (value.includes('Chưa có dữ liệu') || value.includes('Chưa xác định')) {
      return 'no-data';
    }
    return '';
  }
}