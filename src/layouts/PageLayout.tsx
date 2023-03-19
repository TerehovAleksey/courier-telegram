import React, {useEffect, useState} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {AuthProvider} from "../providers/AuthProvider";
import {Layout} from "antd";
import PageContainer from "../components/PageContainer";
import MainMenu from "../components/MainMenu";
import {User} from "firebase/auth";
import {ISettings} from "../models/ISettings";
import {auth} from "../firebase/firebase";
import {tgEnabled, tgUser} from "../helpers/telegram";
import {setTgUser} from "../firebase/userApi";
import {settingsSubscriber} from "../firebase/settingsApi";
import PageLoader from "../components/PageLoader";
import {SettingsProvider} from "../providers/SettingsProvider";
import PageFooter from "../components/PageFooter";

const {Header, Content} = Layout;

const PageLayout = () => {

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
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: 0, display: 'flex'}}>
                <MainMenu/>
            </Header>
            <Content>
                <PageContainer>
                    {user === undefined && <PageLoader/>}
                    {user === null && <Navigate to="/login"/>}
                    {user &&
                        <AuthProvider value={user}>
                            <SettingsProvider value={settings}>
                                <Outlet/>
                            </SettingsProvider>
                        </AuthProvider>
                    }
                </PageContainer>
            </Content>
            <PageFooter user={user?.email}/>
        </Layout>
    );
};

export default PageLayout;
