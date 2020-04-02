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
    ForbiddenDialogComponent
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
    MatDialogModule
    
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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(catchError(err => this.handleError(err)));
  }
  
  private handleError(err: HttpErrorResponse): Observable<any> {
    console.log('HttpRequest Error intercepted!');

      if (err.status === 401){
          this.handleUnauthorized();
          return of(err.message);
      }
      if (err.status === 404){
        this.handleNotFound();
        return of(err.message);
      }
      if (err.status === 403){
        this.handleForbidden();
        return of(err.message);
      }
      // handle your auth error or rethrow
      return of(err);
  }

  handleUnauthorized(){
    //this.router.navigate(['/login']);
    //window.location.href = '/login';
    //this.messageService.openDialog();
  
  }

  handleForbidden(){
    //this.router.navigate(['/login']);
    //this.messageService.openDialog();
  }

  handleNotFound(){
    //this.router.navigate(['/login']);
    //this.messageService.openDialog();
  }
    
}