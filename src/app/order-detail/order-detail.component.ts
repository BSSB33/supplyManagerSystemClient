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
import { FormGroup, FormControl } from '@angular/forms';
import { OrderFormComponent } from '../order-form/order-form.component';

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
  editStatus: boolean = false;
  statuses: String[];
  originalStatus: String;
  statusForm: FormGroup;
  
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
  ) { 
    this.statusForm = new FormGroup({
      status: new FormControl()
    })
  }

  ngOnInit(): void {
    this.getOrderById();
    this.getHistoriesOfOrder(+this.route.snapshot.paramMap.get('id'));
    this.setUpNewHistory();
    this.getStatuses();
  }

  toggleAddHistory(): void{
    this.addHistory = !this.addHistory;
  }

  modifyStatus(){
    this.editStatus = !this.editStatus;
  }

  updateStatus(){
    this.orderService.updateOrder(this.order)
    .subscribe();
    this.modifyStatus();

    this.addHistorySystemMessage("Status was modified from \"" + this.enumService.getStatusString(this.originalStatus) + "\" to \"" + this.enumService.getStatusString(this.statusForm.controls['status'].value) + "\"", "STATUS_MODIFIED");
  }

  getStatuses(): void {
    this.statuses = this.enumService.getStatuses();
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .then(order => {
        this.order = order;
        this.originalStatus = this.order.status;
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
          this.histories = histories.sort((a,b) =>{return a.createdAt < b.createdAt ? 1 : -1});
          this.switchProgressBar();
        });
  }

  private _creator: User;
  private _order: Order;
  setUpNewHistory(): void{
    this._creator = this.authService.user;
  
    this.orderService.getOrder(+this.route.snapshot.paramMap.get('id'))
    .then(order => {
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
  
  addHistorySystemMessage(note: string, historyType: string): void {
    note = note.trim();
    historyType = historyType.trim();

    //Add history to logged in user
    var history : History = new History(this._creator, this._order, historyType, note);
    this.historyService.addHistory(history).subscribe();

    //Add history to the partner company
    if(this._order.buyer.id == this.authService.user.workplace.id && this._order.sellerManager != null){
      var otherHistory : History = new History(this._order.sellerManager, this._order, historyType, note);
      this.historyService.addHistory(otherHistory).subscribe();
    }
    if(this._order.seller.id == this.authService.user.workplace.id && this._order.buyerManager != null){
      var otherHistory : History = new History(this._order.buyerManager, this._order, historyType, note);
      this.historyService.addHistory(otherHistory).subscribe();
    }
    this.orderService.getHistoriesOfOrder(this.order.id).subscribe(histories =>  {
      this.histories = histories.sort((a,b) =>{return a.createdAt < b.createdAt ? 1 : -1});
    });
    
  }
    
  goBack(): void {
    this.location.back();
  }

}
