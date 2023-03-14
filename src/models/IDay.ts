import {IDelivery} from './IDelivery';

export interface IDay {
    id: string;
    startTime: Date;
    endTime: Date | null;
    count: number;
    dayCost: number;
    dayMoney: number;
    cashMoney: number;
    templateId: string;
    deliveries: IDelivery[];
    note: string | null;
    distance: number | null;
    expenses: number | null;
}
