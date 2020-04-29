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
import { MessageService } from '../services/message.service';
import { EnumService } from '../services/enum.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() order: Order;
  histories: History[];
  addHistory: Boolean;
  toLoad: number = 0;
  loaded: boolean = false;
  
  //Checks if all the requests has returned
  switchProgressBar(){
    this.toLoad++;
    if(this.toLoad == 3){
      this.loaded = true;
      this.loadingService.setLoading(false);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public enumService: EnumService,
    private historyService: HistoryService,
    private location: Location,
    public router: Router,
    private authService: AuthService,
    public loadingService: LoadingService,
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
      .subscribe(order => {
        this.order = order;
        this.switchProgressBar();
      });
  }
  
  deleteHistory(history: History): void {
    this.histories = this.histories.filter(h => h !== history);
    this.historyService.deleteHistory(history).subscribe();
  }

  getHistoriesOfOrder(id: number): void {
    this.orderService.getHistoriesOfOrder(id)
        .subscribe(histories => {
          this.histories = histories.sort((a,b) =>{return a.createdAt < b.createdAt ? 1 : -1})
          this.switchProgressBar();
        });
  }

  private _creator: User;
  private _order: Order;
  setUpNewHistory(): void{
    this._creator = this.authService.user;
  
    this.orderService.getOrder(+this.route.snapshot.paramMap.get('id'))
    .subscribe(order => {
      this._order = order;
      this.switchProgressBar();
    });
  }

  addHistoryToOrder(historyType: string, note: string): void {
    note = note.trim();

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
