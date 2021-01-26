import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modified-user-modal',
  templateUrl: './modified-user-modal.component.html',
  styleUrls: ['./modified-user-modal.component.css']
})
export class ModifiedUserModalComponent implements OnInit {
  @Input() addressLists: any[];
  count: any;

  constructor() { }

  ngOnInit(): void {
    this.count = 0;
  }

  onSaveEditAddress(){
    this.addressLists.forEach((c: any) => {
      if(c.AddressInfo != null){
        c.AddressInfo = (<HTMLInputElement>document.getElementById("inputID"+this.count)).value;
      }
      this.count++;
    })
    this.count = 0;
  }
}
