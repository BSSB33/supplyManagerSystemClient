import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Company } from '../classes/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(    
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  private companiesUrl = 'http://localhost:8080/companies';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic QmFsYXpzOnBhc3N3b3Jk'
    })
  };

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Companies')),
        catchError(this.handleError<Company[]>('getCompanies', []))
      );
  }

  getCompanyOfUser(): Observable<Company> {
    this.log('Fetched Company Of User');
    const url = `${this.companiesUrl}/mycompany`;
    return this.http.get<Company>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Fetched Company Of User`)),
      catchError(this.handleError<Company>(`getCompany Of User`))
    );
  }

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

  private log(message: string) {
    this.messageService.add(`CompanyService: ${message}`);
  }
}
