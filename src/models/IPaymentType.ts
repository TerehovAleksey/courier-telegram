import {IIdentityModel} from "./IIdentityModel";

export interface IPaymentType extends IIdentityModel {
    name: string;
    isDefault: boolean;
    addToDayCash: boolean;
}
