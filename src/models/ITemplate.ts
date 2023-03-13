import {IDeliveryType} from './IDeliveryType';
import {IPaymentType} from './IPaymentType';

export interface ITemplate {
    id: string;
    name: string;
    isDefault: boolean;
    hourCost: number;
    dayMoney: number;
    deliveryTypes: IDeliveryType[];
    paymentTypes: IPaymentType[];
}
