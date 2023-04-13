import {doc, setDoc} from "firebase/firestore";
import {db} from "./firebase";

export const setTgUser = (userId: string, tgUser: WebAppUser) => {
    const docRef = doc(db, "TgUsers", userId);
    return setDoc(docRef, tgUser);
};
