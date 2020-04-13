import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Company } from '../classes/company';
import { httpOptions } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(    
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private companiesUrl = 'http://localhost:8080/companies';


  getCompany(id: number): Observable<Company> {
    const url = `${this.companiesUrl}/${id}`;
    return this.http.get<Company>(url, httpOptions).pipe(
      tap(_ => this.log(`Fetched Company ID=${id}`)),
      catchError(this.handleError<Company>(`getCompany ID=${id}`))
    );
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesUrl, httpOptions)
      .pipe(
        tap(_ => this.log('Fetched Companies')),
        catchError(this.handleError<Company[]>('getCompanies', []))
      );
  }

  getCompanyOfUser(): Observable<Company> {
    this.log('Fetched Company Of User');
    const url = `${this.companiesUrl}/mycompany`;
    return this.http.get<Company>(url, httpOptions).pipe(
      tap(_ => this.log(`Fetched Company Of User`)),
      catchError(this.handleError<Company>(`getCompany Of User`))
    );
  }

  updateCompany (company: Company): Observable<Company> {
    return this.http.put(this.companiesUrl+"/"+ company.id, company, httpOptions).pipe(
      tap(_ => this.log(`Updated Company ID=${company.id}`)),
      catchError(this.handleError<any>('updateCompany'))
    );
  }

  addCompany(copmany: Company): Observable<Company> {
    return this.http.post<Company>(this.companiesUrl + '/register', copmany, httpOptions).pipe(
      tap((company: Company) => this.log(`added Company w/ id=${company.id}`)),
      catchError(this.handleError<Company>('addCompany'))
    );
  }

  disableOrEnableCompany (company: Company): Observable<any> {
    var url;
    if(company.active){
      url = `${this.companiesUrl}/${company.id}/disable`;
    }
    else if(!company.active){
      url = `${this.companiesUrl}/${company.id}/enable`;
    }
    
    return this.http.put(url, company, httpOptions).pipe(
      tap(_ => this.log(`Disabled/Enabled User ID=${company.id}`)),
      catchError(this.handleError<any>('disableOrEnableUser'))
    );
  }

  deleteCompany (company: Company | number): Observable<Company> {
    const id = typeof company === 'number' ? company : company.id;
    const url = `${this.companiesUrl}/${id}`;
    return this.http.delete<Company>(url, httpOptions).pipe(
      tap(_ => this.log(`Deleted Company ID=${id}`)),
      catchError(this.handleError<Company>('deleteCompany'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`CompanyService: ${message}`);
  }
}
