import { Component, OnInit } from '@angular/core';
import { Company } from '../classes/company';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MessageService } from '../services/message.service';


@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  companies: Company[] = [];

  constructor(
    private companyService: CompanyService,
    public authService: AuthService,
    private messageService: MessageService,
    private dialog: MatDialog,
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
  
  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }
}
