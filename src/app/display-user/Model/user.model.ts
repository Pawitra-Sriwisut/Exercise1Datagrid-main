export class UserSearchParam {
    loadOptions: any;
    CustomerAddress: CustomerAddress[];
    CustomerId: number;
    FirstName: string;
    LastName: string;
  }

  export interface CustomerAddress{
    AddressId: number;
    CustomerId: number;
    AddressInfo: string;
}