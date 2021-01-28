import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';

import { AppService } from '../app.service';
import { toPromise } from '../share/helper/handler';
import { UserSearchParam } from './Model/user.model';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {
  dataSource: DataSource;
  users: UserSearchParam;
  ds;

  constructor(private http: HttpClient, service: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.users = new UserSearchParam();
  }

  ngOnInit(): void {
    this.users.FirstName = '';
    this.users.LastName = '';
    this.onFetchData();
  }

  onFetchData() {
    this.http.get('https://localhost:44349/api/values').subscribe((data) => {
    })

    // this.dataSource = new DataSource({
    //   load: loadOptions => toPromise(this.http.post('https://localhost:44349/api/values/QueryUser', {...this.users, loadOptions}))
    // })

    this.dataSource = new DataSource({
      load: loadOptions => toPromise(this.http.post('https://localhost:44349/api/values/QuerySearchUser', {...this.users, loadOptions}))
    });
  }

  onChange(){
    this.dataSource = new DataSource({
      load: loadOptions => toPromise(this.http.post('https://localhost:44349/api/values/QuerySearchUser', {...this.users, loadOptions}))
    });
  }

  onEdit(data) {
    if (data === 0) {
      this.router.navigate(['../', 'modified-user', 'new'], { relativeTo: this.activatedRoute });
    }
    else {
      this.router.navigate(['../', 'modified-user', data.CustomerId, 'edit'], { relativeTo: this.activatedRoute });
    }
  }

  isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  onTest(d){
    console.log(d);
  }

}
