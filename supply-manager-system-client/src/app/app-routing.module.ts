import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogsComponent } from './logs/logs.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { AuthGuard } from './auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sales',
    pathMatch: 'full'
  },
  {
    path: 'sales',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'purchases',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard] //TODO admin only endpoint
  },
  {
    path: 'orders/add',
    component: OrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/edit/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/add',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies/add',
    component: CompanyFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies/:id',
    component: CompanyDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies/edit/:id',
    component: CompanyFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies',
    component: CompanyListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', 
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
