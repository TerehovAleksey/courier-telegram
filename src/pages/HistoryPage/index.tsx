import React, {useContext, useEffect, useState} from 'react';
import GeneralCard from "./components/GeneralCard";
import {Card, Form, Select, Space} from "antd";
import FilterCard from "./components/FilterCard";
import {SettingsContext} from "../../providers/SettingsProvider";
import {DefaultOptionType} from 'antd/es/select';
import {getDays} from "../../firebase/historyApi";
import {AuthContext} from "../../providers/AuthProvider";
import {IDay} from "../../models/IDay";

const emptySelector: DefaultOptionType[] = [{label: "Все", value: 'all'}];

const HistoryPage = () => {

    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);

    const [selector, setSelector] = useState(emptySelector);
    const [days, setDays] = useState<IDay[] | null>(null);

    useEffect(() => {
        if (user) {
            getDays(user.uid).then(result => setDays(result));
        }
    }, []);

    useEffect(() => {
        if (settings) {
            setSelector(emptySelector.concat(settings.templates.map(t => ({label: t.name, value: t.id}))));
        }
    }, [settings]);

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <Card>
                <Form layout="vertical">
                    <Form.Item label="Шаблон" name="templateId"
                               rules={[{required: true, message: 'Выберете шаблон'}]}>
                        <Select
                            size="large"
                            onChange={e => console.log(e)}
                            options={selector}
                            defaultValue={selector[0].value}
                        />
                    </Form.Item>
                </Form>
            </Card>
            <GeneralCard days={days ?? []}/>
            <FilterCard days={days ?? []}/>
        </Space>
    );
};

export default HistoryPage;
