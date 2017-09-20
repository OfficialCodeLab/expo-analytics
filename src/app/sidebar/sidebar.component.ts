import { Component, OnInit } from '@angular/core';

import {User} from "../classes/user";
import {Vendor} from "../classes/vendor";
import {DataService} from "../services/data.service";
declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: 'settings', title: 'Expo Settings',  icon:'pe-7s-edit', class: '' },
    { path: 'vendors', title: 'Vendor List',  icon:'pe-7s-note2', class: '' },
    { path: 'users', title: 'User List',  icon:'pe-7s-user', class: '' },
    // { path: 'icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    { path: 'expo-layout', title: 'Expo Layout',  icon:'pe-7s-map-marker', class: '' },
    // { path: 'notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
    // { path: 'upgrade', title: 'Upgrade to PRO',  icon:'pe-7s-rocket', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public data: DataService) { }

  loading: boolean;

  refresh_all_data(): void {
      this.loading = true;
      this.data.refreshDatabase().then(success => {
          this.loading = false;
          this.notifySuccess();
      }).catch(ex => {
          this.loading = false;
          this.notifyFail();
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
        message: "Data has been refreshed successfully"
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
        message: "Data could not refresh, please try again"
    },{
        type: "danger",
        timer: 1000,
        placement: {
            from: "bottom",
            align: "right"
        }
    });
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
