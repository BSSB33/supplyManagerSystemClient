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
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { mixinDisabled } from '@angular/material/core';

@Component({
  selector: 'new-order-form',
  templateUrl: './new-order-form.component.html',
  styleUrls: ['./new-order-form.component.css']
})
export class NewOrderFormComponent implements OnInit {

  order: Order;
  companies: Company[];
  sales:Boolean = this.orderService.href == "sales";
  orderForm: FormGroup;

  constructor(
    public orderList: OrderListComponent,
    private route: ActivatedRoute,
    public orderService: OrderService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    ) { 
      if(authService.user.role == "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl('', Validators.required),
          productPrice: new FormControl('', Validators.required),
          productStatus: new FormControl('', Validators.required),
          seller: new FormControl('', Validators.required),
          buyer: new FormControl('', Validators.required),
        });
        
      }
      if(this.sales && authService.user.role != "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl('', Validators.required),
          productPrice: new FormControl('', Validators.required),
          productStatus: new FormControl('', Validators.required),
          seller: new FormControl({value: this.authService.user.workplace.name, disabled: true}, Validators.required),
          buyer: new FormControl('', Validators.required),
        });
        
      }
      if(!this.sales && authService.user.role != "ROLE_ADMIN"){
        this.orderForm = new FormGroup({
          productName: new FormControl('', Validators.required),
          productPrice: new FormControl('', Validators.required),
          productStatus: new FormControl('', Validators.required),
          seller: new FormControl('', Validators.required),
          buyer: new FormControl({value: this.authService.user.workplace.name, disabled: true}, Validators.required),
        });
      }
    }

  ngOnInit(): void {
    this.getCompanies();
  }

  submit(): void {
    console.log("Form Conten: " + this.orderForm.value);
    this.add(
      this.orderForm.controls['productName'].value,
      this.orderForm.controls['productPrice'].value,
      this.orderForm.controls['productStatus'].value,
      this.orderForm.controls['buyer'].value,
      this.orderForm.controls['seller'].value
    );
  }

  add(productName: String, productPrice: Number, productStatus: String, buyerName: string, sellerName: string) {
    this.orderList.addNewOrder(productName, productPrice, productStatus, buyerName, sellerName);
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