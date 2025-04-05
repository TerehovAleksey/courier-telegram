import React from "react";
import {auth} from "../../firebase/firebase";
import GeneralCard from "./components/GeneralCard";
import {Button, Space} from "antd";
import TemplatesCard from "./components/TemplatesCard";
import {useAdapter} from "../../hooks/useAdapter";
import {useUser} from "../../hooks/useUser";
import {getDays} from "../../firebase/historyApi";
import {getSettings} from "../../firebase/settingsApi";

const SettingsPage = () => {

    const {showConfirm} = useAdapter();
    const user = useUser();

    const download = () => {
        if (user) {
            getSettings(user.uid).then(settings => {

                    getDays(user.uid).then(days => {

                        const result = {
                            "settings": settings,
                            "days": days
                        };

                        // Преобразование данных в JSON-строку
                        const jsonString = JSON.stringify(result, null, 2);

                        // Создание Blob из строки
                        const blob = new Blob([jsonString], {type: "application/json"});

                        // Создание временной ссылки
                        const url = URL.createObjectURL(blob);

                        // Создание элемента <a> для скачивания
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "data.json";
                        document.body.appendChild(link);
                        link.click();

                        // Удаление ссылки
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                    });
                }
            );
        }
    };

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <GeneralCard/>
            <TemplatesCard/>
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button type="primary" onClick={download}>Скачать данные</Button>
            </div>
            <Button type="text" danger style={{width: "100%"}}
                    onClick={() => showConfirm("Вы уверены, что хотите выйти?", () => auth.signOut())}>Выход</Button>
        </Space>
    );
};

export default SettingsPage;
