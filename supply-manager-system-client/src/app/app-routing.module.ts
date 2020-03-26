import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { UserListComponent } from './user-list/user-list.component';

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
    path: 'users',
    component: UserListComponent
  },
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
