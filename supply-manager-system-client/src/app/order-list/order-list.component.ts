import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
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
import { FilterPipe } from '../filter.pipe';
import { Sort } from '@angular/material/sort';
import { MatSortHeader } from '@angular/material/sort';


@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  
  title = "Orders";
  addButtonText = "Order";
  addOrder: Boolean = false;
  companies: Company[];
  users: User[];

  public unassigned: String = "UNASSIGNED";
  public selectedStatus: string = '';
  orders: Order[] = [];
  filteredOrders: Order[];
  term: string = "";
  statuses: Set<String> = new Set();

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
    this.selectedStatus = '';
    this.term = "";
    this.filter();
    this.orderService.href;
    this.title = this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1) + " Of My Company";
    this.addButtonText = (this.orderService.href.charAt(0).toUpperCase() + this.orderService.href.slice(1)).slice(0, -1);
  }

  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.filter();
  }

  private filter(): void {
    this.filteredOrders = this.selectedStatus == ''
    ? this.orders
    : this.orders.filter(order => order.status == this.selectedStatus);
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

  addNewOrder(productName: String, price: Number, status: String,
    buyerName: string, buyerManagerName: string, sellerName: string, sellerManagerName: string): void {
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
        this.filter();
        this.setStatusOptions(this.orders);
    });
  }

  setStatusOptions(orders: Order[]){
    var statuses: Set<String> = new Set();
    orders.forEach(function (order) {
      statuses.add(order.status);
    })
    this.statuses = statuses;
  }

  getOrders(): void {
    this.orderService.getOrders()
        .subscribe(orders => {
          this.orders = orders;
          this.filteredOrders = orders;
          this.setStatusOptions(orders);

        });
  }

  getUsers(): void{
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  deleteOrder(order: Order): void {
    console.log(order.id);
    this.orders = this.orders.filter(h => h !== order);
    this.filter();
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

  sortData(sort: Sort) {
    const data = this.filteredOrders.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredOrders = data;
      return;
    }

    this.filteredOrders = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'productName': return this.compare(a.productName, b.productName, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
        case 'buyer': return this.compare(a.buyer.name, b.buyer.name, isAsc);
        case 'buyerManager': return this.compareManagers(a.buyerManager, b.buyerManager, isAsc);
        case 'seller': return this.compare(a.seller.name, b.seller.name, isAsc);
        case 'sellerManager': return this.compareManagers(a.sellerManager, b.sellerManager, isAsc);
        default: return 0;
      }
    });
  }

  compareManagers(a: User, b: User, isAsc: boolean){
    if (a === b) {
      return 0;
    }
    else if(a === null){
      return 1;
    }
    else if(b === null){
      return 1;
    }
    else{
      return (a.username < b.username ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  compare(a: Number | String, b: Number | String, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }

}