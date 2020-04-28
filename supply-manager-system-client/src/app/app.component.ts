import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Supply Manager System (SMS) Client';
  loading = true;

  constructor(
    public authService: AuthService,
    public router: Router,
  ){
    this.router.events.subscribe((event: Event) => {
      if(event instanceof NavigationStart) {
        this.loading = true;
      }
      else if(event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }

  logout()
  {
    this.authService.logout();
  }
}
