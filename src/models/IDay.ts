import {IDelivery} from "./IDelivery";
import {IIdentityModel} from "./IIdentityModel";

export interface IDay extends IIdentityModel {
    startTime: Date;
    endTime: Date | null;
    count: number;
    //оплата за доставки
    dayCost: number;
    //чаевые
    dayMoney: number;
    //разменка
    cashMoney: number;
    templateId: string;
    deliveries: IDelivery[];
    note: string | null;
    distance: number | null;
    expenses: number | null;
}
