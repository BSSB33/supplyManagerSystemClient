import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.css']
})
export class HelperComponent implements OnInit {

  @Input('role') role: string;
  @Input('url') url: string;

  constructor() { }

  ngOnInit(): void {
    //console.log("Role: " + this.role);
    //console.log("URL: " + this.url);
  }

}
