import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { Company } from '../classes/company';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  @Input() company: Company;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public router: Router,
    private userService: UserService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getCompanyById();
  }

  getCompanyById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.companyService.getCompany(id)
      .subscribe(company => this.company = company);
  }

  getEmployees(): void {
    console.log(this.company);
  }

}
