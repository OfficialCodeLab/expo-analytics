import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import {User} from "../classes/user";
import {Vendor} from "../classes/vendor";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public statsChartType: string;
    public statsChartData: any;


    public hoursChartType: string;
    public hoursChartData: any;
    public hoursChartOptions: any;
    public hoursChartResponsive: any[];

    public activityChartType: string;
    public activityChartData: any;
    public activityChartOptions: any;
    public activityChartResponsive: any[];


    local_users: User[];
    local_vendors: Vendor[];
    public chartLabels:string[] = ['Scans', 'Favourties'];
    public chartData:number[] = [6605, 5881];
    public type:string = 'pie';
    public chartOptions:any = {
    responsive: true
  };

    public lineChartData:Array<any> = [
    {data: [2, 59, 80, 60, 76, 60, 0], label: 'Favourites'},
    {data: [5, 65, 100, 160, 86, 80, 0], label: 'Scans'},
    {data: [0, 10, 30, 50, 17, 12, 0], label: 'Notes'}
  ];
  public lineChartLabels:Array<any> = ['06:00', '08:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // red
      backgroundColor: 'rgba(244,67,54,0.2)',
      borderColor: 'rgba(244,67,54,1)',
      pointBackgroundColor: 'rgba(244,67,54,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(244,67,54,0.8)'
    },
    { // blue
      backgroundColor: 'rgba(33,150,243,0.2)',
      borderColor: 'rgba(33,150,243,1)',
      pointBackgroundColor: 'rgba(33,150,243,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(33,150,243,0.8)'
    },
    { // yellow
      backgroundColor: 'rgba(255, 235, 59,0.2)',
      borderColor: 'rgba(255, 235, 59,1)',
      pointBackgroundColor: 'rgba(255, 235, 59,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 235, 59,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  // events
  public barChartOptions:any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    public barChartLabels:string[] = ['06:00', '08:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    public barChartData:any[] = [
      {data: [0, 50, 100, 110, 66, 10, 50, 20], label: 'Users'},
      {data: [0, 28, 38, 20, 16, 46, 27, 50], label: 'Vendors'}
    ];

    public barChartColors:Array<any> = [
      { // green
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
      },
      { // purple
        backgroundColor: '#9c27b0',
        borderColor: '#9c27b0',
      }
    ];

    total_user_count: number = 699;
    total_vendor_count: number = 142;
    total_user_scans: number = 6605;
    total_user_favs: number = 5881;
    average_scans: number = 9;
    average_contacts: number = 47;

  constructor(public data: DataService) {

        this.type = 'pie';
        // this.chartData = {
        //   labels: ["Scans", "Favourites"],
        //   datasets: [
        //     {
        //       label: "Activity Analysis",
        //       data: [50, 50],
        //       backgroundColor: [
        //         'rgba(54, 162, 235, 0.2)',
        //         'rgba(255, 99, 132, 0.2)'
        //         // 'rgba(255, 206, 86, 0.2)',
        //         // 'rgba(75, 192, 192, 0.2)',
        //         // 'rgba(153, 102, 255, 0.2)',
        //         // 'rgba(255, 159, 64, 0.2)'
        //       ],
        //       borderColor: [
        //           'rgba(54, 162, 235, 1)',
        //           'rgba(255,99,132,1)'
        //           // 'rgba(255, 206, 86, 1)',
        //           // 'rgba(75, 192, 192, 1)',
        //           // 'rgba(153, 102, 255, 1)',
        //           // 'rgba(255, 159, 64, 1)'
        //       ],
        //     }
        //   ]
        // };
        this.hoursChartType = "line";

        this.hoursChartOptions = {
          responsive: true,
          maintainAspectRatio: false
        };

    data.getUsers().then(users => {
        this.local_users = users;
        return data.getVendors();
    }).then(vendors => {
        this.local_vendors = vendors;
        this.total_user_count = this.calculateTotalUsers();
        this.total_vendor_count = this.calculateTotalVendors();
        this.total_user_scans = this.calculateTotalScans();
        this.total_user_favs = this.calculateTotalFavs();
        this.recalcChartStats();
        data.vendors_event.subscribe(vendors => {
            this.local_vendors = vendors;
            this.total_vendor_count = this.calculateTotalVendors();
            this.recalcChartStats();
        });

        data.users_event.subscribe(users => {
            this.local_users = users;
            this.total_user_count = this.calculateTotalUsers();
            this.total_user_scans = this.calculateTotalScans();
            this.total_user_favs = this.calculateTotalFavs();
        });
    }).catch(ex => {
        console.log(ex);
    });



  }

  ngOnInit() {

    // this.chartData = {
    //   labels: ["Scans", "Favourites"],
    //   datasets: [
    //     {
    //       label: "Activity Analysis",
    //       data: [0,0],
    //       backgroundColor: [
    //         'rgba(54, 162, 235, 0.2)',
    //         'rgba(255, 99, 132, 0.2)'
    //       ],
    //       borderColor: [
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255,99,132,1)'
    //       ],
    //     }
    // ]};
    // this.hoursChartType = ChartType.Line;
    // this.hoursChartData = {
    //   labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
    //   series: [
    //     [287, 385, 490, 492, 554, 586, 698, 695, 752, 788, 846, 944],
    //     [67, 152, 143, 240, 287, 335, 435, 437, 539, 542, 544, 647],
    //     [23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
    //   ]
    // };
    // this.hoursChartOptions = {
    //   low: 0,
    //   high: 800,
    //   showArea: true,
    //   height: '245px',
    //   axisX: {
    //     showGrid: false,
    //   },
    //   lineSmooth: Chartist.Interpolation.simple({
    //     divisor: 3
    //   }),
    //   showLine: false,
    //   showPoint: false,
    // };
    // this.hoursChartResponsive = [
    //   ['screen and (max-width: 640px)', {
    //     axisX: {
    //       labelInterpolationFnc: function (value) {
    //         return value[0];
    //       }
    //     }
    //   }]
    // ];
    // this.hoursChartLegendItems = [
    //   { title: 'Scan', imageClass: 'fa fa-circle text-info' },
    //   { title: 'Favourite', imageClass: 'fa fa-circle text-danger' },
    //   { title: 'Add Note', imageClass: 'fa fa-circle text-warning' }
    // ];
    // this.statsChartType = ChartType.Pie;
    // this.statsChartData = {
    //   labels: ["50", "50"],
    //   series: [50, 50]
    // };
    // this.statsChartLegendItems = [
    //   { title: 'Users', imageClass: 'fa fa-circle text-info' },
    //   { title: 'Vendors', imageClass: 'fa fa-circle text-danger' },
    // ];

    this.data.getUsers().then(users => {
        this.local_users = users;
        return this.data.getVendors();
    }).then(vendors => {
        this.local_vendors = vendors;
        this.total_user_count = this.calculateTotalUsers();
        this.total_vendor_count = this.calculateTotalVendors();
        this.total_user_scans = this.calculateTotalScans();

        this.statsChartData = {
          labels: [this.total_user_count + "", this.total_user_count + ""],
          series: [50, 50]
        };
    }).catch(ex => {
        console.log(ex);
    });


      // this.activityChartType = ChartType.Bar;
      // this.activityChartData = {
      //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //   series: [
      //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
      //     [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
      //   ]
      // };
      // this.activityChartOptions = {
      //   seriesBarDistance: 10,
      //   axisX: {
      //     showGrid: false
      //   },
      //   height: '245px'
      // };
      // this.activityChartResponsive = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // this.activityChartLegendItems = [
      //   { title: 'Tesla Model S', imageClass: 'fa fa-circle text-info' },
      //   { title: 'BMW 5 Series', imageClass: 'fa fa-circle text-danger' }
      // ];


    }

    calculateTotalUsers(): number {
        let count = 0;

        for (let user of this.local_users) {
            count++;
        }

        return count;
    }

    calculateTotalVendors(): number {
        let count = 0;

        for (let vendor of this.local_vendors) {
            count++;
        }

        return count;
    }

    calculateTotalScans(): number {
        let count = 0;

        for (let user of this.local_users) {
          let scans = user.scannedItems;

          count += scans.length;
        }

        this.average_scans = Math.round(count / this.local_users.length);
        this.average_contacts = Math.round(count / this.local_vendors.length);
        return count;
    }

    calculateTotalFavs(): number {
        let count = 0;

        for (let user of this.local_users) {
          let favs = user.Favourites;

          count += favs.length;
        }

        return count;
    }


    recalcChartStats() {
      // this.chartData.datasets[0].data.pop();
      this.chartData = [this.total_user_scans, this.total_user_favs];


      // this.chartData.datasets[0].data = [this.total_user_scans, this.total_user_favs];
      // this.chartData.datasets[0].data.push(this.total_user_scans);
      // this.chartData.datasets[0].data.push(this.total_user_favs);
      // this.chartData.datasets[0].data.push();
      // this.statsChartData.series.pop();
      // this.statsChartData.series.pop();
      // this.statsChartData.series.push(this.total_user_count);
      // this.statsChartData.series.push(this.total_vendor_count);
      // this.statsChartData.labels.pop();
      // this.statsChartData.labels.pop();
      // this.statsChartData.labels.push(this.total_user_count);
      // this.statsChartData.labels.push(this.total_vendor_count);
    }

}
