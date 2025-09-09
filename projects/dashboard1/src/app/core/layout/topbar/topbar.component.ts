import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  showNotification = signal<boolean>(false);
  notificationCount = signal<number>(5);

  toggleNotification() {
    this.showNotification.set(!this.showNotification());
  }

  viewReports() {
    console.log('Navigating to reports...');
    // You can add navigation logic here
    this.showNotification.set(false);
  }
}
