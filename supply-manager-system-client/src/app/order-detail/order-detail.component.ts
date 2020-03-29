import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../services/order.service';
import { HistoryService } from '../services/history.service';
import { Order } from '../classes/order';
import { Router } from '@angular/router';
import { History } from '../classes/history';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() order: Order;
  histories: History[];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private historyService: HistoryService,
    private location: Location,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getOrderById();
    this.getHistoriesOfOrder(+this.route.snapshot.paramMap.get('id'));
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => this.order = order);
    
  }

  deleteHistory(history: History): void {
    this.histories = this.histories.filter(h => h !== history);
    this.historyService.deleteHistory(history).subscribe();
  }
  
  getHistoriesOfOrder(id: number): void {
    this.orderService.getHistoriesOfOrder(id)
        .subscribe(histories => this.histories = histories);
  }
    
  goBack(): void {
    this.location.back();
  }

}
