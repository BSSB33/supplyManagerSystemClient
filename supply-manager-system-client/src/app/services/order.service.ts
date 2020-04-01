import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../classes/order';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { History } from '../classes/history';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  public href: string = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
  private sales_purchasesUrl = 'http://localhost:8080/orders/' + this.href;
  private ordersUrl = 'http://localhost:8080/orders';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic QmFsYXpzOnBhc3N3b3Jk'
    })
  };

  setHref(){
    this.href = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.sales_purchasesUrl = 'http://localhost:8080/orders/' + this.href;
  }

  getOrders(): Observable<Order[]> {
    this.setHref();
    return this.http.get<Order[]>(this.sales_purchasesUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Orders')),
        catchError(this.handleError<Order[]>('getOrders', []))
      );
  }

  getOrder(id: number): Observable<Order> {
    const url = `${this.ordersUrl}/${id}`;
    return this.http.get<Order>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Fetched Order ID=${id}`)),
      catchError(this.handleError<Order>(`getOrder ID=${id}`))
    );
  }

  getHistoriesOfOrder(id: number): Observable<History[]> {
    const url = `${this.ordersUrl}/${id}/histories`;
    return this.http.get<History[]>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Histories of order: ' + id)),
        catchError(this.handleError<History[]>('getHistoriesOfOrder', []))
      );
  }

  updateOrder (order: Order): Observable<any> {
    const url = `${this.ordersUrl}/${order.id}`;
    return this.http.put(url, order, this.httpOptions).pipe(
      tap(_ => this.log(`Updated Order ID=${order.id}`)),
      catchError(this.handleError<any>('updateOrder'))
    );
  }

  deleteOrder (order: Order | number): Observable<Order> {
    const id = typeof order === 'number' ? order : order.id;
    const url = `${this.ordersUrl}/${id}`;
    console.log(`${this.ordersUrl}/${id}`);
    return this.http.delete<Order>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted Order ID=${id}`)),
      catchError(this.handleError<Order>('deleteOrder'))
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

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`OrderService: ${message}`);
  }
}
