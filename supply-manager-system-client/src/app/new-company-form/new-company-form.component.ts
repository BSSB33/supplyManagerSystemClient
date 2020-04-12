import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { stringify } from 'querystring';
import { CompanyService } from '../services/company.service';
import { Order } from '../classes/order';
import { Company } from '../classes/company';
import { CompanyListComponent } from '../company-list/company-list.component';

@Component({
  selector: 'new-company-form',
  templateUrl: './new-company-form.component.html',
  styleUrls: ['./new-company-form.component.css']
})
export class NewCompanyFormComponent implements OnInit {

  companyForm = new FormGroup({
    companyName: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  constructor(
    public companyService: CompanyService,
    private companyList: CompanyListComponent,
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    var companyName = this.companyForm.controls['companyName'].value.trim();
    this.companyList.addNewCompany(new Company(companyName));
  }
}
