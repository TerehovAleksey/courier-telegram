import {IIdentityModel} from "./IIdentityModel";

export interface IDeliveryType extends IIdentityModel{
    name: string;
    isDefault: boolean;
    cost: number;
}
