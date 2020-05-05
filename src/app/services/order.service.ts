import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../classes/order';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { History } from '../classes/history';
import { httpOptions, AuthService, mainURL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  public href: string = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
  private sales_purchasesUrl = mainURL.URL + '/orders/' + this.href;
  private ordersUrl = mainURL.URL + '/orders';

  setHref(){
    this.href = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
    this.sales_purchasesUrl = this.ordersUrl + '/' + this.href;
  }

  getOrders(): Observable<Order[]> {
    this.setHref();
    var url = this.ordersUrl;
    if(this.href != "orders") url = this.sales_purchasesUrl;
    return this.http.get<Order[]>(url, httpOptions)
      .pipe(
        //delay(2000),
        tap(_ => this.log('Fetched Orders')),
        catchError(this.handleError<Order[]>('getOrders', []))
      );
  }

  async getOrder(id: number): Promise<Order> {
    const url = `${this.ordersUrl}/${id}`;
    return this.http.get<Order>(url, httpOptions).pipe(
      //delay(2000),
      tap(_ => this.log(`Fetched Order ID=${id}`)),
      catchError(this.handleError<Order>(`getOrder ID=${id}`))
    ).toPromise();
  }

  getHistoriesOfOrder(id: number): Observable<History[]> {
    const url = `${this.ordersUrl}/${id}/histories`;
    return this.http.get<History[]>(url, httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Histories of order: ' + id)),
        catchError(this.handleError<History[]>('getHistoriesOfOrder', []))
      );
  }

  updateOrder (order: Order): Observable<any> {
    const url = `${this.ordersUrl}/${order.id}`;
    return this.http.put(url, order, httpOptions).pipe(
      tap(_ => this.log(`Updated Order ID=${order.id}`)),
      catchError(this.handleError<any>('updateOrder'))
    );
  }

  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, order, httpOptions).pipe(
      tap((order: Order) => this.log(`added Order w/ id=${order.id}`)),
      catchError(this.handleError<Order>('addOrder'))
    );
  }

  deleteOrder (order: Order | number): Observable<Order> {
    const id = typeof order === 'number' ? order : order.id;
    const url = `${this.ordersUrl}/${id}`;
    return this.http.delete<Order>(url, httpOptions).pipe(
      tap(_ => this.log(`Deleted Order ID=${id}`)),
      catchError(this.handleError<Order>('deleteOrder'))
    );
  }

  
  async getMonthlyIncomeStats(): Promise<any> {
    return this.http.get<any>(this.ordersUrl + '/stats/monthlyIncome', httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Stats')),
        catchError(this.handleError<any>('getRecordedIncomeStats', []))
      ).toPromise();
  }
  
  async getMonthlyExpensesStats(): Promise<any> {
    return this.http.get<any>(this.ordersUrl + '/stats/monthlyExpense', httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Stats')),
        catchError(this.handleError<any>('getRecordedIncomeStats', []))
      ).toPromise();
  }

  async getPartnerStats(): Promise<any> {
    return this.http.get<any>(this.ordersUrl + '/stats/partnersStat', httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Stats')),
        catchError(this.handleError<any>('getPartnerStats', []))
      ).toPromise();
  }
  
  async getOrderCountStats(): Promise<any> {
    return this.http.get<any>(this.ordersUrl + '/stats/orderCount', httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Stats')),
        catchError(this.handleError<any>('getOrderCountStats', []))
      ).toPromise();
  }

  async getUserCountStats(): Promise<any> {
    return this.http.get<any>(this.ordersUrl + '/stats/userCount', httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Stats')),
        catchError(this.handleError<any>('getUserCountStats', []))
      ).toPromise();
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
