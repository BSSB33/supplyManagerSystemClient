import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { EnumService } from '../services/enum.service';

@Component({
  selector: 'order-status-filter',
  templateUrl: './order-status-filter.component.html',
  styleUrls: ['./order-status-filter.component.css']
})
export class OrderStatusFilterComponent implements OnInit {

  @Input('status') selectedStatus: string = '';
  @Input('statuses') statuses: string[];
  @Output() onChange = new EventEmitter<string>();

  constructor(
    public enumService: EnumService,
  ) { }

  ngOnInit(){ }

  onFilterChange(status: string): void {
    this.selectedStatus = status;
    this.onChange.emit(status);
  }

}
