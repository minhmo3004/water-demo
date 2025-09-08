import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-meter-filter',
  templateUrl: './meter-filter.component.html',
  styleUrls: ['./meter-filter.component.scss']
})
export class MeterFilterComponent {
  @Input() meters: string[] = [];
  @Input() selectedMeter: string = '';
  @Input() selectedDate: string = '';
  @Output() meterChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();

  onMeterChange(event: any) {
    this.meterChange.emit(event.target.value);
  }
  onDateChange(event: any) {
    this.dateChange.emit(event.target.value);
  }
}