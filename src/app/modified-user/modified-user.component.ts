import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer, NewCustomerAddress } from '../customer.model';
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
  newAddrInfo = '';
  addressLists: CustomerAddress[];
  dataSourceAddr: DataSource;
  indexOfAddr: number;
  removeAddrId = [];

  newAddrList: NewCustomerAddress[];
  newAddr: NewCustomerAddress;
  countNewId: number;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {

    this.addressLists = [];
    this.newAddrList = [];
    this.newAddr = new NewCustomerAddress();
    this.countNewId = 0;

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
    })
      .subscribe((data: Customer) => {
        this.firstName = data.FirstName;
        this.lastName = data.LastName;
        this.addressLists = data.CustomerAddress;
        this.addressLists.forEach(item => {
          this.newAddrList.push({
            customerAddr: item,
            newIdAddr: -1
          })
        })
        this.dataSourceAddr = new DataSource({
          //store: this.addressLists
          store: this.newAddrList
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
      this.newAddrList.push({
        customerAddr: this.addressLists[this.addressLists.length - 1],
        newIdAddr: this.countNewId
      })
      this.countNewId++;
      this.newAddrInfo = '';
    }
    else {
      this.addressLists.push({
        AddressId: 0,
        AddressInfo: this.newAddrInfo,
        CustomerId: 0
      });
      this.newAddrList.push({
        customerAddr: this.addressLists[this.addressLists.length - 1],
        newIdAddr: this.countNewId
      })
      this.countNewId++;
      this.newAddrInfo = '';
    }
    this.dataSourceAddr = new DataSource({
      //store: this.addressLists
      store: this.newAddrList
    });
  }

  // onDeleteAddr(address: CustomerAddress) {
  //   if(address.AddressId > 0){
  //     this.indexOf = this.addressLists.indexOf(address);
  //     this.removeAddrId.push(address.AddressId);
  //     if (this.indexOf > -1) {
  //       this.addressLists.splice(this.indexOf, 1);
  //     }
  //   }
  //   else{
  //     this.indexOf = this.addressLists.indexOf(address);
  //     if (this.indexOf > -1) {
  //       this.addressLists.splice(this.indexOf, 1);
  //     }
  //   }
  //   this.dataSourceAddr = new DataSource({
  //     //store: this.addressLists
  //     store: this.newIdAddrInfos
  //   });
  // }

  onDeleteAddr(address: NewCustomerAddress) {
    if(address.customerAddr.AddressId > 0){
      this.indexOfAddr = this.newAddrList.indexOf(address);
      this.removeAddrId.push(address.customerAddr.AddressId);
      if (this.indexOfAddr > -1) {
        this.newAddrList.splice(this.indexOfAddr, 1);
        this.addressLists.splice(this.indexOfAddr, 1);
      }
    }
    else{
      this.indexOfAddr = this.newAddrList.indexOf(address);
      if (this.indexOfAddr > -1) {
        this.newAddrList.splice(this.indexOfAddr, 1);
        this.addressLists.splice(this.indexOfAddr, 1);
      }
    }
    this.dataSourceAddr = new DataSource({
      //store: this.addressLists
      store: this.newAddrList
    });

  }

  openModal(template: TemplateRef<any>, data: NewCustomerAddress) {
    // this.newAddr.customerAddr = {...this.AddrInfo.customerAddr}
    // this.newAddr.newIdAddr = this.AddrInfo.newIdAddr;

    this.newAddr.customerAddr = {...data.customerAddr}
    this.newAddr.newIdAddr = data.newIdAddr;

    this.modalRef = this.modalService.show(template);
  }

  onSaveNewAddrInfo() {
    this.newAddrList.forEach(item => {
      if(item.customerAddr.AddressId > 0){
        if (item.customerAddr.AddressId == this.newAddr.customerAddr.AddressId) {
          item.customerAddr.AddressInfo =  this.newAddr.customerAddr.AddressInfo;
        }
      }
      else{
        if(item.newIdAddr == this.newAddr.newIdAddr){
          item.customerAddr.AddressInfo = this.newAddr.customerAddr.AddressInfo;
        }
      }
    });

    this.modalRef.hide();
  }
}
