import React from "react";
import ThemeProvider from "./providers/ThemeProvider";
import {App as AntdApp} from 'antd';
import {HashRouter, Route, Routes} from "react-router-dom";
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
import TemplatePage from "./pages/TemplatePage";
import DayPage from "./pages/DayPage";
import NotFoundPage from "./pages/NotFoundPage";
import dayjs from "dayjs";
import 'dayjs/locale/ru.js';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);
dayjs.updateLocale('ru', {
    weekStart: 1,
});

function App() {
    return (
        <ThemeProvider>
            <AntdApp>
                <HashRouter basename="/courier-telegram">
                    <Routes>
                        <Route path="/" element={<PageLayout/>}>
                            <Route index element={<HomePage/>}/>
                            <Route path="start" element={<StartDayPage/>}/>
                            <Route path="delivery" element={<DeliveryPage/>}/>
                            <Route path="day" element={<DayPage/>}/>
                            <Route path="end" element={<EndDayPage/>}/>
                            <Route path="history" element={<HistoryPage/>}/>
                            <Route path="settings" element={<SettingsPage/>}/>
                            <Route path="settings/template" element={<TemplatePage/>}/>
                            <Route path="/*" element={<NotFoundPage/>}/>
                        </Route>
                        <Route path="/" element={<EmptyLayout/>}>
                            <Route path="login" element={<LoginPage/>}/>
                            <Route path="register" element={<RegisterPage/>}/>
                        </Route>
                    </Routes>
                </HashRouter>
            </AntdApp>
        </ThemeProvider>
    )
}

export default App
