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
  @Input() indexAddress: any[];
  addressEdit: string;
  index: number;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.addressEdit = this.address.AddressInfo;
  }

  onDeleteAddress(address){
    this.index = this.addressLists.indexOf(address);
    this.indexAddress.push(address.AddressId);
    if (this.index > -1) {
      this.addressLists.splice(this.index, 1);
    }
  }

  onSaveChange(addressChange){
    this.address.AddressInfo = addressChange;
  }

  onCloseModal(){
    this.addressEdit = this.address.AddressInfo;
  }

}
