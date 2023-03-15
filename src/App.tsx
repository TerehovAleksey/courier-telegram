import React, {useEffect, useState} from "react";
import 'dayjs/locale/ru.js';
import ThemeProvider from "./providers/ThemeProvider";
import {App as AntdApp} from 'antd';
import PageLoader from "./components/PageLoader";
import {AuthProvider} from "./providers/AuthProvider";
import {SettingsProvider} from "./providers/SettingsProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PageLayout from "./layouts/PageLayout";
import HomePage from "./pages/HomePage";
import StartDayPage from "./pages/StartDayPage";
import DeliveryPage from "./pages/DeliveryPage";
import EndDayPage from "./pages/EndDayPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import EmptyLayout from "./layouts/EmptyLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {User} from "firebase/auth";
import {ISettings} from "./models/ISettings";
import {auth} from "./firebase/firebase";
import {settingsSubscriber} from "./firebase/settingsApi";
import {tgEnabled, tgUser} from "./helpers/telegram";
import {setTgUser} from "./firebase/userApi";
import TemplatePage from "./pages/TemplatePage";
import DayPage from "./pages/DayPage";

function App() {

    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [settings, setSettings] = useState<ISettings | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            if (tgEnabled && tgUser) {
                setTgUser(user.uid, tgUser);
            }
            const unsubscribe = settingsSubscriber(user.uid, settings => setSettings(settings));
            return () => unsubscribe();
        }
    }, [user]);

    return (
        <ThemeProvider>
            <AntdApp>
                {
                    user === undefined ?
                        <PageLoader/> :
                        <AuthProvider value={user}>
                            <SettingsProvider value={settings}>
                                <BrowserRouter>
                                    <Routes>
                                        <Route path="/courier-telegram" element={<PageLayout/>}>
                                            <Route index element={<HomePage/>}/>
                                            <Route path="start" element={<StartDayPage/>}/>
                                            <Route path="delivery" element={<DeliveryPage/>}/>
                                            <Route path="day" element={<DayPage/>}/>
                                            <Route path="end" element={<EndDayPage/>}/>
                                            <Route path="history" element={<HistoryPage/>}/>
                                            <Route path="settings" element={<SettingsPage/>}/>
                                            <Route path="settings/template" element={<TemplatePage/>}/>
                                        </Route>
                                        <Route path="/courier-telegram/" element={<EmptyLayout/>}>
                                            <Route path="login" element={<LoginPage/>}/>
                                            <Route path="register" element={<RegisterPage/>}/>
                                        </Route>
                                    </Routes>
                                </BrowserRouter>
                            </SettingsProvider>
                        </AuthProvider>
                }
            </AntdApp>
        </ThemeProvider>
    )
}

export default App
