import {collection, query, getDocs} from "firebase/firestore";
import {db} from "./firebase";
import {IDay} from "../models/IDay";

export const getDays = (userId: string) => {
    const daysRef = collection(db, `Days/${userId}/UserDays`);
    const q = query(daysRef);
    return getDocs(q).then(snapshot => {
        const days: IDay[] = [];
        snapshot.docs.forEach(data => {
            const result = data.data();
            const day = {
                ...result,
                startTime: result.startTime.toDate(),
                endTime: result.endTime?.toDate() ?? null,
                //eslint-disable-next-line
                deliveries: result.deliveries.map((d: { dateTime: { toDate: () => any; }; }) => ({
                    ...d,
                    dateTime: d.dateTime.toDate()
                }))
            } as IDay;
            days.push(day);
        });
        return days;
    });
};
