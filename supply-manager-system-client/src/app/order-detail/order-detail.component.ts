import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../services/order.service';
import { HistoryService } from '../services/history.service';
import { UserService } from '../services/user.service';
import { Order } from '../classes/order';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { History } from '../classes/history';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() order: Order;
  histories: History[];
  addHistory: Boolean;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private historyService: HistoryService,
    private location: Location,
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getOrderById();
    this.getHistoriesOfOrder(+this.route.snapshot.paramMap.get('id'));
    this.setUpNewHistory();
  }

  toggleAddHistory(): void{
    this.addHistory = !this.addHistory;
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

  private _creator: User;
  private _order: Order;
  setUpNewHistory(): void{
    this._creator = this.authService.user;
  
    this.orderService.getOrder(+this.route.snapshot.paramMap.get('id'))
    .subscribe(order => this._order = order );
  }

  addHistoryToOrder(historyType: string, note: string): void {
    note = note.trim();
    historyType = historyType.trim();

    var history : History = new History(this._creator, this._order, historyType, note);

    this.historyService.addHistory(history)
      .subscribe(history => {
        this.histories.unshift(history);
      });
  }
    
  goBack(): void {
    this.location.back();
  }

}
