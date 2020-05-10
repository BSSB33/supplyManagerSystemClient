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
    companyName: new FormControl('', [
      Validators.required, 
      Validators.minLength(4)
    ]),
    address: new FormControl('', [
      Validators.required, 
      Validators.minLength(4)
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
  });
  constructor(
    public companyService: CompanyService,
    private companyList: CompanyListComponent,
  ) { }

  ngOnInit(): void {
  }


  async submit(): Promise<void> {
    let lat: string;
    let lon: string;
    await $.get(location.protocol + '//nominatim.openstreetmap.org/search?format=json&q='+ this.companyForm.controls['address'].value, function(data){
      if(data != null && data[0] != undefined){ // && data.latlog != null
        console.log("New company at: " + data[0].lat + ", " + data[0].lon)
        lat = data[0].lat;
        lon = data[0].lon;
      }
      else{
        console.log("Not recognised Address");
        lat = "0";
        lon = "0";
      }
    })
    
    this.companyList.addNewCompany(
      new Company(
        this.companyForm.controls['companyName'].value.trim(), 
        true, 
        this.companyForm.controls['address'].value,
        this.companyForm.controls['taxNumber'].value,
        this.companyForm.controls['bankAccountNumber'].value,
        lat, lon
        )
      );

      this.companyService.getCompanies().subscribe(companies => this.companyService.getMap(companies));
    }
}
