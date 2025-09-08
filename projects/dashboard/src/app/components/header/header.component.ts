import { Component } from '@angular/core';
import { MeterSearchService } from '../../services/meter-search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchTerm: string = '';

  constructor(private meterSearchService: MeterSearchService) {}

  onSearch(): void {
    this.meterSearchService.setSearchTerm(this.searchTerm.trim());
  }
}
