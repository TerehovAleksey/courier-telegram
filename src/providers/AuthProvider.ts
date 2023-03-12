import React from 'react';
import {User} from "firebase/auth";

export const AuthContext = React.createContext<User | null>(
    null,
);
export const AuthProvider = AuthContext.Provider;
