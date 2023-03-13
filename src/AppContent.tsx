import React, {useEffect, useState} from 'react';
import {auth} from './firebase/firebase';
import {User} from "firebase/auth";
import {AuthProvider} from "./providers/AuthProvider";
import {Route, Routes} from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import HomePage from "./pages/HomePage";
import EmptyLayout from "./layouts/EmptyLayout";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import PageLoader from './components/PageLoader';
import AuthPage from "./pages/AuthPage";

const AppContent = () => {

    const [user, setUser] = useState<User | null | undefined>(undefined);

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

    return (
        <>
            {
                user === undefined ?
                    <PageLoader/> :
                    <AuthProvider value={user}>
                        <Routes>
                            <Route path="/courier-telegram/" element={<PageLayout/>}>
                                <Route index element={<HomePage/>}/>
                                <Route path="history" element={<HistoryPage/>}/>
                                <Route path="settings" element={<SettingsPage/>}/>
                            </Route>
                            <Route path="/courier-telegram/auth" element={<EmptyLayout/>}>
                                <Route index element={<AuthPage/>}/>
                            </Route>
                        </Routes>
                    </AuthProvider>
            }
        </>
    );
};

export default AppContent;
