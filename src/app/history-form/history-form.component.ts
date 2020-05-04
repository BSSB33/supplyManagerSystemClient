import { Component, OnInit } from '@angular/core';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { FormControl, Validators } from '@angular/forms';
import { EnumService } from '../services/enum.service';


@Component({
  selector: 'history-form',
  templateUrl: './history-form.component.html',
  styleUrls: ['./history-form.component.css']
})
export class HistoryFormComponent implements OnInit {

  historyTypes: String[];

  historyControl = new FormControl('', Validators.required);

  constructor(
    private orderDetailComponent: OrderDetailComponent,
    public enumService: EnumService,
    ) { }

  ngOnInit(): void {
    this.getHistoryTypes();
  }

  getHistoryTypes(): void {
    this.historyTypes = this.enumService.getHistoryTypes();
  }

  add(note: string, type: string): void {
    this.orderDetailComponent.addHistoryToOrder(type, note);
    this.orderDetailComponent.toggleAddHistory();
  }
  

}
