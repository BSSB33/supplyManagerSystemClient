import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
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
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^(?! *$)[a-zA-Z0-9 ]+")
        ]),
        fullName: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^(?! *$)[a-zA-Z ]+")
        ]),
        email: new FormControl('', [
          Validators.required, 
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}'),
          NewUserFormComponent.matchValues('password'),
        ]),
        userStatus: new FormControl('', Validators.required),
        workplace: new FormControl('', Validators.required),
        userRole: new FormControl('', Validators.required),
      });
    }
    if (this.authService.user.role == "ROLE_DIRECTOR") {
      this.userForm = new FormGroup({
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^(?! *$)[a-zA-Z0-9 ]+")
        ]),
        fullName: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^(?! *$)[a-zA-Z ]+")
        ]),
        email: new FormControl('', [
          Validators.required, 
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
        ]),
        password: new FormControl('', [
          Validators.required, 
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}')
        ]),
        password_confirmation: new FormControl('', [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}'),
          NewUserFormComponent.matchValues('password'),
        ]),
        userStatus: new FormControl('', Validators.required),
      });
    }
  }

  public static matchValues( toMatch: string ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[toMatch].value
        ? null
        : { isMatching: false };
    };
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

    //hashin password to protect information
    const salt = bcrypt.genSaltSync(10);
    let hashedPw = bcrypt.hashSync(this.userForm.controls['password'].value, salt);

    var newUser: User  = new User(
      this.userForm.controls['username'].value,
      this.userForm.controls['fullName'].value,
      this.userForm.controls['email'].value,
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
