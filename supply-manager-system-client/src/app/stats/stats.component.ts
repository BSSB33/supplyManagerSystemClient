import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../assets/canvasjs.min';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor() { }

	ngOnInit() {
    this.initApproxIncomeChart();
    this.initRecordedIncomeChart();
    this.initRecordedExpensesChart();
    this.initSalesAndPurchacesChart();
  }


  initRecordedIncomeChart(){
    let chart = new CanvasJS.Chart("chartContainer1", {
      animationEnabled: true,
      exportEnabled: false,
      theme: "dark2",
      backgroundColor: "rgb(48,48,48)",
      title: {
        text: "Monthly Recorded Income"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "January" },
          { y: 55, label: "February" },
          { y: 50, label: "March" },
          { y: 65, label: "April" },
          { y: 95, label: "May" },
          { y: 68, label: "June" },
          { y: 28, label: "July" },
          { y: 34, label: "September" },
          { y: 14, label: "October" },
          { y: 34, label: "November" },
          { y: 34, label: "December" }
        ]
      }]
    });
      chart.render();
    }

  initApproxIncomeChart(){
    let chart = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      exportEnabled: false,
      theme: "dark2",
      backgroundColor: "rgb(48,48,48)",
      title: {
        text: "Monthly Approximated Income"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "January" },
          { y: 55, label: "February" },
          { y: 50, label: "March" },
          { y: 65, label: "April" },
          { y: 95, label: "May" },
          { y: 68, label: "June" },
          { y: 28, label: "July" },
          { y: 34, label: "September" },
          { y: 14, label: "October" },
          { y: 34, label: "November" },
          { y: 34, label: "December" }
        ]
      }]
    });
      chart.render();
    }

    
    initRecordedExpensesChart(){
    let chart = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      exportEnabled: false,
      theme: "dark2",
      backgroundColor: "rgb(48,48,48)",
      title: {
        text: "Monthly Approximated Expense"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "January" },
          { y: 55, label: "February" },
          { y: 50, label: "March" },
          { y: 65, label: "April" },
          { y: 95, label: "May" },
          { y: 68, label: "June" },
          { y: 28, label: "July" },
          { y: 34, label: "September" },
          { y: 14, label: "October" },
          { y: 34, label: "November" },
          { y: 34, label: "December" }
        ]
      }]
    });
      chart.render();
    }

    
    initSalesAndPurchacesChart(){
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
          { y: 3, label: "Purchases" },
          { y: 5, label: "Sales" },
        ]
      }]
    });
      chart.render();
    }
  

}


