import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DataSource from 'devextreme/data/data_source';

import { AppService } from '../app.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {
  dataSource: DataSource;

  constructor(private http: HttpClient, service: AppService, private router: Router, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.onFetchData();
  }

  onFetchData(){
    this.http.get('https://localhost:44349/api/values').subscribe((data)=> {
      console.log(data);
    })

    this.dataSource = new DataSource({
      load: (loadOptions) => {
        return new Promise((resolve) => {
          return this.http.get('https://localhost:44349/api/values').subscribe((response: any) => {
            console.log(response.data[0].CustomerAddress[0].AddressId);
            resolve(response);
          })
        })
      }
    })
  }

  onEdit(data){
    if(data === 0){
      this.router.navigate(['../', 'modified-user', 'new'], {relativeTo: this.activatedRoute});
    }
    else{
      this.router.navigate(['../', 'modified-user', data.CustomerId, 'edit'], {relativeTo: this.activatedRoute});
    }
  }

}
