import { Component, OnInit } from '@angular/core';
import { Company } from '../classes/company';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MessageService } from '../services/message.service';
import { ForbiddenDialogComponent } from '../forbidden-dialog/forbidden-dialog.component';
import { Sort } from '@angular/material/sort';
import { LoadingService } from '../services/loading.service';
import * as $ from 'jquery';
import * as L from 'leaflet';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  companies: Company[] = [];
  filteredCompanies: Company[];
  addCompany: Boolean = false;
  term = "";
  toLoad: number = 0;
  loaded: boolean = false;
  coordinates = [];
  
  constructor(
    private companyService: CompanyService,
    public authService: AuthService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) {
    this.authService.filters = false;

   }

  ngOnInit(): void {
    this.getCompanies();
    this.term = "";
  }
  
  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies.sort((a,b) =>{return a.name > b.name ? 1 : -1})
        this.loaded = true;
        this.loadingService.setLoading(false);
        this.companyService.getMap(companies);
      });
  }

  disableOrEnableCompany(copmany: Company): void {
    this.companyService.disableOrEnableCompany(copmany).subscribe();
    copmany.active = !copmany.active;
  }

  openDisableOrEnableCompanyDialog(copmany: Company, action: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure, you want to ' + action + ' Copmany ( ' + copmany.name + ' ) ? \n All the employees will be ' + action + 'd!',
        buttonText: {
          ok: action.charAt(0).toUpperCase() + action.slice(1),
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.log("Company " + action + " dialog: Option: " + action.toUpperCase());
        this.disableOrEnableCompany(copmany);
      }
      else {
        this.log("Company " + action + " dialog: Option: CANCEL");
      }
    });
  }

  toggleAddCompany(){
    this.addCompany = !this.addCompany;
  }

  addNewCompany(company: Company): void{
    let copmanyNames = this.companies.map(comapny => comapny.name);
    if(!copmanyNames.includes(company.name))
    {
      this.companyService.addCompany(company)
      .subscribe(company => {
        this.companies.push(company);
      });
      this.toggleAddCompany();
    }
    else
    {
      this.dialog.open(ForbiddenDialogComponent,{
        data:{
          message: 'Company Already Exists!',
          buttonText: {
            cancel: 'OK'
          }
        },
      });
    }
  }

  sortData(sort: Sort) {
    const data = this.companies.slice();
    if (!sort.active || sort.direction === '') {
      this.companies = data;
      return;
    }

    this.companies = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'address': return this.compare(a.address, b.address, isAsc);
        case 'taxNumber': return this.compare(a.taxNumber, b.taxNumber, isAsc);
        case 'bankAccountNumber': return this.compare(a.bankAccountNumber, b.bankAccountNumber, isAsc);
        case 'status': return this.compare(a.name, b.name, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  closeFilter(){
    this.authService.toggleFilters();
    this.term = "";
  }

  private log(message: string) {
    this.messageService.add(`CompanyList: ${message}`);
  }


}
