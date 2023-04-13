import {IDay} from "../models/IDay";
import {ISettings} from "../models/ISettings";
import {IDelivery} from "../models/IDelivery";

const calcProfit = (day: IDay, settings: ISettings, deliveryType: string) => {
    let profit = 0;
    const template = settings.templates.find(t => t.id === day.templateId);
    const type = template?.deliveryTypes.find(t => t.id === deliveryType);
    if (template && type) {
        //deliveries
        profit += day.count * type.cost;

        //hours
        if (day.endTime) {
            const diff = day.endTime.getTime() - day.startTime.getTime();
            const time = diff / (1000 * 60 * 60);
            profit += time * template.hourCost;
        }

        day.dayCost = profit;
    }
};

const calcExpenses = (day: IDay, settings: ISettings) => {
    day.expenses = (day.distance ?? 0) * settings.fuelExpenses / 100 * settings.fuelCost;
};

export const calculateAddDay = (day: IDay, settings: ISettings, deliveryType: string) => {
    calcProfit(day, settings, deliveryType);
    calcExpenses(day, settings);
};

export const calculateAddDelivery = (day: IDay, delivery: IDelivery) => {
    day.count++;
    day.dayCost = fixedRound(day.dayCost + (delivery.deliveryType?.cost ?? 0), 2);
    if (delivery.paymentType?.addToDayCash) {
        day.cashMoney = fixedRound(day.cashMoney + delivery.cost, 2);
    }
    if (day.deliveries) {
        day.deliveries.push(delivery);
    } else {
        day.deliveries = [delivery];
    }
};

export const calculateUpdateDelivery = (day: IDay, delivery: IDelivery) => {
    const edited = day.deliveries.find(d => d.id === delivery.id);
    if (edited) {
        //если изменился тип доставки - поменялся заработок за день
        if (edited.deliveryType !== delivery.deliveryType) {
            day.dayCost = fixedRound(day.dayCost - (edited.deliveryType?.cost ?? 0), 2);
            day.dayCost = fixedRound(day.dayCost + (delivery.deliveryType?.cost ?? 0), 2);
        }
        //если изменился тип оплаты, то проверяем изменилось ли условие "наличные дня"
        if (edited.paymentType?.addToDayCash !== delivery.paymentType?.addToDayCash) {
            if(delivery.paymentType?.addToDayCash){
                day.cashMoney = fixedRound(day.cashMoney + delivery.cost, 2);
            }else{
                day.cashMoney = fixedRound(day.cashMoney - edited.cost, 2);
            }
        }
        edited.cost = delivery.cost;
        edited.deliveryType = delivery.deliveryType;
        edited.dateTime = delivery.dateTime;
        edited.number = delivery.number;
        edited.note = delivery.note;
        edited.paymentType = delivery.paymentType;
        edited.address = delivery.address;
    }
};

export const calculateRemoveDelivery = (day: IDay, deliveryId: string) => {
    const delivery = day.deliveries.find(d => d.id === deliveryId);
    if (delivery) {
        day.count--;
        day.dayCost = fixedRound(day.dayCost - (delivery.deliveryType?.cost ?? 0), 2);
        if (delivery.paymentType?.addToDayCash) {
            day.cashMoney = fixedRound(day.cashMoney - delivery.cost, 2);
        }
        day.deliveries = day.deliveries.filter(d => d.id !== deliveryId);
    }
};

export const fixedRound = (N: number, n: number) => Math.round(N * Math.pow(10, n)) / Math.pow(10, n);
