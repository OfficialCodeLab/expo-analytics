import {Injectable, EventEmitter} from '@angular/core';
import {Vendor} from "../classes/vendor";
import {User} from "../classes/user";
import {Http, Headers, HttpModule} from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';

import 'rxjs/add/operator/toPromise';

declare var $:any;

@Injectable()
export class DataService {
    all_users: User[];
    all_vendors: Vendor[];

    users_event: EventEmitter<User[]> = new EventEmitter();
    vendors_event: EventEmitter<Vendor[]> = new EventEmitter();

    BASE_URL: string;

    initial_load: boolean;
    loadEvent: EventEmitter<boolean> = new EventEmitter();


    constructor(public http: Http) {
        this.BASE_URL = "http://138.68.133.255:1337";
        this.all_users = [];
        this.all_vendors = [];
        this.initial_load = true;
        this.notifyStart();

        this.setupDatabase().then(success => {
            this.notifySuccess();
            console.log("Refreshed database!");
            this.initial_load = false;
            this.loadEvent.emit(this.initial_load);
        }).catch(ex => {
            this.notifyFail();
            console.log("Unable to get database!", ex);
            this.initial_load = false;
            this.loadEvent.emit(this.initial_load);
        });
    }

    notifyStart() {
      $.notify({
          icon: "pe-7s-clock",
          message: "Data is being fetched from the server"
      },{
          type: "info",
          timer: 1000,
          placement: {
              from: "bottom",
              align: "right"
          }
      });
    }

    notifySuccess() {
      $.notify({
          icon: "pe-7s-refresh-2",
          message: "Data has been fetched successfully"
      },{
          type: "success",
          timer: 1000,
          placement: {
              from: "bottom",
              align: "right"
          }
      });
    }

    notifyFail() {
      $.notify({
          icon: "pe-7s-attention",
          message: "Data could not be fetched, please try refresh"
      },{
          type: "danger",
          timer: 1000,
          placement: {
              from: "bottom",
              align: "right"
          }
      });
    }

    getUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            if (this.all_users.length !== 0) {
                console.log(this.all_users);
                resolve(this.all_users);
            } else {
                this.loadEvent.subscribe(loading => {
                    if (loading === false) {
                        resolve(this.all_users);
                    }
                });
            }
        });
    }

    getVendors(): Promise<Vendor[]> {
        return new Promise((resolve, reject) => {
            if (this.all_vendors.length !== 0) {
                resolve(this.all_vendors);
            } else {
                this.loadEvent.subscribe(loading => {
                    if (loading === false) {
                        resolve(this.all_vendors);
                    }
                });
            }
        });
    }

    setupDatabase(): Promise<any> {
        return new Promise((resolve, reject) => {

            let userPromise = this.http.get(this.BASE_URL + "/api/users/get_all").toPromise();
            let vendorPromise = this.http.get(this.BASE_URL + "/api/vendors/get_all").toPromise();

            Promise.all([userPromise, vendorPromise]).then(resultsArr => {
                console.log(typeof resultsArr);

                this.all_users = [];
                this.all_vendors = [];

                for (let user of resultsArr[0].json()) {
                    this.all_users.push(new User(user));
                }

                for (let vendor of resultsArr[1].json()) {
                    this.all_vendors.push(new Vendor(vendor));
                }

                console.log("Setup all assets!");

                this.users_event.emit(this.all_users);
                this.vendors_event.emit(this.all_vendors);

                resolve();
                // console.log(this.all_users);

            }).catch(ex => {
                reject(ex);
            });



            //     const ABALOBI_USERS = this.BASE_URL + '/api/users';
            //     const OPTIONS = this.getRequestWithAuthOptions();
            //
            //     if (this.localFishers === null || this.localFishers === undefined) {
            //         this.http.get(ABALOBI_USERS, OPTIONS).toPromise().then(function (response) {
            //             this.localFishers = response.json()['abalobi-users'] as Fisher;
            //
            //             resolve(this.localFishers);
            //         }.bind(this)).catch(() => reject());
            //
            //     } else {
            //         console.log('Service has fisher values already');
            //         resolve(this.localFishers);
            //     }
            // }.bind(this)); // NOTE: The bind `should` keep this as the parent object


        });
    }

    refreshDatabase(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setupDatabase().then(success => {
                console.log("Refreshed database!");
                resolve();
            }).catch(ex => {
                console.log("Unable to get database!", ex);
                reject(ex);
            });
        });
    }

}
