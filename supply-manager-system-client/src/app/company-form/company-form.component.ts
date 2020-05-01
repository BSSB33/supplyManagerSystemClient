import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { Company } from '../classes/company';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

companyForm: FormGroup;
@Input() company: Company;
toLoad: number = 0;
loaded: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public companyService: CompanyService,
    public authService: AuthService,
    private loadingService: LoadingService,
  ){ 
    if (!this.authService.isManager) {
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
      .subscribe(company => {
        this.company = company;
        this.loaded = true;
        this.loadingService.setLoading(false);
      });
  }


  submit(): void {
    this.companyService.updateCompany(this.company)
      .subscribe(() => this.goBack());
  }
  
  path: string = "/";
  goBack(): void {
    this.location.back();
  }

}
