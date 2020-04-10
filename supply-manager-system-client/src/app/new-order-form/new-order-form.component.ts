import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrderListComponent } from '../order-list/order-list.component';
import { Status } from '../status.enum';
import { Company } from '../classes/company';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  order: Order;
  companies: Company[];

  constructor(
    public orderList: OrderListComponent,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  add(productName: String, productPrice: Number, productStatus: String, sellerName: string, buyerName: string) {
    this.orderList.addNewOrder(productName, productPrice, productStatus, sellerName, buyerName);
    //console.log("sellerName= " + sellerName);
    //console.log("buyerName= " + buyerName);
    this.orderList.toggleAddOrder();
  }

  getCompanies(): void {
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }

  /*getManagersOfUser(): void{
    this.userService.getUsers()
        .subscribe(managers => this.managers = managers);
  }*/

}