import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
import { OrderService } from './services/order.service';
import { LoadingService } from './services/loading.service';
import { EnumService } from './services/enum.service';

export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Supply Manager System (SMS) Client';
  url:string;
  disableFilter:boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public loadingService: LoadingService,
    public enumService: EnumService,
  )
  {
    this.router.events.subscribe((event: Event) => {
      this.authService.url = this.router.url;
      this.url = this.router.url;
      //console.log(this.url);
      this.disableFilter = this.filterStatus();
      if(event instanceof NavigationStart || browserRefresh) {
        browserRefresh = !router.navigated;
        
        loadingService.setLoading(true);
        if(this.router.url == '/login') loadingService.setLoading(false);
        if(this.router.url == '/') loadingService.setLoading(false);
        if(this.router.url == '/forbidden') loadingService.setLoading(false);
        if(this.router.url == '/404') loadingService.setLoading(false);        
      }
    });
  }

  logout()
  {
    this.authService.logout();
  }

  filterStatus(){
    return this.url.includes('/stats') 
    || this.url.includes('/logs') 
    || this.url.includes('/login') 
    || this.url.includes('/orders/')
    || this.url.includes('/users/')
    || this.url.includes('/companies/')
  }

  //Calls logout(), upon closing window
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    alert("Window closed - logout()")
    this.logout();
  }
}
