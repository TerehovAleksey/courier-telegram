import {IDelivery} from './IDelivery';

export interface IDay {
    id: string;
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
