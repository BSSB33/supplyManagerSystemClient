import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  private mainTitle = "Monthly Income (Sales)";
  toLoad: number = 0;
  loaded: boolean = false;

  //Checks if all the requests has returned
  switchProgressBar(){
    this.toLoad++;
    if(this.toLoad == 4){
      this.loaded = true;
      this.loadingService.setLoading(false);
    }
  }
  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    private loadingService: LoadingService,
  ) { }

	ngOnInit() {
    this.initMonthlyIncomeChart(); //this._toolBar is undefinded
    this.initGetSalePartnerStatsChart()
    this.initSalesAndPurchacesChart();
    if(this.authService.isAdmin){
      this.mainTitle = "Value of Registered Orders";
      this.initGetOrderCountStats()
    }
    else{
      this.initMothlyExpensesChart();
    }
  }

  async initMonthlyIncomeChart(){
    await this.orderService.getMonthlyIncomeStats().then(stat =>{
      let chart = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        exportEnabled: false,
        theme: "dark2",
        legend: {
          verticalAlign: "bottom",
          horizontalAlign: "center"
        },
        backgroundColor: "rgb(48,48,48)",
        title: {
          text: this.mainTitle,
        },
        data: [{
          type: "stackedColumn",
          name: "Active Orders",
          legendText: "Active Orders (Cost)",
          showInLegend: true,
          axisYType: "secondary",
          dataPoints: [
            { y: stat.activeSaleCostPerMonth[0], label: "January" },
            { y: stat.activeSaleCostPerMonth[1], label: "February" },
            { y: stat.activeSaleCostPerMonth[2], label: "March" },
            { y: stat.activeSaleCostPerMonth[3], label: "April" },
            { y: stat.activeSaleCostPerMonth[4], label: "May" },
            { y: stat.activeSaleCostPerMonth[5], label: "June" },
            { y: stat.activeSaleCostPerMonth[6], label: "July" },
            { y: stat.activeSaleCostPerMonth[7], label: "August" },
            { y: stat.activeSaleCostPerMonth[8], label: "September" },
            { y: stat.activeSaleCostPerMonth[9], label: "October" },
            { y: stat.activeSaleCostPerMonth[10], label: "November" },
            { y: stat.activeSaleCostPerMonth[11], label: "December" }
          ]
        },
        {
          type: "stackedColumn",	
          name: "Closed Orders",
          legendText: "Closed Orders (Cost)",
          axisYType: "secondary",
          showInLegend: true,
          dataPoints:[
            { y: stat.closedSaleCostPerMonth[0], label: "January" },
            { y: stat.closedSaleCostPerMonth[1], label: "February" },
            { y: stat.closedSaleCostPerMonth[2], label: "March" },
            { y: stat.closedSaleCostPerMonth[3], label: "April" },
            { y: stat.closedSaleCostPerMonth[4], label: "May" },
            { y: stat.closedSaleCostPerMonth[5], label: "June" },
            { y: stat.closedSaleCostPerMonth[6], label: "July" },
            { y: stat.closedSaleCostPerMonth[7], label: "August" },
            { y: stat.closedSaleCostPerMonth[8], label: "September" },
            { y: stat.closedSaleCostPerMonth[9], label: "October" },
            { y: stat.closedSaleCostPerMonth[10], label: "November" },
            { y: stat.closedSaleCostPerMonth[11], label: "December" }
          ]
        }
      ],
      axisY: {
        suffix: " Ft"
      },
      });
        chart.render();
        this.switchProgressBar();
      });

  }

  async initMothlyExpensesChart(){
    await this.orderService.getMonthlyExpensesStats().then(stat =>{
      let chart = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        exportEnabled: false,
        theme: "dark2",
        axisY: {
          suffix: " Ft"
        },
        legend: {
          verticalAlign: "bottom",
          horizontalAlign: "center"
        },
        backgroundColor: "rgb(48,48,48)",
        title: {
          text: "Monthly Expenses (Purchases)"
        },
        data: [{
          type: "stackedColumn",
          name: "Active Orders",
          legendText: "Active Orders (Cost)",
          showInLegend: true,
          axisYType: "secondary",
          dataPoints: [
            { y: stat.activePurchaseCostPerMonth[0], label: "January" },
            { y: stat.activePurchaseCostPerMonth[1], label: "February" },
            { y: stat.activePurchaseCostPerMonth[2], label: "March" },
            { y: stat.activePurchaseCostPerMonth[3], label: "April" },
            { y: stat.activePurchaseCostPerMonth[4], label: "May" },
            { y: stat.activePurchaseCostPerMonth[5], label: "June" },
            { y: stat.activePurchaseCostPerMonth[6], label: "July" },
            { y: stat.activePurchaseCostPerMonth[7], label: "August" },
            { y: stat.activePurchaseCostPerMonth[8], label: "September" },
            { y: stat.activePurchaseCostPerMonth[9], label: "October" },
            { y: stat.activePurchaseCostPerMonth[10], label: "November" },
            { y: stat.activePurchaseCostPerMonth[11], label: "December" }
          ]
        },
        {
          type: "stackedColumn",	
          name: "Closed Orders",
          legendText: "Closed Orders (Cost)",
          axisYType: "secondary",
          showInLegend: true,
          dataPoints:[
            { y: stat.closedPurchaseCostPerMonth[0], label: "January" },
            { y: stat.closedPurchaseCostPerMonth[1], label: "February" },
            { y: stat.closedPurchaseCostPerMonth[2], label: "March" },
            { y: stat.closedPurchaseCostPerMonth[3], label: "April" },
            { y: stat.closedPurchaseCostPerMonth[4], label: "May" },
            { y: stat.closedPurchaseCostPerMonth[5], label: "June" },
            { y: stat.closedPurchaseCostPerMonth[6], label: "July" },
            { y: stat.closedPurchaseCostPerMonth[7], label: "August" },
            { y: stat.closedPurchaseCostPerMonth[8], label: "September" },
            { y: stat.closedPurchaseCostPerMonth[9], label: "October" },
            { y: stat.closedPurchaseCostPerMonth[10], label: "November" },
            { y: stat.closedPurchaseCostPerMonth[11], label: "December" }
          ]
        }
      
      ]
      });
        chart.render();
        this.switchProgressBar();
    });
  }

  async initGetSalePartnerStatsChart(){
    await this.orderService.getPartnerStats().then(partners => {
      let dict = [];
      for (const [key, value] of Object.entries(partners)) {
        dict.push({ y: value, label: key })
      }
      dict.sort((a,b) =>{return a.y > b.y ? 1 : -1})

      if(dict.length != 0){

        var chart = new CanvasJS.Chart("chartContainer3", {
          animationEnabled: true,
          theme: "dark2",
          title:{
            text: "Business Partners"
          },
          backgroundColor: "rgb(48,48,48)",
          data: [{
            type: "pyramid",
            indexLabelFontSize: 16,
            indexLabel: "{label} ({y} order)",
            indexLabelPlacement: "inside",
            dataPoints: dict,
          }]
        });
        chart.render();
        this.switchProgressBar();
      }
      
    })
    
  }

  async initSalesAndPurchacesChart(){
    await this.orderService.getOrderCountStats().then(stats => {
      let chart = new CanvasJS.Chart("pieContainer", {
        animationEnabled: true,
        exportEnabled: false,
        theme: "dark2",
        backgroundColor: "rgb(48,48,48)",
        title: {
          text: "Sales and Purchases This month"
        },
        data: [{
          type: "doughnut",
          indexLabel: "{label} - #percent%",
          dataPoints: [
            { y: stats.activePurchases, label: "Active Purchases", color: "darkorange" },
            { y: stats.closedPurchases, label: "Closed Purchases", color: "red" },
            { y: stats.activeSales, label: "Active Sales", color: "green" },
            { y: stats.closedSales, label: "Closed Sales", color: "darkgreen"  },
          ]
        }]
      });
        chart.render();
        this.switchProgressBar();
    });   
  }
    
  async initGetOrderCountStats(){
    await this.orderService.getUserCountStats().then(stats => {
      let chart = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        exportEnabled: false,
        theme: "dark2",
        backgroundColor: "rgb(48,48,48)",
        title: {
          text: "Registered Users by Role"
        },
        data: [{
          type: "pie",
          indexLabel: "{label}",
          dataPoints: [
            { y: stats.manager, label: "Managers"},
            { y: stats.director, label: "Directors"},
            { y: stats.admin, label: "Admins"},
          ]
        }]
      });
        chart.render();
        this.switchProgressBar();
    });  
  }
}
