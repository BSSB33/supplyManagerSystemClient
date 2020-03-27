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
    path: 'users',
    component: UserListComponent
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
