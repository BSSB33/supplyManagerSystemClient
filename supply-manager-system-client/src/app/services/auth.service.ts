import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { OrderListComponent } from '../order-list/order-list.component';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn: boolean = false;
  public user: User;
  public isAdmin: boolean = false;
  public isDirector: boolean = false;
  public isManager: boolean = false;
  public redirectUrl: string;
  public url;

  private authUrl: string = 'http://localhost:8080/users';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    
  ) {
    this.url = this.router.url;
//    console.log(this.url);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if(user != null){
      httpOptions.headers = httpOptions.headers.set('Authorization', `Basic ${token}`);
      this.user = user;
      this.isLoggedIn = true;
      this.setRole(user.role);
    }
   }

  async login(username: string, password: string): Promise<User> {
    try {
      //Generates acces token
      const token = btoa(`${username}:${password}`);
      //Sets token
      httpOptions.headers = httpOptions.headers.set('Authorization', `Basic ${token}`);
      //Login
      const user = await this.http.post<User>(`${this.authUrl}/login`, {}, httpOptions).toPromise();
      if(user == undefined || !user.enabled){
        httpOptions.headers = httpOptions.headers.set('Authorization', ``);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.removeRoles();
        return;
      }
      //Logged in status
      this.isLoggedIn = true;
      //Stores the logged in user
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      this.setRole(user.role);
      //Logs user login 
      console.log("login() - " + user.username);
      this.log("login() called with user - " + user.username);
      return Promise.resolve(this.user);
    } catch (e) {
      console.log(e);
      this.log("login() failed:" + e);
      this.removeRoles();
      return Promise.reject();
    }
  }
  
  logout() {
    //Sets token to empty
    httpOptions.headers = httpOptions.headers.set('Authorization', ``);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    //Sets variables
    this.isLoggedIn = false;
    this.user = null;
    this.removeRoles();
    this.router.navigate(['/login']);
  }

  filters: boolean = false;
  toggleFilters(){
    this.filters = !this.filters;
  }

  private setRole(role){
    if(role == 'ROLE_ADMIN') this.isAdmin = true;
    if(role == 'ROLE_DIRECTOR') this.isDirector = true;
    if(role == 'ROLE_MANAGER') this.isManager = true;
  }

  private removeRoles(){
    this.isAdmin = false;
    this.isDirector = false;
    this.isManager = false;
  }

  //Logger method
  private log(message: string) {
    this.messageService.add(`AuthService: ${message}`);
  }
}
