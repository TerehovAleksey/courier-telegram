import {collection, query, where, doc, updateDoc, deleteDoc, setDoc, getDocs} from "firebase/firestore";
import {db} from "./firebase";
import {IDay} from "../models/IDay";

export const getCurrentDay = (userId: string) => {
    const daysRef = collection(db, `Days/${userId}/UserDays`);
    const q = query(daysRef, where("endTime", "==", null));
    return getDocs(q).then(snapshot => {
        const data = snapshot.docs[0]?.data();
        return data ? {
            ...data, startTime: data.startTime.toDate(), endTime: data.endTime?.toDate() ?? null,
            //eslint-disable-next-line
            deliveries: data.deliveries.map((d: { dateTime: { toDate: () => any; }; }) => ({
                ...d,
                dateTime: d.dateTime.toDate()
            }))
        } as IDay : null;
    });
};

export const createDay = (userId: string, day: IDay) => {
    const docRef = doc(db, "Days", userId, "UserDays", day.id);
    return setDoc(docRef, day);
};

export const updateDay = (userId: string, day: IDay) => {
    const docRef = doc(db, "Days", userId, "UserDays", day.id);
    return updateDoc(docRef, {...day});
};

export const deleteDay = (userId: string, dayId: string) => {
    const docRef = doc(db, "Days", userId, "UserDays", dayId);
    return deleteDoc(docRef);
};

export const reOpenDay = (userId: string, dayId: string) => {
    const docRef = doc(db, "Days", userId, "UserDays", dayId);
    return updateDoc(docRef, {endTime: null});
};
