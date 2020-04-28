import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { Location } from '@angular/common';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Company } from '../classes/company';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() user: User;
  companies: Company[];
  hidePassword: boolean = true;
  originalUsername: string;
  userForm: FormGroup;
  selectedRole: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) {
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
      userStatus: new FormControl(),
      newPassword: new FormControl('', [
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}'),
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d$@$!%*?&].{8,}'),
        UserFormComponent.matchValues('newPassword')
      ]),
      userRole: new FormControl(Validators.required),
      workplace: new FormControl(Validators.required),
    });
  }

  ngOnInit(): void {
    this.getUserById();
    this.getCompanies();
  }

  public static matchValues( toMatch: string ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.parent != undefined && control.parent.controls[toMatch] != undefined){
        return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[toMatch].value
        ? null
        : { isMatching: false };
      }
    };
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
  
  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies
        this.switchProgressBar();
      });
  }

  getUserById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user;
        this.originalUsername = user.username;
        this.switchProgressBar();
      });
  }

  setSelectedRole(selectedRole: string){
    this.selectedRole = selectedRole;
  }

  submit(): void {
    //Init selected role variable
    if(this.selectedRole == null){
      this.selectedRole = this.user.role;
    }
    if(this.authService.user.role == "ROLE_ADMIN"){
      //Setting workplace and company for each user upon modification
      if(this.selectedRole == 'ROLE_DIRECTOR' || this.selectedRole == 'ROLE_ADMIN'){
        this.user.workplace = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
        this.user.company = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
        if(this.selectedRole == 'ROLE_ADMIN' && this.user.id == this.authService.user.id){
          this.user.role = 'ROLE_ADMIN';
        }
        else{
          this.user.role = this.userForm.controls['userRole'].value;
        }
      }
      else {
        this.user.workplace = this.companies.find(company => company.name == this.userForm.controls['workplace'].value);
        this.user.company = null;
      }
      
    }
    else if(this.authService.user.role == "ROLE_DIRECTOR" && this.user.role == 'ROLE_DIRECTOR'){
      this.user.role = 'ROLE_DIRECTOR';
    }
    else if(this.authService.user.role == "ROLE_DIRECTOR" && this.user.role == 'ROLE_MANAGER'){
      this.user.role = 'ROLE_MANAGER';
    }

    //Setting password or leaving it empty in case of not modifying the password
    if(this.userForm.controls['newPassword'].value == "") {
      this.user.password = null;
    }
    else this.user.password = this.userForm.controls['newPassword'].value;

    //Warns user and asks for confirmation if profile is modified
    if( this.user.id == this.authService.user.id){ // && (this.user.password != null || this.userForm.controls['username'].value != this.originalUsername)
      const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
        data:{
          message: 'WARNING! Upon modifying your Profile, you will be singned out! - Are you sure?',
          buttonText: {
            ok: 'Yes',
            cancel: 'No'
          }
        }
      });
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userService.updateUser(this.user)
          .subscribe(() => this.goBack());
          this.authService.logout();
          localStorage.setItem('loginMessage', 'Please log in with you new creditensials!');
        }
        else return;
      });
    }
    else{
      this.userService.updateUser(this.user)
      .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }

}
