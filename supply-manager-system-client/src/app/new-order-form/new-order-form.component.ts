import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { OrderListComponent } from '../order-list/order-list.component';
import { Company } from '../classes/company';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../classes/user';

@Component({
  selector: 'new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  order: Order;
  companies: Company[];
  users: User[]
  sales: Boolean = this.orderService.href == "sales";
  orderForm: FormGroup;
  usersOfBuyerCompany: User[];
  usersOfSellerCompany: User[];

  constructor(
    public orderList: OrderListComponent,
    public orderService: OrderService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
  ) {
    if (authService.user.role == "ROLE_ADMIN") {
      this.orderForm = new FormGroup({
        productName: new FormControl('', Validators.required),
        productPrice: new FormControl('', Validators.required),
        productStatus: new FormControl('', Validators.required),
        seller: new FormControl('', Validators.required),
        buyer: new FormControl('', Validators.required),
        sellerManager: new FormControl('', Validators.required),
        buyerManager: new FormControl('', Validators.required),
      });
      
    }
    if (this.sales && authService.user.role != "ROLE_ADMIN") {
      this.orderForm = new FormGroup({
        productName: new FormControl('', Validators.required),
        productPrice: new FormControl('', Validators.required),
        productStatus: new FormControl('', Validators.required),
        seller: new FormControl({ value: this.authService.user.workplace.name, disabled: true }, Validators.required),
        buyer: new FormControl('', Validators.required),
        sellerManager: new FormControl('', Validators.required),
        buyerManager: new FormControl({ disabled: true }, Validators.required),
      });
    }
    if (!this.sales && authService.user.role != "ROLE_ADMIN") {
      this.orderForm = new FormGroup({
        productName: new FormControl('', Validators.required),
        productPrice: new FormControl('', Validators.required),
        productStatus: new FormControl('', Validators.required),
        seller: new FormControl('', Validators.required),
        buyer: new FormControl({ value: this.authService.user.workplace.name, disabled: true }, Validators.required),
        sellerManager: new FormControl({ disabled: true }, Validators.required),
        buyerManager: new FormControl('', Validators.required),
      });
    }
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getUsers();
  }

  submit(): void {
    console.log("Form Conten: " + this.orderForm.value);
    this.add(
      this.orderForm.controls['productName'].value,
      this.orderForm.controls['productPrice'].value,
      this.orderForm.controls['productStatus'].value,
      this.orderForm.controls['buyer'].value,
      this.orderForm.controls['buyerManager'].value,
      this.orderForm.controls['seller'].value,
      this.orderForm.controls['sellerManager'].value
    );
  }

  add(productName: String, productPrice: Number, productStatus: String, buyerName: string, buyerManagerName: string, sellerName: string, sellerManagerName: string) {
    this.orderList.addNewOrder(productName, productPrice, productStatus, buyerName, buyerManagerName, sellerName, sellerManagerName);
    this.orderList.toggleAddOrder();
  }

  filterUsersOfBuyerCompany(companyName: string){
    this.usersOfBuyerCompany = this.users.filter(user => user.workplace.name == companyName);
  }

  filterUsersOfSellerCompany(companyName: string){
    this.usersOfSellerCompany = this.users.filter(user => user.workplace.name == companyName);
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => this.companies = companies);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }
}