import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Order } from '../order';
import { OrderService } from '../order.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  title = " Of My Company";

  orders = [];

  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.orderService.href;
    this.title = this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1) + " Of My Company";
  }

  getOrders(): void {
    this.orderService.getOrders()
        .subscribe(orders => this.orders = orders);
  }

}