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

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sales',
    pathMatch: 'full'
  },
  {
    path: 'sales',
    component: OrderListComponent
  },
  {
    path: 'purchases',
    component: OrderListComponent
  },
  {
    path: 'orders/add',
    component: OrderFormComponent
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent
  },
  {
    path: 'orders/edit/:id',
    component: OrderFormComponent
  },
  {
    path: 'users/add',
    component: UserFormComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'companies/add',
    component: CompanyFormComponent
  },
  {
    path: 'companies/:id',
    component: CompanyDetailComponent
  },
  {
    path: 'companies/edit/:id',
    component: CompanyFormComponent
  },
  {
    path: 'companies',
    component: CompanyListComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '403',
    component: ForbiddenComponent
  },
  {
    path: 'logs',
    component: LogsComponent
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
