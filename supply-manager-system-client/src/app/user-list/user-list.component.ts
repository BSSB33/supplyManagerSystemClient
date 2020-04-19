import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MessageService } from '../services/message.service';
import { ForbiddenDialogComponent } from '../forbidden-dialog/forbidden-dialog.component';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../classes/company';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  addUser: boolean;
  companies: Company[];

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private messageService: MessageService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
  }

  getCompanies(): void {
    this.companyService.getCompanies()
        .subscribe(companies => this.companies = companies);
  }

  disableOrEnableUser(user: User){
    this.userService.disableOrEnableUser(user).subscribe();
    user.enabled = !user.enabled;
  }

  openDisableUserDialog(user: User, action: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'Are you sure, you want to ' + action + ' User: ( ' + user.username + ' ) ?',
        buttonText: {
          ok: action.charAt(0).toUpperCase() + action.slice(1),
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.log("User " + action + " dialog: Option: " + action.toUpperCase());
        this.disableOrEnableUser(user);
      }
      else {
        this.log("User " + action + " dialog: Option: CANCEL");
      }
    });
  }

  registerUser(newUser: User){
    this.userService.registerUser(newUser)
      .subscribe(user => 
        this.users.push(user))
  }

  toggleAddUser(): void{
    this.addUser = !this.addUser;
    if(this.addUser){
      this.getCompanies();
    }
  }
  
  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }
}
