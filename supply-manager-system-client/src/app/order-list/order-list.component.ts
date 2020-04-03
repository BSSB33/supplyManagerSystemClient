import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ForbiddenDialogComponent } from '../forbidden-dialog/forbidden-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';

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
    private orderService: OrderService,
    private messageService: MessageService,
    private dialog: MatDialog,
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

  openDeleteOrderDialog(order: Order) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure, you want to delte this Order?',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.log("OrderDeletion: Option: DELETE");
        this.deleteOrder(order);
      }
      else {
        this.log("OrderDeletion: Option: CANCEL");
      }
    });

  }

  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }

}
