import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { Company } from '../classes/company';
import { User } from '../classes/user';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, FormsModule, FormControlName, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  @Input() order: Order;
  sales: Boolean = this.orderService.href == "sales";
  public companies: Company[];
  managers: User[];
  usersOfBuyerCompany: User[];
  usersOfSellerCompany: User[];
  selectedBuyerCompany: Company;
  selectedSellerCompany: Company;

  selectableCompanyiesForBuyer: Company[];
  selectableCompanyiesForSeller: Company[];

  orderForm: FormGroup;

  constructor(    
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    ) 
    { 
      //Admin page
      if(this.authService.user.role == "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl(Validators.required),
          status: new FormControl(Validators.required),
          seller: new FormControl(Validators.required),
          buyer: new FormControl(Validators.required),
          sellerManager: new FormControl(Validators.required),
          buyerManager: new FormControl(Validators.required),
        });
      }
      //Sales page
      if(this.sales && this.authService.user.role != "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl(Validators.required),
          status: new FormControl(Validators.required),
          sellerManager: new FormControl(Validators.required),
        });
      }
      //Purchase pages
      if(!this.sales && this.authService.user.role != "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl(Validators.required),
          status: new FormControl(Validators.required),
          buyerManager: new FormControl(Validators.required),
        });
      }
    }

  ngOnInit(): void {
    this.getOrderById();
    this.getManagersOfUser();
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => this.companies = companies);
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => {
        this.order = order
        //Issue: Due to the asyncron query, company is sometimes undefined when needed here.
        this.filterUsersOfBuyerCompany(order.buyer.name)
        this.filterUsersOfSellerCompany(order.seller.name)
      });
  }

  getManagersOfUser(): void{
    this.userService.getUsers()
      .subscribe(managers => {
        this.managers = managers
        this.usersOfSellerCompany = managers;//.filter(user => user.workplace.id == this.order.seller.id);
        this.usersOfBuyerCompany = managers;//.filter(user => user.workplace.id == this.order.buyer.id);;
      });
  }

  submit(): void {
    if(this.authService.user.role == "ROLE_ADMIN"){
      var buyerManagerName = this.orderForm.controls['buyerManager'].value;
      var sellerManagerName = this.orderForm.controls['sellerManager'].value;
      var buyerName = this.orderForm.controls['buyer'].value;
      var sellerName = this.orderForm.controls['seller'].value;
      this.order.buyerManager = this.managers.find(user => user.username == buyerManagerName);
      this.order.sellerManager = this.managers.find(user => user.username == sellerManagerName);
      this.order.buyer = this.companies.find(copmany => copmany.name == buyerName);
      this.order.seller = this.companies.find(copmany => copmany.name == sellerName);
    }
    if(this.sales && this.authService.user.role != "ROLE_ADMIN"){
      var sellerManagerName = this.orderForm.controls['sellerManager'].value;
      this.order.sellerManager = this.managers.find(user => user.username == sellerManagerName);
    }
    if(!this.sales && this.authService.user.role != "ROLE_ADMIN"){
      var buyerManagerName = this.orderForm.controls['buyerManager'].value;
      this.order.buyerManager = this.managers.find(user => user.username == buyerManagerName);
    }
    
    this.orderService.updateOrder(this.order)
    .subscribe(() => this.goBack());
  }

  filterUsersOfBuyerCompany(companyName: string){
    this.selectedBuyerCompany = this.companies.find(company => company.name == companyName);
    this.selectableCompanyiesForSeller = this.companies.filter(company => company.name != companyName);

    this.usersOfBuyerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  filterUsersOfSellerCompany(companyName: string){
    this.selectedSellerCompany = this.companies.find(company => company.name == companyName);
    this.selectableCompanyiesForBuyer = this.companies.filter(company => company.name != companyName);

    this.usersOfSellerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  goBack(): void {
    this.location.back();
  }

}
