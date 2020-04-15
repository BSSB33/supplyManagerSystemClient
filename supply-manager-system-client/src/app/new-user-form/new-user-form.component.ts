import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CompanyService } from '../services/company.service';
import { User } from '../classes/user';
import { Company } from '../classes/company';
import { stringify } from 'querystring';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {
  
  userForm: FormGroup;
  hidePassword: boolean = true;
  companies: Company[];

  ngOnInit(): void {
  }

  constructor(
    private companyService: CompanyService,
    public authService: AuthService,
    public userList: UserListComponent,
  ) {
    if (authService.user.role == "ROLE_ADMIN") {
      this.userForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        userStatus: new FormControl('', Validators.required),
        //company: new FormControl('', Validators.required),
        workplace: new FormControl('', Validators.required),
        userRole: new FormControl('', Validators.required),
      });
    }
  }

  submit(): void {
    console.log("Form Conten: " + this.userForm.value);
    var workplace = this.userList.companies.find(company => company.name == this.userForm.controls['workplace'].value);
    var newUser: User  = new User(
      this.userForm.controls['username'].value,
      this.userForm.controls['password'].value,
      this.userForm.controls['userStatus'].value,
      null,
      workplace,
      this.userForm.controls['userRole'].value,
    );
    this.userList.registerUser(newUser);
    console.log(this.companies);
    this.userList.toggleAddUser();
  }
}
