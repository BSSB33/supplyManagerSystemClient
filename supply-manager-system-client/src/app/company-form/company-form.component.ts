import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { Company } from '../classes/company';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

companyForm: FormGroup;
@Input() company: Company;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public companyService: CompanyService,
    private authService: AuthService,
  ){ 
    if (this.authService.user.role != "ROLE_MANAGER") {
      this.companyForm = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          
        ]),
        address: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
        ]),
        taxNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern("[0-9-]{10,20}$")
        ]),
        bankAccountNumber: new FormControl('', [
          Validators.required,
          Validators.minLength(12)
        ]),
      })
    }
  }

  ngOnInit(): void {
    this.getCompanyById();
   }

  getCompanyById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.companyService.getCompany(id)
      .subscribe(company => this.company = company);
  }


  submit(): void {
    this.companyService.updateCompany(this.company)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
  
}
