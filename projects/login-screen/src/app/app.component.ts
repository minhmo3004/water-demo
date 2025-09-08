import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Login-Screen';
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  onLogin() {
    if (this.username && this.password) {
      this.isLoading = true;
      
      // Simulate login process
      setTimeout(() => {
        console.log('Login attempt:', { username: this.username, password: this.password });
        this.isLoading = false;
        
        // Here you would typically call your authentication service
        // For demo purposes, we'll just show an alert
        alert(`Đăng nhập thành công với tài khoản: ${this.username}`);
      }, 1500);
    }
  }
}
