import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../services/order.service';
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
    private location: Location,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getOrderById();
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => this.order = order);
    this.getHistoriesOfOrder(id);
  }

  
  getHistoriesOfOrder(id: number): void {
    this.orderService.getHistoriesOfOrder(id)
        .subscribe(histories => this.histories = histories);
  }
    
  goBack(): void {
    this.location.back();
  }

}
