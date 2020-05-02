import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { Company } from '../classes/company';
import { httpOptions } from './auth.service';
import * as $ from 'jquery';
import * as L from 'leaflet';
import 'proj4leaflet';

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
    return this.http.get<Company[]>(this.companiesUrl, httpOptions).pipe(
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

  //Leaflet map  
  mymap;
  getMap(companies){

    if(this.mymap != null) this.mymap.remove();
    this.mymap = L.map('mapid').setView([47.497913, 19.040236], 12);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnNzYjMzIiwiYSI6ImNrOW85cTUxMzA3eTMzZG1ydmwyYzhhaHEifQ.NdZf9IMNO1ZNiKJxTZbTTw',
    {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.mymap);

    companies.forEach(company => {
      if(companies.lat != null || company.lon != null || companies.lat != "0" || company.lon != "0"){
        //console.log(company.lat + " - " +  company.lon);
        L.marker([company.lat, company.lon]).bindPopup(company.name).addTo(this.mymap);
      }
    }); 
  }
}
