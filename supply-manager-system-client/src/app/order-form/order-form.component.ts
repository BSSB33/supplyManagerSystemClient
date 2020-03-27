import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  @Input() order: Order;

  constructor(    
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrderById();
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(order => this.order = order);
  }

    
  save(): void {
    this.orderService.updateOrder(this.order)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

}
