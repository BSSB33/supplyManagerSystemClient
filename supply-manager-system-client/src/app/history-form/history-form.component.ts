import { Component, OnInit } from '@angular/core';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from '../services/message.service';


@Component({
  selector: 'history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css']
})
export class HistoryFormComponent implements OnInit {

  historyTypes: String[] = ["PHONE_CALL", "EMAIL_SENT", "MADE_AN_OFFER", "DISCUSSION", "STARTED_SHIPPING", "PAID", "ORDER", "OFFER", "NOTE", "SHIPPED"];

  historyControl = new FormControl('', Validators.required);

  constructor(
    private orderDetailComponent: OrderDetailComponent,
    public messageService: MessageService,
    ) { }

  ngOnInit(): void {
  }

  add(note: string, type: string): void {
    this.orderDetailComponent.addHistoryToOrder(type, note);
    this.orderDetailComponent.toggleAddHistory();
  }

}
