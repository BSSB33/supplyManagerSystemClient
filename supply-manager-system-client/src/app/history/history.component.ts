import { Component, OnInit,Input } from '@angular/core';
import { History } from '../classes/history';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @Input() history: History;
  
  constructor(
    private orderDetailComponent: OrderDetailComponent,
    public messageService: MessageService,
    ) { }

  deleteHistory(history: History){
    this.orderDetailComponent.deleteHistory(history);
  }

  ngOnInit(): void {
  }

}
