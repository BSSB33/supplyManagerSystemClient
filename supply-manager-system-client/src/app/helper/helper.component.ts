import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { EnumService } from '../services/enum.service';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent implements OnInit {

  @Input('role') role: string;
  @Input('url') url: string;

  constructor(
    public authService: AuthService,
    public enumService: EnumService,
  ) { }

  ngOnInit(): void {
    //console.log("Role: " + this.role);
    //console.log("URL: " + this.url);
  }

}
