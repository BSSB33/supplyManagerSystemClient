import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { Company } from '../classes/company';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

@Input() company: Company;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public companyService: CompanyService,
  ){ }

  ngOnInit(): void {
    this.getCompanyById();
   }

  getCompanyById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.companyService.getCompany(id)
      .subscribe(company => this.company = company);
  }


  save(): void {
    this.companyService.updateCompany(this.company)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
  
}
