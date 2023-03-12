import React, {useEffect, useState} from 'react';
import {auth} from './firebase/firebase';
import {User} from "firebase/auth";
import {AuthProvider} from "./providers/AuthProvider";
import {Route, Routes} from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import EmptyLayout from "./layouts/EmptyLayout";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

const AppContent = () => {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        console.log('---> AppContent MOUNTED');
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setUser(user);
        });
        return () => {
            console.log('---> AppContent UNMOUNTED')
            unsubscribe();
        }
    }, []);

    //const u: User = {};

    return (
        <AuthProvider value={user}>
            <Routes>
                <Route path="/courier-telegram/" element={<PageLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="history" element={<HistoryPage/>}/>
                    <Route path="settings" element={<SettingsPage/>}/>
                </Route>
                <Route path="/courier-telegram/auth" element={<EmptyLayout/>}>
                    <Route index element={<SignInPage/>}/>
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default AppContent;
