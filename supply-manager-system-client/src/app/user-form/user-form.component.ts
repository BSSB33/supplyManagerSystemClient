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
        password: new FormControl(),
        userRole: new FormControl(Validators.required),
        workplace: new FormControl(Validators.required),
        directorAtWorkplace: new FormControl(Validators.required),
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

  /*toggleEnabled(){
    this.enabled = !this.enabled;
  }*/

  submit(): void {
    console.log(this.user);

    this.userService.updateUser(this.user)
    .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
