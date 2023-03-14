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
import {ISettings} from "./models/ISettings";
import {SettingsProvider} from "./providers/SettingsProvider";
import {settingsSubscriber} from "./firebase/settingsApi";
import StartDayPage from "./pages/StartDayPage";
import EndDayPage from "./pages/EndDayPage";
import DeliveryPage from "./pages/DeliveryPage";

const AppContent = () => {

    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [settings, setSettings] = useState<ISettings | null>(null);

    useEffect(() => {
        console.log('---> subscribe to user');
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setUser(user);
        });
        return () => {
            console.log('---> unsubscribe from user')
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log('---> subscribe to settings');
            const unsubscribe = settingsSubscriber(user.uid, settings => setSettings(settings));
            return () => {
                console.log('---> unsubscribe from settings');
                unsubscribe();
            };
        }
    }, [user]);

    return (
        <>
            {
                user === undefined ?
                    <PageLoader/> :
                    <AuthProvider value={user}>
                        <SettingsProvider value={settings}>
                            <Routes>
                                <Route path="/courier-telegram/" element={<PageLayout/>}>
                                    <Route index element={<HomePage/>}/>
                                    <Route path="start" element={<StartDayPage/>}/>
                                    <Route path="delivery" element={<DeliveryPage/>}/>
                                    <Route path="end" element={<EndDayPage/>}/>
                                    <Route path="history" element={<HistoryPage/>}/>
                                    <Route path="settings" element={<SettingsPage/>}/>
                                </Route>
                                <Route path="/courier-telegram/auth" element={<EmptyLayout/>}>
                                    <Route index element={<AuthPage/>}/>
                                </Route>
                            </Routes>
                        </SettingsProvider>
                    </AuthProvider>
            }
        </>
    );
};

export default AppContent;
