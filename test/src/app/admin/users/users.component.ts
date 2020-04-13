import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anand-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[];
  hasPermission = true;

  constructor() {}

  ngOnInit(): void {
    if (this.hasPermission) {
      this.getUser()
        .then((users) => {
          this.users = users;
          console.log(this.users);
        })
        .catch((err) => console.log(err.message));
    } else {
      this.users = [];
    }
  }

  private async getUser() {
    return [
      {
        name: 'john',
        email: 'john.papa@gmail.com',
      },
      {
        name: 'anand',
        email: 'anand.musaddi@gmail.com',
      },
    ];
  }
}
