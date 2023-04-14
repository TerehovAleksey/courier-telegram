import {ITemplate} from "./ITemplate";

export interface ISettings {
    fuelCost: number;
    fuelExpenses: number;
    templates: ITemplate[];
    currency: string;
}
