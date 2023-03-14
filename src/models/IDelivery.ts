import {IPaymentType} from './IPaymentType';
import {IDeliveryType} from './IDeliveryType';

export interface IDelivery {
    id: string;
    number: string | null;
    address: string | null;
    dateTime: Date;
    cost: number;
    deliveryType: IDeliveryType | null;
    paymentType: IPaymentType | null;
    note: string | null;
}
