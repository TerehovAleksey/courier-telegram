import {useContext} from "react";
import {SettingsContext} from "../providers/SettingsProvider";

export const useSettings = () => useContext(SettingsContext);
