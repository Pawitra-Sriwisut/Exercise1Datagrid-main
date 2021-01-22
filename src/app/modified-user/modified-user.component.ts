import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerAddress } from '../customer-address.model';

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
  indexAddress = [];
  indexDeleteAddress: number;
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
  }

  onGetData() {
    this.http.get('https://localhost:44349/api/values/' + this.id).subscribe((data: Customer) => {
      this.firstName = data.FirstName;
      this.lastName = data.LastName;
      this.addressLists = data.CustomerAddress;
    });
  }

  onSave() {
    var postConfirm = confirm("Do you want to save?");
    if (postConfirm) {
      this.http.post('https://localhost:44349/api/values/postSave', {
        Data: {
          CustomerId: this.id,
          FirstName: this.firstName,
          LastName: this.lastName,
          CustomerAddress: this.addressLists
        },
        ListOfId: this.indexAddress
      })
        .subscribe();
      this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
    }
  }

  onBack() {
    this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
  }

  onNewAddressInfo() {
    var addAddrConfirm = confirm("Do you want to save?");
    if (addAddrConfirm) {
      this.http.post('https://localhost:44349/api/values/addAddr', {
        id: this.id,
        newAddr: this.newAddrInfo
      })
        .subscribe((data: CustomerAddress) => {
          this.addressLists.push(data);
        });
        this.newAddrInfo='';
    }
  }

}
