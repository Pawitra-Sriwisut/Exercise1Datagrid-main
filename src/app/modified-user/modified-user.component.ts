import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer } from '../customer.model';
import { CustomerAddress } from '../customer-address.model';
import { catchError } from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
@Component({
  selector: 'app-modified-user',
  templateUrl: './modified-user.component.html',
  styleUrls: ['./modified-user.component.css']
})
export class ModifiedUserComponent implements OnInit {
  modalRef: BsModalRef;
  editMode = false;
  id: number;
  firstName = '';
  lastName = '';
  addressLists: CustomerAddress[];
  AddrInfo: CustomerAddress;
  removeAddrId = [];
  newAddrInfo = '';
  dataSourceAddr: DataSource;
  indexOf: number;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {

    this.addressLists = [];

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
    this.http.post('https://localhost:44349/api/values/QueryAddress', {
        CustomerId: this.id
        // FirstName: this.firstName,
        // LastName: this.lastName,
        // CustomerAddress: this.addressLists
    })
      .subscribe((data: Customer) => {
        this.firstName = data.FirstName;
        this.lastName = data.LastName;
        this.addressLists = data.CustomerAddress;
        this.dataSourceAddr = new DataSource({
          store: this.addressLists
        })
      });
  }

  onSave() {
    if (this.id > 0) {
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
        }).pipe(catchError((e) => {
          alert(e.error.ExceptionMessage)
          return e;
        }))
          .subscribe((e) => {
            //completed
            this.router.navigate(['../', 'display-user'], { relativeTo: this.activatedRoute });
          });
      }
    }
    else {
      var postConfirm = confirm("Do you want to save?");
      if (postConfirm) {
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
    if (this.id > 0) {
      this.addressLists.push({
        AddressId: 0,
        AddressInfo: this.newAddrInfo,
        CustomerId: this.id
      });
      this.newAddrInfo = '';
    }
    else {
      this.addressLists.push({
        AddressId: 0,
        AddressInfo: this.newAddrInfo,
        CustomerId: 0
      });
      this.newAddrInfo = '';
    }
    this.dataSourceAddr = new DataSource({
      store: this.addressLists
    });
  }

  onDeleteAddr(address: CustomerAddress) {
    if(address.AddressId > 0){
      this.indexOf = this.addressLists.indexOf(address);
      this.removeAddrId.push(address.AddressId);
      if (this.indexOf > -1) {
        this.addressLists.splice(this.indexOf, 1);
      }
    }
    else{
      this.indexOf = this.addressLists.indexOf(address);
      if (this.indexOf > -1) {
        this.addressLists.splice(this.indexOf, 1);
      }
    }
    this.dataSourceAddr = new DataSource({
      store: this.addressLists
    });
  }

  openModal(template: TemplateRef<any>, data: any) {
    this.AddrInfo = { ...data }; // fix two-way
    this.modalRef = this.modalService.show(template);
  }

  onSaveNewAddrInfo() {
    this.addressLists.forEach(item => {
      if (item.AddressId == this.AddrInfo.AddressId) {
        item.AddressInfo =  this.AddrInfo.AddressInfo;
      }
    });
    this.modalRef.hide();
  }
}
