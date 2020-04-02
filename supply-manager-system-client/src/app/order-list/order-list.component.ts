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
  
  title = "Orders";
  addButtonText = "Order";
  public unassigned: String = "UNASSIGNED";

  orders: Order[] = [];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.orderService.href;
    this.title = this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1) + " Of My Company";
    this.addButtonText = (this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1)).slice(0, -1);
  }

  getOrders(): void {
    this.orderService.getOrders()
        .subscribe(orders => this.orders = orders);
  }

  deleteOrder(order: Order): void {
    this.orders = this.orders.filter(h => h !== order);
    this.orderService.deleteOrder(order).subscribe();
  }

}
