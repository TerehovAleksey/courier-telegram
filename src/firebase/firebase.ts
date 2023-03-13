import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore, collection, addDoc, doc, getDocs, getDoc, setDoc, onSnapshot} from "firebase/firestore";
import {ISettings} from "../models/ISettings";
import uuid from "react-uuid";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DB_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const auth = getAuth(app);

const createSettings = (userId: string) => {
    const data: ISettings = {
        fuelCost: 2.45,
        fuelExpenses: 8,
        templates: [
            {
                id: uuid(),
                name: 'Yandex-доставка',
                isDefault: true,
                dayMoney: 80,
                hourCost: 2.02,
                deliveryTypes: [
                    {
                        id: uuid(),
                        name: 'Драйвер',
                        isDefault: true,
                        cost: 2.15,
                    },
                ],
                paymentTypes: [
                    {
                        id: uuid(),
                        name: 'Наличные',
                        isDefault: false,
                        addToDayCash: true,
                    },
                    {
                        id: uuid(),
                        name: 'Карта',
                        isDefault: false,
                        addToDayCash: false,
                    },
                    {
                        id: uuid(),
                        name: 'Оплачено на сайте',
                        isDefault: true,
                        addToDayCash: false,
                    },
                ],
            },
        ],
    };
    return setDoc(doc(db,'Settings', userId), data);
}

// export const getSettings = (userId: string) => {
//     const settingsDoc = doc(db, `Settings/${userId}`);
//     return getDoc(settingsDoc).then(snapshot => snapshot.data());
// }

export const settingsSubscriber = (userId: string, onSettingsChanged: (settings: ISettings | null) => void,) => {
    const settingsDoc = doc(db, `Settings/${userId}`);
    return onSnapshot(settingsDoc, (snapshot) => {
        if (snapshot.data() === undefined) {
            createSettings(userId);
        }
        onSettingsChanged(snapshot.data() as ISettings ?? null)
    });
}
