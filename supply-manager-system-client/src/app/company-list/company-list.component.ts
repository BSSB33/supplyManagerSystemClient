import { Component, OnInit } from '@angular/core';
import { Company } from '../classes/company';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  companies: Company[] = [];

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void {
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }

  deleteCompanies(company: Company): void {
    this.companies = this.companies.filter(u => u !== company);
    this.companyService.deleteCompany(company).subscribe();
  }

  disableOrEnableCompany(copmany: Company): void {
    this.companyService.disableOrEnableCompany(copmany).subscribe();
    copmany.active = !copmany.active;
  }
}
