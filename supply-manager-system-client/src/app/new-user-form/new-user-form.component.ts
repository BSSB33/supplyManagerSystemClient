import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CompanyService } from '../services/company.service';
import { User } from '../classes/user';
import { Company } from '../classes/company';
import { UserListComponent } from '../user-list/user-list.component';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.css']
})
export class NewUserFormComponent implements OnInit {
  
  userForm: FormGroup;
  hidePassword: boolean = true;
  companies: Company[];
  setUserAsDirector: boolean = false;
  selectedRole: string;

  ngOnInit(): void {
  }

  constructor(
    private companyService: CompanyService,
    public authService: AuthService,
    public userList: UserListComponent,
  ) {
    if (this.authService.user.role == "ROLE_ADMIN") {
      this.userForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        //password_confirmation: new FormControl('', Validators.required),
        userStatus: new FormControl('', Validators.required),
        workplace: new FormControl('', Validators.required),
        userRole: new FormControl('', Validators.required),
      });
    }
    if (this.authService.user.role == "ROLE_DIRECTOR") {
      this.userForm = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        userStatus: new FormControl('', Validators.required),
      });
    }
  }

  setSelectedRole(selectedRole: string){
    this.selectedRole = selectedRole;
  }

  submit(): void {
    var workplace: Company, company: Company, role: string;
    if(this.authService.user.role == "ROLE_ADMIN"){
      if(this.selectedRole == 'ROLE_DIRECTOR' || this.selectedRole == 'ROLE_ADMIN'){
        company = this.userList.companies.find(company => company.name == this.userForm.controls['workplace'].value);
      }
      else company = null;
      workplace = this.userList.companies.find(company => company.name == this.userForm.controls['workplace'].value);
      role = this.userForm.controls['userRole'].value;
      
    }
    if(this.authService.user.role == "ROLE_DIRECTOR"){
      var workplace = this.authService.user.company;
      role = 'ROLE_MANAGER';
      company = null;
    }

    const salt = bcrypt.genSaltSync(10);
    let hashedPw = bcrypt.hashSync(this.userForm.controls['password'].value, salt);
    var newUser: User  = new User(
      this.userForm.controls['username'].value,
      hashedPw,
      this.userForm.controls['userStatus'].value,
      company,
      workplace,
      role,
    );
    this.userList.registerUser(newUser);
    this.userList.toggleAddUser();
  }
}
