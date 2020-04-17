import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { User } from '../classes/user';
import { httpOptions } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private usersUrl = 'http://localhost:8080/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url, httpOptions).pipe(
      tap(_ => this.log(`Fetched User ID=${id}`)),
      catchError(this.handleError<User>(`getUser ID=${id}`))
    );
  }

  updateUser (user: User): Observable<any> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http.put(url, user, httpOptions).pipe(
      tap(_ => this.log(`Updated User ID=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl + '/register', user, httpOptions).pipe(
      tap((company: User) => this.log(`registered User w/ id=${company.id}`)),
      catchError(this.handleError<User>('registerUser'))
    );
  }

  disableOrEnableUser (user: User): Observable<any> {
    var url;
    if(user.enabled){
      url = `${this.usersUrl}/${user.id}/disable`;
    }
    else if(!user.enabled){
      url = `${this.usersUrl}/${user.id}/enable`;
    }
    
    return this.http.put(url, user, httpOptions).pipe(
      tap(_ => this.log(`Disabled/Enabled User ID=${user.id}`)),
      catchError(this.handleError<any>('disableOrEnableUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}
