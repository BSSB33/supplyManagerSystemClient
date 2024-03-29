import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { History } from '../classes/history';
import { httpOptions, mainURL } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  private historiesUrl = mainURL.URL + '/histories';

  addHistory(history: History): Observable<History> {
    return this.http.post<History>(this.historiesUrl, history, httpOptions).pipe(
      tap((newHistory: History) => this.log(`added History w/ id=${newHistory.id}`)), //ID could be problem
      catchError(this.handleError<History>('addHistory'))
    );
  }

  deleteHistory (history: History | number): Observable<History> {
    const id = typeof history === 'number' ? history : history.id;
    return this.http.delete<History>(`${this.historiesUrl}/${id}`, httpOptions).pipe(
      tap(_ => this.log(`Deleted Historiy ID=${id}`)),
      catchError(this.handleError<History>('deleteHistory'))
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
    this.messageService.add(`HistoryService: ${message}`);
  }
}
