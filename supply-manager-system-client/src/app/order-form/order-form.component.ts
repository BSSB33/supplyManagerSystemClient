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
  companies: Company[];
  managers: User[];

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
    //this.getCompanyOfUser();
    
    //this.companiesToChooseFrom = this.companies.filter(obj => obj !== this.companyOfUser);
    //console.log(this.companiesToChooseFrom);
    //this.managers.push(new User());
  }

  getCompanies(): void{
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }
  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => this.order = order);
  }

  getManagersOfUser(): void{
    this.userService.getUsers()
        .subscribe(managers => this.managers = managers);
  }
    
  submit(): void {
    if(this.authService.user.role == "ROLE_ADMIN"){
      var buyerManagerName = this.orderForm.controls['buyerManager'].value;
      var sellerManagerName = this.orderForm.controls['sellerManager'].value;
      this.order.buyerManager = this.managers.find(user => user.username == buyerManagerName);
      this.order.sellerManager = this.managers.find(user => user.username == sellerManagerName);
      //TODO compnies
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

  goBack(): void {
    this.location.back();
  }

}
