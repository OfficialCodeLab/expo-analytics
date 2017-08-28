import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import * as Chartist from 'chartist';
import {User} from "../classes/user";
import {Vendor} from "../classes/vendor";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    public statsChartType: ChartType;
    public statsChartData: any;
    public statsChartLegendItems: LegendItem[];

    public hoursChartType: ChartType;
    public hoursChartData: any;
    public hoursChartOptions: any;
    public hoursChartResponsive: any[];
    public hoursChartLegendItems: LegendItem[];

    public activityChartType: ChartType;
    public activityChartData: any;
    public activityChartOptions: any;
    public activityChartResponsive: any[];
    public activityChartLegendItems: LegendItem[];


    local_users: User[];
    local_vendors: Vendor[];
    type: string;
    chartData: any;
    options: any;

    total_user_count: number;
    total_vendor_count: number;
    total_user_scans: number;
    total_user_favs: number;
    average_scans: number;
    average_contacts: number;

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
        this.options = {
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
    }).catch(ex => {
        console.log(ex);
    });

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

  }

  ngOnInit() {
    this.statsChartType = ChartType.Pie;
    this.statsChartData = {
      labels: ["50", "50"],
      series: [50, 50]
    };
    this.statsChartLegendItems = [
      { title: 'Users', imageClass: 'fa fa-circle text-info' },
      { title: 'Vendors', imageClass: 'fa fa-circle text-danger' },
    ];

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

      this.hoursChartType = ChartType.Line;
      this.hoursChartData = {
        labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
        series: [
          [287, 385, 490, 492, 554, 586, 698, 695, 752, 788, 846, 944],
          [67, 152, 143, 240, 287, 335, 435, 437, 539, 542, 544, 647],
          [23, 113, 67, 108, 190, 239, 307, 308, 439, 410, 410, 509]
        ]
      };
      this.hoursChartOptions = {
        low: 0,
        high: 800,
        showArea: true,
        height: '245px',
        axisX: {
          showGrid: false,
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 3
        }),
        showLine: false,
        showPoint: false,
      };
      this.hoursChartResponsive = [
        ['screen and (max-width: 640px)', {
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.hoursChartLegendItems = [
        { title: 'Open', imageClass: 'fa fa-circle text-info' },
        { title: 'Click', imageClass: 'fa fa-circle text-danger' },
        { title: 'Click Second Time', imageClass: 'fa fa-circle text-warning' }
      ];

      this.activityChartType = ChartType.Bar;
      this.activityChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695]
        ]
      };
      this.activityChartOptions = {
        seriesBarDistance: 10,
        axisX: {
          showGrid: false
        },
        height: '245px'
      };
      this.activityChartResponsive = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      this.activityChartLegendItems = [
        { title: 'Tesla Model S', imageClass: 'fa fa-circle text-info' },
        { title: 'BMW 5 Series', imageClass: 'fa fa-circle text-danger' }
      ];


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
      this.chartData = {
        labels: ["Scans", "Favourites"],
        datasets: [
          {
            label: "Activity Analysis",
            data: [this.total_user_scans, this.total_user_favs],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255,99,132,1)'
            ],
          }
        ]
      };
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
