import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Customer, NewIdAddress } from '../customer.model';
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
  AddrInfo: NewIdAddress;
  removeAddrId = [];
  newAddrInfo = '';
  dataSourceAddr: DataSource;
  indexOf: number;

  newIdAddrInfos: NewIdAddress[];
  countNewId: number;
  newIdAddrInfo: NewIdAddress;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {

    this.addressLists = [];
    this.newIdAddrInfos = [];

    this.newIdAddrInfo = new NewIdAddress();

    this.AddrInfo = new NewIdAddress();

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
          this.newIdAddrInfos.push({
            customerAddr: item,
            newIdAddr: -1
          })
        })
        console.log(this.newIdAddrInfos)
        this.dataSourceAddr = new DataSource({
          //store: this.addressLists
          store: this.newIdAddrInfos
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
      this.newIdAddrInfos.push({
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
      this.newIdAddrInfos.push({
        customerAddr: this.addressLists[this.addressLists.length - 1],
        newIdAddr: this.countNewId
      })
      this.countNewId++;
      this.newAddrInfo = '';
    }
    this.dataSourceAddr = new DataSource({
      //store: this.addressLists
      store: this.newIdAddrInfos
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

  onDeleteAddr(address: NewIdAddress) {
    if(address.customerAddr.AddressId > 0){
      this.indexOf = this.newIdAddrInfos.indexOf(address);
      this.removeAddrId.push(address.customerAddr.AddressId);
      if (this.indexOf > -1) {
        this.newIdAddrInfos.splice(this.indexOf, 1);
        this.addressLists.splice(this.indexOf, 1);
      }
    }
    else{
      this.indexOf = this.newIdAddrInfos.indexOf(address);
      if (this.indexOf > -1) {
        this.newIdAddrInfos.splice(this.indexOf, 1);
        this.addressLists.splice(this.indexOf, 1);
      }
    }
    this.dataSourceAddr = new DataSource({
      //store: this.addressLists
      store: this.newIdAddrInfos
    });

    //console.log(this.addressLists);
  }

  openModal(template: TemplateRef<any>, data: any) {
    //console.log(this.countNewId);
    this.AddrInfo = {...data}; // fix two-way
    
    this.newIdAddrInfo.customerAddr = {...this.AddrInfo.customerAddr}
    this.newIdAddrInfo.newIdAddr = this.AddrInfo.newIdAddr;
    console.log(this.AddrInfo);
    console.log(this.newIdAddrInfo);


    this.modalRef = this.modalService.show(template);
  }

  onSaveNewAddrInfo() {
    this.newIdAddrInfos.forEach(item => {
      if(item.customerAddr.AddressId > 0){
        if (item.customerAddr.AddressId == this.newIdAddrInfo.customerAddr.AddressId) {
          item.customerAddr.AddressInfo =  this.newIdAddrInfo.customerAddr.AddressInfo;
        }
      }
      else{
        if(item.newIdAddr == this.newIdAddrInfo.newIdAddr){
          item.customerAddr.AddressInfo = this.newIdAddrInfo.customerAddr.AddressInfo;
        }
      }
    });

    //console.log(this.addressLists);
    console.log(this.newIdAddrInfos);
    this.modalRef.hide();
  }
}
