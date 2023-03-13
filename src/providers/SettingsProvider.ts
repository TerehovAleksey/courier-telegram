import React from 'react';
import {ISettings} from "../models/ISettings";

export const SettingsContext = React.createContext<ISettings | null>(
    null,
);
export const SettingsProvider = SettingsContext.Provider;
