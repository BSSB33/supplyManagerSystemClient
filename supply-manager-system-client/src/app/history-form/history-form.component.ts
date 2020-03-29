import { Component, OnInit } from '@angular/core';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css']
})
export class HistoryFormComponent implements OnInit {

  constructor(private orderDetailComponent : OrderDetailComponent) { }

  ngOnInit(): void {
  }

  add(note: string, type: string): void{
    this.orderDetailComponent.addHistoryToOrder(note, type);
    this.orderDetailComponent.toggleAddHistory();
  }

}
