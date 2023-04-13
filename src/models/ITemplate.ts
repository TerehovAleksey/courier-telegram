import {IDeliveryType} from "./IDeliveryType";
import {IPaymentType} from "./IPaymentType";
import {IIdentityModel} from "./IIdentityModel";

export interface ITemplate extends IIdentityModel{
    name: string;
    isDefault: boolean;
    hourCost: number;
    dayMoney: number;
    deliveryTypes: IDeliveryType[];
    paymentTypes: IPaymentType[];
}
