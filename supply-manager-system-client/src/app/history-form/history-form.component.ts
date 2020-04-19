import { Component, OnInit } from '@angular/core';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css']
})
export class HistoryFormComponent implements OnInit {

  historyControl = new FormControl('', Validators.required);

  constructor(private orderDetailComponent : OrderDetailComponent) { }

  ngOnInit(): void {
  }

  add(note: string, type: string): void{
    if(note == ""){
      note = null;
    }
    this.orderDetailComponent.addHistoryToOrder(note, type);
    this.orderDetailComponent.toggleAddHistory();
  }

}
