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
import { EnumService } from '../services/enum.service';
import { LoadingService } from '../services/loading.service';

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
    public messageService: MessageService,
    public enumService: EnumService,
    private companyService: CompanyService,
    private dialog: MatDialog,
    public router: Router,
    private loadingService: LoadingService,
  ) { 
    this.authService.filters = false;
  }

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
  
  toLoad: number = 0;
  loaded: boolean = false;
  
  //Checks if all the requests has returned
  switchProgressBar(){
    this.toLoad++;
    if(this.toLoad == 2){
      this.loaded = true;
      this.loadingService.setLoading(false);
    }
  }
 
  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users.sort((a,b) =>{return a.username > b.username ? 1 : -1});
        this.filteredUsers = users.sort((a,b) =>{return a.username > b.username ? 1 : -1});;
        this.setRoleOptions(users);
        this.switchProgressBar();
      }
    );
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies.sort((a,b) =>{return a.name > b.name ? 1 : -1});
        this.switchProgressBar();
      });
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
    let userNames = this.users.map(user => user.username);
    if(!userNames.includes(newUser.username))
    {
      this.userService.registerUser(newUser)
      .subscribe(user => {
        this.users.push(user);
        this.setRoleOptions(this.users);
        this.filter();
      })
    }
    else
    {
      this.dialog.open(ForbiddenDialogComponent,{
        data:{
          message: 'Username Already Taken!',
          buttonText: {
            cancel: 'OK'
          }
        },
      });
    }
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
    ? this.users.sort((a,b) =>{return a.username > b.username ? 1 : -1})
    : this.users.filter(user => user.role == this.selectedRole).sort((a,b) =>{return a.username > b.username ? 1 : -1});
  }

  onCompanyFilterChange(companyId: number){
    this.selectedCompanyId = companyId;
  }

  closeFilter(){
    this.authService.toggleFilters();
    this.selectedRole = "";
    this.selectedCompanyId = null;
    this.term = "";
    this.filter();
  }
  
  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }
}
