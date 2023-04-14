import React, {useContext, useEffect, useMemo, useState} from "react";
import GeneralCard from "./components/GeneralCard";
import {Space} from "antd";
import FilterCard from "./components/FilterCard";
import {getDays} from "../../firebase/historyApi";
import {AuthContext} from "../../providers/AuthProvider";
import {IDay} from "../../models/IDay";
import SelectorCard from "./components/SelectorCard";
import {useAdapter} from "../../hooks/useAdapter";

const DEFAULT_KEY = "all";

const HistoryPage = () => {

    const user = useContext(AuthContext);
    const [templateId, setTemplateId] = useState(DEFAULT_KEY);
    const [days, setDays] = useState<IDay[] | null>(null);

    const {showConfirm, showNotification} = useAdapter();

    useEffect(() => {
        if (user) {
            getDays(user.uid).then(result => setDays(result));
        }
    }, []);

    const filtered = useMemo(() => {
        if (templateId === DEFAULT_KEY) {
            return days ?? [];
        } else {
            return days?.filter(d => d.templateId === templateId) ?? [];
        }
    }, [templateId, days]);

    const deleteDay = (dayId: string) => {
        showConfirm("Вы уверены, что хотите удалить день?", () => {
            console.log(dayId);
            showNotification("В разработке!");
        });
    };

    const reopenDay = (dayId: string) => {
        showConfirm("Вы уверены, что хотите переоткрыть день?", () => {
            //проверить, есть ли открытый день
            console.log(dayId);
            showNotification("В разработке!");
        });
    };

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <SelectorCard defaultKey={DEFAULT_KEY} onSelect={setTemplateId}/>
            <GeneralCard days={filtered}/>
            <FilterCard days={filtered} reopenDay={reopenDay} deleteDay={deleteDay}/>
        </Space>
    );
};

export default HistoryPage;
