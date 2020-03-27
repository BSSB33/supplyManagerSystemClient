import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../classes/order';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public href: string = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
  private ordersUrl = 'http://localhost:8080/orders/' + this.href;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic QmFsYXpzOnBhc3N3b3Jk'
    })
  };

  setHref(){
    this.href = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.ordersUrl = 'http://localhost:8080/orders/' + this.href;
  }

  getOrders(): Observable<Order[]> {
    this.setHref();
    console.log(this.href)
    return this.http.get<Order[]>(this.ordersUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Orders')),
        catchError(this.handleError<Order[]>('getOrders', []))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
    console.log(`HeroService: ${message}`);
  }
}
