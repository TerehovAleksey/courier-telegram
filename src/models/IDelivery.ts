import {IPaymentType} from "./IPaymentType";
import {IDeliveryType} from "./IDeliveryType";
import {IIdentityModel} from "./IIdentityModel";

export interface IDelivery extends IIdentityModel{
    number: string | null;
    address: string | null;
    dateTime: Date;
    cost: number;
    deliveryType: IDeliveryType | null;
    paymentType: IPaymentType | null;
    note: string | null;
}
