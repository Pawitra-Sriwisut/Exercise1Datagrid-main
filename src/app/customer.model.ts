import { CustomerAddress } from "./customer-address.model";

export interface Customer{
    CustomerAddress: CustomerAddress[];
    CustomerId: number;
    FirstName: string;
    LastName: string;
}