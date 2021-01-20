import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer } from '../customer.model';

@Component({
  selector: 'app-modified-user',
  templateUrl: './modified-user.component.html',
  styleUrls: ['./modified-user.component.css']
})
export class ModifiedUserComponent implements OnInit {
  editMode = false;
  id: number;
  firstName = '';
  lastName = '';
  addressLists = [];
  resultData;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.firstChild.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
        }
      );
    
    if(this.editMode){
      this.onGetData();
    }
  }

  onGetData(){
    this.http.get('https://localhost:44349/api/values/'+ this.id).subscribe((data: Customer)=> {
      this.firstName = data.FirstName;
      this.lastName = data.LastName;
      this.addressLists = data.CustomerAddress;
    });
  }

  onSave(){
    var postConfirm = confirm("Do you want to save?");
    if(postConfirm){
      this.http.post('https://localhost:44349/api/values/postSave', {CustomerId: this.id, FirstName: this.firstName, LastName: this.lastName})
      .subscribe();
    }
  }

  onBack(){
    this.router.navigate(['../', 'display-user'], {relativeTo: this.activatedRoute});
  }

  // onEditAddress(a){
  //   console.log(a);
  //   console.log(this.addressLists.find(b => b.AddressId === a.AddressId));
  // }

}
