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
  usersOfSellerCompany: User[];
  usersOfBuyerCompany: User[];
  selectedBuyerCompany: Company;
  selectedSellerCompany: Company;

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
      if(this.sales && this.authService.user.role != "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl(Validators.required),
          status: new FormControl(Validators.required),
          sellerManager: new FormControl(Validators.required),
        });
      }
      //purchases
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
        //TODO mikor kéne filterelni? Most csak kattintás után szűri a listát!
        //this.filterUsersOfBuyerCompany(order.buyer.name);
        //this.filterUsersOfSellerCompany(order.seller.name);
      });
  }

  getManagersOfUser(): void{
    this.userService.getUsers()
        .subscribe(managers => {
          this.managers = managers
          this.usersOfSellerCompany = managers;
          this.usersOfBuyerCompany = managers;
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
    this.usersOfBuyerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  filterUsersOfSellerCompany(companyName: string){
    this.usersOfSellerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  goBack(): void {
    this.location.back();
  }

}
