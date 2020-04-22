import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderListComponent } from './order-list/order-list.component';
import { AppRoutingModule } from './app-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { HttpClientModule }    from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogsComponent } from './logs/logs.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HistoryComponent } from './history/history.component';
import { HistoryFormComponent } from './history-form/history-form.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    OrderListComponent,
    UserListComponent,
    OrderDetailComponent,
    OrderFormComponent,
    PageNotFoundComponent,
    LogsComponent,
    ForbiddenComponent,
    HistoryComponent,
    HistoryFormComponent,
    CompanyListComponent,
    UserDetailComponent,
    UserFormComponent,
    CompanyDetailComponent,
    CompanyFormComponent,
    LoginFormComponent,
    ForbiddenDialogComponent,
    ConfirmationDialogComponent,
    NewOrderFormComponent,
    NewCompanyFormComponent,
    NewUserFormComponent,
    FilterPipe,
    OrderStatusFilterComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    NgbModule,
    MatInputModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
         useFactory: function(router: Router) {
           return new AuthInterceptor(router);
         },
         multi: true,
         deps: [RouterModule]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { HttpHandler, HttpEvent, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse} from '@angular/common/http';
import { ForbiddenDialogComponent } from './forbidden-dialog/forbidden-dialog.component';
import { MessageService } from './services/message.service';
import { NewOrderFormComponent } from './new-order-form/new-order-form.component';
import { NewCompanyFormComponent } from './new-company-form/new-company-form.component';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { FilterPipe } from './filter.pipe';
import { OrderStatusFilterComponent } from './order-status-filter/order-status-filter.component';
import { StatsComponent } from './stats/stats.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(catchError(err => this.handleError(err)));
  }
  
  private handleError(err: HttpErrorResponse): Observable<any> {

      if (err.status === 401){
        //Unauthorized
        //window.location.href = '/login';
        localStorage.setItem('loginMessage', "Unauthorized!");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log(err.error)
        return of(err.message);
      }
      if (err.status === 404){
        window.location.href = '/404';
        console.log(err.error)
        return of(err.message);
      }
      if (err.status === 403){
        //Forbidden
        //localStorage.removeItem('token');
        //localStorage.removeItem('user');
        window.location.href = '/forbidden';
        console.log(err.error)
        return of(err.message);
      }
      if (err.status === 406){
        console.log("406: Object Cannot be deleted!");
        console.log(err.error)
        return of(err.message);
      }
      else{
        console.log('HttpRequest Error intercepted!');
        console.log(err)
      }
      // handle your auth error or rethrow
      return of(err);
  }
    
}