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
import { MessageService } from '../services/message.service';
import { EnumService } from '../services/enum.service';
import { AppComponent } from '../app.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  order: Order;
  companies: Company[];
  selectedBuyerCompany: Company;
  selectedSellerCompany: Company;
  selectableCompanyiesForBuyer: Company[];
  selectableCompanyiesForSeller: Company[];
  users: User[]
  sales: Boolean = this.orderService.href == "sales";
  statuses: String[];
  orderForm: FormGroup;
  usersOfBuyerCompany: User[];
  usersOfSellerCompany: User[];

  constructor(
    public orderList: OrderListComponent,
    public orderService: OrderService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    public enumService: EnumService,
    private loadingService: LoadingService,
  ) {
    if (authService.isAdmin) {
      this.orderForm = new FormGroup({
        productName: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        productPrice: new FormControl('',[
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[0-9]+')
        ]),
        productStatus: new FormControl('', Validators.required),
        seller: new FormControl('', Validators.required),
        archived: new FormControl(),
        buyer: new FormControl('', Validators.required),
        sellerManager: new FormControl('', Validators.required),
        buyerManager: new FormControl('', Validators.required),
        description: new FormControl(),
      });
      
    }
    if (this.sales && !authService.isAdmin) {
      this.orderForm = new FormGroup({
        productName: new FormControl('', Validators.required),
        productPrice: new FormControl('',[
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[0-9]+')
        ]),
        productStatus: new FormControl('', Validators.required),
        archived: new FormControl(),
        seller: new FormControl({ value: this.authService.user.workplace.name, disabled: true }, Validators.required),
        buyer: new FormControl('', Validators.required),
        sellerManager: new FormControl('', Validators.required),
        buyerManager: new FormControl({ disabled: true }, Validators.required),
        description: new FormControl(),
      });
    }
    if (!this.sales && !authService.isAdmin) {
      this.orderForm = new FormGroup({
        productName: new FormControl('', Validators.required),
        productPrice: new FormControl('',[
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[0-9]+')
        ]),
        productStatus: new FormControl('', Validators.required),
        archived: new FormControl(),
        seller: new FormControl('', Validators.required),
        buyer: new FormControl({ value: this.authService.user.workplace.name, disabled: true }, Validators.required),
        sellerManager: new FormControl({ disabled: true }, Validators.required),
        buyerManager: new FormControl('', Validators.required),
        description: new FormControl(),
      });
    }
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getUsers();
    this.getStatuses();
  }

  toLoad: number = 0;
  loaded: boolean = false;
  
  //Checks if all the requests has returned
  switchProgressBar(){
    this.toLoad++;
    if(this.toLoad == 3){
      this.loaded = true;
      this.loadingService.setLoading(false);
    }
  }

  getStatuses(): void {
    this.statuses = this.enumService.getStatuses();
    this.switchProgressBar();
  }

  submit(): void {
    this.add(
      this.orderForm.controls['productName'].value,
      this.orderForm.controls['productPrice'].value,
      this.orderForm.controls['productStatus'].value,
      this.orderForm.controls['archived'].value,
      this.orderForm.controls['buyer'].value,
      this.orderForm.controls['buyerManager'].value,
      this.orderForm.controls['seller'].value,
      this.orderForm.controls['sellerManager'].value,
      this.orderForm.controls['description'].value
    );
  }

  add(productName: String, productPrice: Number, productStatus: String, archived: boolean, 
    buyerName: string, buyerManagerName: string, sellerName: string, sellerManagerName: string, description: string) {
    this.orderList.addNewOrder(productName, productPrice, productStatus, archived, buyerName, buyerManagerName, sellerName, sellerManagerName, description);
    this.orderList.toggleAddOrder();
  }

  filterUsersOfBuyerCompany(companyName: string){
    this.usersOfBuyerCompany = this.users.filter(user => user.workplace.name == companyName);
    this.selectableCompanyiesForSeller = this.companies.filter(company => company.name != companyName);
  }

  filterUsersOfSellerCompany(companyName: string){
    this.usersOfSellerCompany = this.users.filter(user => user.workplace.name == companyName);
    this.selectableCompanyiesForBuyer = this.companies.filter(company => company.name != companyName);
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies;
        this.selectableCompanyiesForSeller = companies;
        this.selectableCompanyiesForBuyer = companies;
        this.switchProgressBar();
      });
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.switchProgressBar();
      });
  }
}