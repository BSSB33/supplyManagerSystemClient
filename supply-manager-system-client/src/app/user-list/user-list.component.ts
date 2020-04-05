import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MessageService } from '../services/message.service';
import { ForbiddenDialogComponent } from '../forbidden-dialog/forbidden-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private messageService: MessageService,
    private dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
        //this.users.sort(function(a, b) { return - (a.id - b.id); });
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.userService.deleteUser(user).subscribe();
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

  openDeleteUserDialog(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data:{
        message: 'User Deletion is not Recommended! All the Orders, Histories, Companies will be deleted upon the deletion of the User!',
        buttonText: {
          ok: 'DELETE',
          cancel: 'Cancel'
        }
      }
    });
    
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.log("User Deletation dialog: Option: DELETE anyway");
        this.deleteUser(user);
        //TODO implement delete cascade in backend! - if breaks remove function
      }
      else {
        this.log("User Deletation dialog: Option: CANCEL deletion");
      }
    });
  }
  
  private log(message: string) {
    this.messageService.add(`OrderList: ${message}`);
  }
}
