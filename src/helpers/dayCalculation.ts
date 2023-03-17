import {IDay} from "../models/IDay";
import {ISettings} from "../models/ISettings";

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
}

const calcExpenses = (day: IDay, settings: ISettings) => {
    day.expenses = (day.distance ?? 0) * settings.fuelExpenses / 100 * settings.fuelCost;
}

export const calculateAddDay = (day: IDay, settings: ISettings, deliveryType: string) => {
    calcProfit(day, settings, deliveryType);
    calcExpenses(day, settings);
}

export const fixedRound = (N: number, n: number) => Math.round(N * Math.pow(10, n)) / Math.pow(10, n);
