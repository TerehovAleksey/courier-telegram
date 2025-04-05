import React, {useEffect, useMemo, useState} from "react";
import GeneralCard from "./components/GeneralCard";
import {Space} from "antd";
import FilterCard from "./components/FilterCard";
import {getDays} from "../../firebase/historyApi";
import {IDay} from "../../models/IDay";
import SelectorCard from "./components/SelectorCard";
import {useAdapter} from "../../hooks/useAdapter";
import {deleteDay, getCurrentDay, reOpenDay} from "../../firebase/dayApi";
import {useUser} from "../../hooks/useUser";

const DEFAULT_KEY = "all";

const HistoryPage = () => {

    const user = useUser();
    const [templateId, setTemplateId] = useState(DEFAULT_KEY);
    const [days, setDays] = useState<IDay[] | null>(null);

    const {showConfirm, showNotification} = useAdapter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        if (user) {
            getDays(user.uid).then(result =>
                setDays(result)
            );
        }
    };

    const filtered = useMemo(() => {
        if (templateId === DEFAULT_KEY) {
            return days ?? [];
        } else {
            return days?.filter(d => d.templateId === templateId) ?? [];
        }
    }, [templateId, days]);

    const delDay = (dayId: string) => {
        showConfirm("Вы уверены, что хотите удалить день?", () => {
            if (user) {
                deleteDay(user.uid, dayId)
                    .then(() => {
                        showNotification("Запись уделена!");
                        loadData();
                    });
            }

        });
    };

    const reopenDay = (dayId: string) => {
        showConfirm("Вы уверены, что хотите переоткрыть день?", () => {
            if (user) {
                getCurrentDay(user.uid)
                    .then(response => {
                        if (response) {
                            showNotification("На данный момент есть открытый день! Закройте его и повторите попытку.");
                        } else {
                            reOpenDay(user.uid, dayId)
                                .then(() => {
                                    showNotification("День переоткрыт! Перейдите на главный экран для просмотра и редактирования");
                                });
                        }
                    });
            }
        });
    };

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <SelectorCard defaultKey={DEFAULT_KEY} onSelect={setTemplateId}/>
            <GeneralCard days={filtered}/>
            <FilterCard days={filtered} reopenDay={reopenDay} deleteDay={delDay}/>
        </Space>
    );
};

export default HistoryPage;
