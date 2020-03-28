import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { Company } from '../classes/company';
import { NgForm } from '@angular/forms';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  @Input() order: Order;

  companies: Company[];
  companyOfUser: Company;
  companiesToChooseFrom: Company[];

  constructor(    
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private companyService: CompanyService) { 
    }

  ngOnInit(): void {
    this.getOrderById();
    this.getCompanies();
    this.getCompenyOfUser();   
    //this.companiesToChooseFrom = this.companies.filter(obj => obj !== this.companyOfUser);
    //console.log(this.companiesToChooseFrom);
  }

  getCompanies(): void{
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }

  getCompenyOfUser(): void{
    this.companyService.getCompanyOfUser()
        .subscribe(company => this.companyOfUser = company);
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => this.order = order);
  }
    
  save(): void {
    this.orderService.updateOrder(this.order)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
