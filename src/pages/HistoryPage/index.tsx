import React, {useContext, useEffect, useMemo, useState} from "react";
import GeneralCard from "./components/GeneralCard";
import {Space} from "antd";
import FilterCard from "./components/FilterCard";
import {getDays} from "../../firebase/historyApi";
import {AuthContext} from "../../providers/AuthProvider";
import {IDay} from "../../models/IDay";
import SelectorCard from "./components/SelectorCard";

const DEFAULT_KEY = "all";

const HistoryPage = () => {

    const user = useContext(AuthContext);
    const [templateId, setTemplateId] = useState(DEFAULT_KEY);
    const [days, setDays] = useState<IDay[] | null>(null);

    useEffect(() => {
        if (user) {
            getDays(user.uid).then(result => setDays(result));
        }
    }, []);

    const filtered: IDay[] = useMemo(() => {
        if (templateId === DEFAULT_KEY) {
            return days ?? [];
        } else {
            return days?.filter(d => d.templateId === templateId) ?? [];
        }
    }, [templateId, days]);


    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <SelectorCard defaultKey={DEFAULT_KEY} onSelect={setTemplateId}/>
            <GeneralCard days={filtered}/>
            <FilterCard days={filtered}/>
        </Space>
    );
};

export default HistoryPage;
