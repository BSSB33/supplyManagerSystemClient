import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderListComponent } from '../order-list/order-list.component';
import { Status } from '../status.enum';

@Component({
  selector: 'new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  order: Order;

  constructor(public orderList: OrderListComponent) { }

  ngOnInit(): void {
  }

  add(productName: String, productPrice: Number, productStatus: String){
    this.orderList.addHistoryToOrder(productName, productPrice, productStatus);
    this.orderList.toggleAddOrder();
  }

}
