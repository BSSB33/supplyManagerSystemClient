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
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { CompanyService } from '../services/company.service';

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

  companies: Company[];
  users: User[];

  orders: Order[] = [];

  constructor(
    public orderService: OrderService,
    private messageService: MessageService,
    private dialog: MatDialog,
    public authService: AuthService,
    private companyService: CompanyService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getUsers();
    this.orderService.href;
    this.title = this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1) + " Of My Company";
    this.addButtonText = (this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1)).slice(0, -1);
  }

  toggleAddOrder(): void{
    this.addOrder = !this.addOrder;
    if(this.addOrder){
      this.getCompanies();
    }
  }

  getCompanies(): void {
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }

  addNewOrder(productName: String, price: Number, status: String,buyerName: string, buyerManagerName: string, sellerName: string, sellerManagerName: string): void {
    productName = productName.trim();
    price = Number(price);
    status = status.trim();
    var seller = this.companies.find(company => company.name == sellerName);
    var buyer = this.companies.find(company => company.name == buyerName);
    var sellerManager = this.users.find(user => user.username == sellerManagerName);
    var buyerManager = this.users.find(user => user.username == buyerManagerName);
        
    var order : Order = new Order(productName, price, status, buyer, buyerManager, seller, sellerManager);

    this.orderService.addOrder(order)
      .subscribe(order => {
        this.orders.push(order);
    });
  }

  getOrders(): void {
    this.orderService.getOrders()
        .subscribe(orders => this.orders = orders);
  }

  getUsers(): void{
    this.userService.getUsers()
      .subscribe(users => this.users = users);
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
