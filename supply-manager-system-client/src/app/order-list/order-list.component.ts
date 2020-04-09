import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { User } from '../classes/user';
import { NewOrderFormComponent } from '../new-order-form/new-order-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../classes/company';
import { Status } from '../status.enum';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  
  title = "Orders";
  addButtonText = "Order";
  addOrder: Boolean = false;
  public unassigned: String = "UNASSIGNED";

  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private dialog: MatDialog,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.orderService.href;
    this.title = this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1) + " Of My Company";
    this.addButtonText = (this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1)).slice(0, -1);
  }

  toggleAddOrder(): void{
    this.addOrder = !this.addOrder;
    if(this.addOrder){
      this.setUpNewHOrder();
    }
  }

  private _buyer: Company;
  private _buyerManager: User;
  private _seller: Company;
  private _sellerManager: User;
  setUpNewHOrder(): void{
    if(this.orderService.href == "sales"){
      this._seller = this.authService.user.workplace;
      this._buyer = null;
    }
    else if(this.orderService.href == "purchases"){
      this._buyer = this.authService.user.workplace;
      this._seller = null;
    }

    this._buyerManager = null;
    this._sellerManager = null;
  }

  addHistoryToOrder(title: String, price: Number, status: String): void {
    title = title.trim();
    price = Number(price);
    status = status.trim();


    var order : Order = new Order(title, price, status, this._buyer, this._buyerManager, this._seller, this._sellerManager);

    this.orderService.addOrder(order)
      .subscribe(order => {
        this.orders.push(order);
      });
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
