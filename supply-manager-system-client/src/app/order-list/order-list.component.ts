import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  title = " Of My Company";
  public unassigned: String = "UNASSIGNED";

  orders: Order[] = [];

  constructor(
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

  deleteOrder(order: Order): void {
    this.orders = this.orders.filter(h => h !== order);
    this.orderService.deleteHero(order).subscribe();
  }

}
