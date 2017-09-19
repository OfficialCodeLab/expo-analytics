import { Component, OnInit } from '@angular/core';
import {User} from "../classes/user";
import {Vendor} from "../classes/vendor";
import {DataService} from "../services/data.service";
import {NgModel} from "@angular/forms"

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  local_users: User[];
  local_vendors: Vendor[];
  loading: boolean;
  search_terms: string;

  constructor(public data: DataService) {

      this.search_terms = "";
      Promise.all([data.getUsers()]).then(responses => {
          this.local_users = responses[0];

      }).catch(ex => console.log(ex));

      data.users_event.subscribe(users => {
          this.local_users = users;
      });
  }

  ngOnInit() {

  }

}
