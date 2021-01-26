import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomerAddress } from 'src/app/customer-address.model';

@Component({
  selector: 'app-modified-user-addressinfo',
  templateUrl: './modified-user-addressinfo.component.html',
  styleUrls: ['./modified-user-addressinfo.component.css']
})
export class ModifiedUserAddressinfoComponent implements OnInit {
  @Input() address: CustomerAddress;
  @Input() addressLists: any[];
  @Input() removeAddrId: any[];
  //addressEdit: string;
  indexOf: number;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onDeleteAddress(address){
    console.log(this.addressLists);
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
  }

  onSaveChange(addressChange: HTMLInputElement){
    this.address.AddressInfo = addressChange.value;
  }

}
