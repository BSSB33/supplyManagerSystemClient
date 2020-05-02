import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { Company } from '../classes/company';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';
import { LoadingService } from '../services/loading.service';
import { EnumService } from '../services/enum.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  @Input() company: Company;
  users: User[];
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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public router: Router,
    private userService: UserService,
    public authService: AuthService,
    private companyService: CompanyService,
    private loadingService: LoadingService,
    public enumService: EnumService,
  ) { }

  ngOnInit(): void {
    this.getCompanyById();
    this.getUsers();
  }

  getCompanyById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.companyService.getCompany(id)
      .subscribe(company => {
        this.company = company
      });
    this.switchProgressBar();
  }

  userCount: number = 0;
  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.switchProgressBar();
      });
  }

  
}
