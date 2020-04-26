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
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  addUser: boolean;
  companies: Company[];
  selectedRole: string = '';
  filteredUsers: User[];
  selectedCompanyId: number;
  term: string = "";
  roles: Set<String> = new Set();

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
    this.getCompanies();
    this.filter();
  }

  setRoleOptions(users: User[]){
    var roles: Set<String> = new Set();
    users.forEach(user => {
      roles.add(user.role);
    })
    this.roles = roles;
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
        this.setRoleOptions(users);
      }
    );
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
      .subscribe(user => {
        this.users.push(user);
        this.setRoleOptions(this.users);
        this.filter();
      })
  }

  toggleAddUser(): void{
    this.addUser = !this.addUser;
    if(this.addUser){
      this.getCompanies();
    }
  }
  
  onFilterChange(role: string): void {
    this.selectedRole = role;
    this.filter();
  }

  private filter(): void {
    this.filteredUsers = this.selectedRole == ''
    ? this.users
    : this.users.filter(user => user.role == this.selectedRole);
  }

  sortData(sort: Sort) {
    const data = this.filteredUsers.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredUsers = data;
      return;
    }

    this.filteredUsers = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'username': return this.compare(a.username, b.username, isAsc);
        case 'status': return this.compare(a.enabled, b.enabled, isAsc);
        case 'company': return this.compareCompany(a.company, b.company, isAsc);
        case 'workplace': return this.compareCompany(a.workplace, b.workplace, isAsc);
        case 'role': return this.compare(a.role, b.role, isAsc);
        default: return 0;
      }
    });
  }

  compare(a: number | string | boolean, b: number | string | boolean, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareCompany(a: Company, b: Company, isAsc: boolean) {
    if (a === b) {
      return 0;
    }
    else if(a === null){
      return 1;
    }
    else if(b === null){
      return 1;
    }
    else return (a.name < b.name ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onCompanyFilterChange(companyId: number){
    this.selectedCompanyId = companyId;
  }
  
  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }
}
