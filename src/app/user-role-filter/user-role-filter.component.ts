import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EnumService } from '../services/enum.service';

@Component({
  selector: 'user-role-filter',
  templateUrl: './user-role-filter.component.html',
  styleUrls: ['./user-role-filter.component.css']
})
export class UserRoleFilterComponent implements OnInit {

  @Input('role') selectedRole: string = '';
  @Input('roles') roles: string[];
  @Output() onChange = new EventEmitter<string>();

  constructor(
    public enumService: EnumService,
  ) { }

  ngOnInit(){ }

  onFilterChange(role: string): void {
    this.selectedRole = role;
    this.onChange.emit(role);
  }
}
