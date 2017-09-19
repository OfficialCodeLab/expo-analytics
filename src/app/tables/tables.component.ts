// import { Component, OnInit } from '@angular/core';
//
// declare interface TableData {
//     headerRow: string[];
//     dataRows: string[][];
// }
//
// @Component({
//   selector: 'app-tables',
//   templateUrl: './tables.component.html',
//   styleUrls: ['./tables.component.css']
// })
// export class TablesComponent implements OnInit {
//     public tableData1: TableData;
//     public tableData2: TableData;
//
//   constructor() { }
//
//   ngOnInit() {
//       this.tableData1 = {
//           headerRow: [ 'ID', 'Name', 'Country', 'City', 'Salary'],
//           dataRows: [
//               ['1', 'Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738'],
//               ['2', 'Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
//               ['3', 'Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
//               ['4', 'Philip Chaney', 'Korea, South', 'Overland Park', '$38,735'],
//               ['5', 'Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
//               ['6', 'Mason Porter', 'Chile', 'Gloucester', '$78,615']
//           ]
//       };
//       this.tableData2 = {
//           headerRow: [ 'ID', 'Name',  'Salary', 'Country', 'City' ],
//           dataRows: [
//               ['1', 'Dakota Rice','$36,738', 'Niger', 'Oud-Turnhout' ],
//               ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
//               ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux' ],
//               ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park' ],
//               ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten', ],
//               ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester' ]
//           ]
//       };
//   }
//
// }
import {Component, OnInit} from '@angular/core';
import {User} from "../classes/user";
import {Vendor} from "../classes/vendor";
import {DataService} from "../services/data.service";
import {NgModel} from "@angular/forms"

// declare interface TableData {
//     headerRow: string[];
//     dataRows: string[][];
// }

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})


export class TablesComponent implements OnInit {
    local_users: User[];
    local_vendors: Vendor[];
    loading: boolean;
    search_terms: string;

    constructor(public data: DataService) {

        this.search_terms = "";
        Promise.all([data.getUsers(), data.getVendors()]).then(responses => {
            this.local_users = responses[0];
            this.local_vendors = responses[1];

            this.refresh_all();

        }).catch(ex => console.log(ex));

        data.users_event.subscribe(users => {
            this.local_users = users;
            this.refresh_all();
        });

        data.vendors_event.subscribe(vendors => {
            this.local_vendors = vendors;
            this.refresh_all();
        });
    }

    ngOnInit() {

    }

    calculateScans(): void {
        for (let vendor of this.local_vendors) {
            let count = 0;
            for (let user of this.local_users) {
                if (user.scannedItems.indexOf(vendor.id) !== -1) {
                    count++;
                }
            }
            vendor.total_scans = count;
        }
    }

    calculateFavourites(): void {
        for (let vendor of this.local_vendors) {
            let count2 = 0;
            for (let user of this.local_users) {
                if (user.Favourites.indexOf(vendor.name_english) !== -1) {
                    count2++;
                }
            }
            vendor.total_favourites = count2;
        }
    }

    refresh_all(): void {
        this.calculateFavourites();
        this.calculateScans();
    }

}
