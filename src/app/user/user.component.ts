import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  website: string = "www.decorex.co.za";
  email: string = "info@decorex.co.za";
  address: string = "The mega dome";
  city: string = "Johannesburg";
  province: string = "Gauteng";
  zip: string = "7234";
  desc: string = "Decorex SA, South Africa’s premier décor, design and lifestyle exhibition showcases in three cities – Durban, Cape Town and Joburg. The décor and design industry’s leading and most trusted brand was founded in 1994, and continues to play a pivotal role in shaping the industry.";


  constructor() { }

  ngOnInit() {
  }

  notifySuccess() {
    $.notify({
        icon: "pe-7s-check",
        message: "Event has been updated successfully"
    },{
        type: "success",
        timer: 1000,
        placement: {
            from: "bottom",
            align: "right"
        }
    });
  }
}
