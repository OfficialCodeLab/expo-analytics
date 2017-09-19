import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {User} from "../../classes/user";
import {Vendor} from "../../classes/vendor";
import {DataService} from "../../services/data.service";

declare var $:any;

@Component({
    // moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;

    loading: boolean;



    constructor(location: Location,  private element: ElementRef, public data: DataService) {
      this.location = location;
          this.sidebarVisible = false;
    }

    refresh_all_data(): void {
        this.loading = true;
        this.notifyStart();
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



    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.split('/').pop();
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
