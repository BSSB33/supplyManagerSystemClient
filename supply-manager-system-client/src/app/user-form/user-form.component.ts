import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { Location } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company } from '../classes/company';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() user: User;
  companies: Company[];
  hidePassword: boolean = true;
  userForm: FormGroup;
  selectedRole: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
  ) {
    if(this.authService.user.role == "ROLE_ADMIN"){
      this.userForm = new FormGroup({
        username: new FormControl(Validators.required),
        userStatus: new FormControl(Validators.required), //TODO check save
        newPassword: new FormControl(),
        userRole: new FormControl(Validators.required),
        workplace: new FormControl(Validators.required),
      });
    }
  }

  ngOnInit(): void {
    this.getUserById();
    this.getCompanies();
  }

  
  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => this.companies = companies);
  }

  getUserById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user
      });
  }

  setSelectedRole(selectedRole: string){
    this.selectedRole = selectedRole;
  }

  submit(): void {
    if(this.selectedRole == null){
      this.selectedRole = this.user.role;
    }
    console.log(this.user);
    if(this.authService.user.role == "ROLE_ADMIN"){

      if(this.selectedRole == 'ROLE_DIRECTOR' || this.selectedRole == 'ROLE_ADMIN'){
        this.user.workplace = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
        this.user.company = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
      }
      else {
        this.user.workplace = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
        this.user.company = null;
      }
      this.user.role = this.userForm.controls['userRole'].value;
    }
    if(this.userForm.controls['newPassword'].value == null) {
      this.user.password = null;
    }
    else this.user.password = this.userForm.controls['newPassword'].value;
    
    this.userService.updateUser(this.user)
    .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
