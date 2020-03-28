import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor() { }

  /*deleteHistoriyOfOrder (history: History | number): Observable<History> {
    const id = typeof history === 'number' ? history : history.id;
    const url = `${this.ordersUrl}/${id}/histories`;
    console.log(`${this.ordersUrl}/${id}/histories`);
    return this.http.delete<History>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted Order ID=${id}`)),
      catchError(this.handleError<History>('deleteOrder'))
    );
  }*/
}
