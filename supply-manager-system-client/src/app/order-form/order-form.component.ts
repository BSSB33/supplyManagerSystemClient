import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../classes/order';
import { Company } from '../classes/company';
import { User } from '../classes/user';
import { CompanyService } from '../services/company.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, FormsModule, FormControlName, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HistoryService } from '../services/history.service';
import { History } from '../classes/history';
import { stringify } from 'querystring';
import { MessageService } from '../services/message.service';
import { EnumService } from '../services/enum.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  @Input() order: Order;
  sales: Boolean = this.orderService.href == "sales";
  public companies: Company[];
  managers: User[];
  usersOfBuyerCompany: User[];
  usersOfSellerCompany: User[];
  selectedBuyerCompany: Company;
  selectedSellerCompany: Company;
  originalStatus: String;
  originalName: String;
  originalPrice: Number;
  statuses: String[];
  selectableCompanyiesForBuyer: Company[];
  selectableCompanyiesForSeller: Company[];

  orderForm: FormGroup;

  constructor(    
    private location: Location,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private historyService: HistoryService,
    private companyService: CompanyService,
    private userService: UserService,
    public authService: AuthService,
    public enumService: EnumService,
    private loadingService: LoadingService,
    ) 
    { 
      //Admin page
      if(this.authService.isAdmin){
        this.orderForm = new FormGroup({
          productName: new FormControl('', [
            Validators.required,
            Validators.minLength(3)
          ]),
          price: new FormControl('',[
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[0-9]+')
          ]),
          status: new FormControl(),
          seller: new FormControl(Validators.required),
          buyer: new FormControl(Validators.required),
          sellerManager: new FormControl(Validators.required),
          buyerManager: new FormControl(Validators.required),
        });
      }
      //Sales page
      if(this.sales && !this.authService.isAdmin){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl('',[
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[0-9]+')
          ]),
          status: new FormControl(),
          sellerManager: new FormControl(Validators.required),
          buyerManager: new FormControl(),
        });
      }
      //Purchase pages
      if(!this.sales && !this.authService.isAdmin){
        this.orderForm = new FormGroup({
          productName: new FormControl(Validators.required),
          price: new FormControl('',[
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[0-9]+')
          ]),
          status: new FormControl(),
          buyerManager: new FormControl(Validators.required),
          sellerManager: new FormControl(),
        });
      }
    }
   
  ngOnInit(): void {
    this.getOrderById();
    this.getManagersOfUser();
    this.getCompanies();
    this.setUpNewStatusChangeHistory();
    this.getStatuses();
  }

  toLoad: number = 0;
  loaded: boolean = false;
    //Checks if all the requests has returned
  switchProgressBar(){
    this.toLoad++;
    if(this.toLoad == 5){
      this.loaded = true;
      this.loadingService.setLoading(false);
    }
  }

  getStatuses(): void {
    this.statuses = this.enumService.getStatuses();
    this.switchProgressBar();
  }

  getCompanies(): void {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies;
        this.switchProgressBar();
      });
  }

  getOrderById(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id)
      .subscribe(
        order => {
        this.order = order;
        this.originalStatus = order.status;
        this.originalName = order.productName;
        this.originalPrice = order.price;
        this.companyService.getCompanies()
          .subscribe(companies => {
            this.companies = companies;
            this.initFilterUsersOfBuyerCompany(order.buyer.name, companies);
            this.initFilterUsersOfSellerCompany(order.seller.name, companies);
            this.switchProgressBar();
          });
      });
  }

  getManagersOfUser(): void{
    this.userService.getUsers()
      .subscribe(managers => {
        this.managers = managers
        this.usersOfSellerCompany = managers;
        this.usersOfBuyerCompany = managers;
        this.switchProgressBar();
      });
  }

  private _creator: User;
  private _order: Order;
  setUpNewStatusChangeHistory(): void{
    this._creator = this.authService.user;
    let orderId = +this.route.snapshot.paramMap.get('id');

    this.orderService.getOrder(orderId)
      .subscribe(order => {
        this._order = order
        this.switchProgressBar();
      });
  }

  addHistoryToOrder(note: string, historyType: string): void {
    note = note.trim();
    historyType = historyType.trim();

    var history : History = new History(this._creator, this._order, historyType, note);
    this.historyService.addHistory(history).subscribe();
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
  }
    
  submit(): void {
    if(this.authService.isAdmin){
      var buyerManagerName = this.orderForm.controls['buyerManager'].value;
      var sellerManagerName = this.orderForm.controls['sellerManager'].value;
      var buyerName = this.orderForm.controls['buyer'].value;
      var sellerName = this.orderForm.controls['seller'].value;
      this.order.buyerManager = this.managers.find(user => user.username == buyerManagerName);
      this.order.sellerManager = this.managers.find(user => user.username == sellerManagerName);
      this.order.buyer = this.companies.find(copmany => copmany.name == buyerName);
      this.order.seller = this.companies.find(copmany => copmany.name == sellerName);
    }
    if(this.sales && !this.authService.isAdmin){
      var sellerManagerName = this.orderForm.controls['sellerManager'].value;
      this.order.sellerManager = this.managers.find(user => user.username == sellerManagerName);
    }
    if(!this.sales && !this.authService.isAdmin){
      var buyerManagerName = this.orderForm.controls['buyerManager'].value;
      this.order.buyerManager = this.managers.find(user => user.username == buyerManagerName);
    }
    //If Status modified, create a new History card
    if(this.originalStatus != this.orderForm.controls['status'].value){
      this.addHistorySystemMessage("Status was modified from \"" + this.originalStatus + "\" to \"" + this.orderForm.controls['status'].value + "\"", "STATUS_MODIFIED");
    }
    if(this.originalName != this.orderForm.controls['productName'].value){
      this.addHistorySystemMessage("Product Name was modified from \"" + this.originalName + "\" to \"" + this.orderForm.controls['productName'].value + "\"", "STATUS_MODIFIED");
    }
    if(this.originalPrice != this.orderForm.controls['price'].value){
      this.addHistorySystemMessage("Product Price was modified from " + this.originalPrice + " Ft to " + this.orderForm.controls['price'].value + " Ft", "STATUS_MODIFIED");
    }
    
    this.orderService.updateOrder(this.order)
    .subscribe(() => this.goBack());
  }

  initFilterUsersOfBuyerCompany(companyName: string, companies: Company[]){
    this.selectedBuyerCompany = companies.find(company => company.name == companyName);
    this.selectableCompanyiesForSeller = companies.filter(company => company.name != companyName);
    this.usersOfBuyerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  initFilterUsersOfSellerCompany(companyName: string, companies: Company[]){
    this.selectedSellerCompany = companies.find(company => company.name == companyName);
    this.selectableCompanyiesForBuyer = companies.filter(company => company.name != companyName);
    this.usersOfSellerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  filterUsersOfBuyerCompany(companyName: string){
    this.selectedBuyerCompany = this.companies.find(company => company.name == companyName);
    this.selectableCompanyiesForSeller = this.companies.filter(company => company.name != companyName);
    this.usersOfBuyerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  filterUsersOfSellerCompany(companyName: string){
    this.selectedSellerCompany = this.companies.find(company => company.name == companyName);
    this.selectableCompanyiesForBuyer = this.companies.filter(company => company.name != companyName);
    this.usersOfSellerCompany = this.managers.filter(user => user.workplace.name == companyName);
  }

  goBack(): void {
    this.location.back();
  }

}
