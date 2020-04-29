import { Injectable, Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
@Injectable()
export class ForbiddenComponent implements OnInit {

  path: string = "/";

  goBack(): void {
    this.location.back();
  }

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }
}
