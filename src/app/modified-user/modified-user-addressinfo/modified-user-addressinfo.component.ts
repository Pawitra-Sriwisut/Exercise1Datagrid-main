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
  addressEdit: string;
  tmp: CustomerAddress;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tmp = this.address;
    this.addressEdit = this.address.AddressInfo;
  }

  onEditAddress(address: CustomerAddress){
    console.log(address);
  }

  onDeleteAddress(address){

  }

  onSaveChange(addressChange){
    //console.log(this.addressLists.find(b => b.AddressId === addressChange.AddressId));
    this.address.AddressInfo = addressChange;
  }

  onCloseModal(){
    this.addressEdit = this.address.AddressInfo;
  }

}
