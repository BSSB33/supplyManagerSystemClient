import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(
    private userService: UserService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users);
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.userService.deleteUser(user).subscribe();
  }

  disableOrEnableUser(user: User){
    this.userService.disableOrEnableUser(user).subscribe();
    user.enabled = !user.enabled;
  }
}
