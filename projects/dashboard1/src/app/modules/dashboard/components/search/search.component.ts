import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() placeholder: string = 'Tìm kiếm...';
  @Output() searchChange = new EventEmitter<string>();

  searchTerm: string = '';
  private searchTimeout: any;

  ngOnInit(): void {}

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value ?? '';
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.searchChange.emit(this.searchTerm);
    }, 250);
  }
}