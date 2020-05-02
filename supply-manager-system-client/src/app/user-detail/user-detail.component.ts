import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { EnumService } from '../services/enum.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;
  loaded: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public router: Router,
    private userService: UserService,
    public enumService: EnumService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.userService.getUser(id)
      .subscribe(user => {
        this.user = user
        this.loaded = true;
        this.loadingService.setLoading(false);
      });
  }

}
