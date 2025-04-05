import {ISettings} from "../models/ISettings";
import uuid from "react-uuid";
import {collection, doc, getDocs, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {db} from "./firebase";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createSettings = (userId: string) => {
    const data: ISettings = {
        fuelCost: 2.45,
        fuelExpenses: 8,
        currency: "руб.",
        templates: [
            {
                id: uuid(),
                name: "Yandex-доставка",
                isDefault: true,
                dayMoney: 80,
                hourCost: 2.02,
                deliveryTypes: [
                    {
                        id: uuid(),
                        name: "Драйвер",
                        isDefault: true,
                        cost: 2.15,
                    },
                ],
                paymentTypes: [
                    {
                        id: uuid(),
                        name: "Наличные",
                        isDefault: false,
                        addToDayCash: true,
                    },
                    {
                        id: uuid(),
                        name: "Карта",
                        isDefault: false,
                        addToDayCash: false,
                    },
                    {
                        id: uuid(),
                        name: "Оплачено на сайте",
                        isDefault: true,
                        addToDayCash: false,
                    },
                ],
            },
        ],
    };
    return setDoc(doc(db, "Settings", userId), data);
};

export const getSettings = (userId: string) => {
    const settingsRef = collection(db, "Settings");
    const q = query(settingsRef, where("__name__", "==", userId));
    return getDocs(q).then(snapshot => {
        const data = snapshot.docs[0]?.data();
        return data ? {...data} as ISettings : null;
    });
};

export const settingsSubscriber = (userId: string, onSettingsChanged: (settings: ISettings | null) => void,) => {
    const settingsDoc = doc(db, `Settings/${userId}`);
    return onSnapshot(settingsDoc, (snapshot) => {
        // иногда затирает данные
        // if (snapshot.data() === undefined) {
        //     createSettings(userId);
        // }
        onSettingsChanged(snapshot.data() as ISettings ?? null);
    });
};

export const updateSettings = (userId: string, settings: ISettings) => setDoc(doc(db, "Settings", userId), settings);
