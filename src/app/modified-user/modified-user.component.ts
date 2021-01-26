import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerAddress } from '../customer-address.model';
import { catchError } from 'rxjs/operators';
 
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
  addressLists: CustomerAddress[];
  removeAddrId = [];
  newAddrInfo = '';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.firstChild.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
        }
      );

    if (this.editMode) {
      this.onGetData();
    }

    this.addressLists = [];
  }

  onGetData() {
    this.http.get('https://localhost:44349/api/values/' + this.id).subscribe((data: Customer) => {
      this.firstName = data.FirstName;
      this.lastName = data.LastName;
      this.addressLists = data.CustomerAddress;
    });
  }

  onSave() {
    if(this.id > 0){
      var postConfirm = confirm("Do you want to save?");
      if (postConfirm) {
        this.http.post('https://localhost:44349/api/values/postSave', {
          Data: {
            CustomerId: this.id,
            FirstName: this.firstName,
            LastName: this.lastName,
            CustomerAddress: this.addressLists
          },
          ListOfId: this.removeAddrId
        }).pipe(catchError((e)=>{
          alert(e.error.ExceptionMessage)
          return e;
        }))
        .subscribe((e)=>{
          //completed
          this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
        });
      }
    }
    else{
      var postConfirm = confirm("Do you want to save?");
      if (postConfirm){
        this.http.post('https://localhost:44349/api/values/addNewUser', {
          FirstName: this.firstName,
          LastName: this.lastName,
          CustomerAddress: this.addressLists
        }).pipe(catchError((e => {
          alert(e.message)
          return e;
        })))
        .subscribe((e) => {
          this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
        });
      }
    }
  }

  onBack() {
    this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
  }

  onNewAddressInfo() {
    if(this.id > 0){
      this.addressLists.push({ 
        AddressId: 0,
        AddressInfo: this.newAddrInfo,
        CustomerId: this.id
      });
      this.newAddrInfo='';
    }
    else{
      this.addressLists.push({ 
        AddressId: 0,
        AddressInfo: this.newAddrInfo,
        CustomerId: 0
      });
      this.newAddrInfo='';
    }
  }
}
