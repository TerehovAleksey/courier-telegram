import React, {useContext, useEffect, useState} from 'react';
import GeneralCard from "./components/GeneralCard";
import {Form, Space} from "antd";
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
    const [form] = Form.useForm();

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

    useEffect(() => {
        form.setFieldValue("templateId", selector[0].value);
    }, [selector]);

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            {/*<Card>*/}
            {/*    <Form form={form} layout="vertical">*/}
            {/*        <Form.Item label="Шаблон" name="templateId"*/}
            {/*                   rules={[{required: true, message: 'Выберете шаблон'}]}>*/}
            {/*            <Select*/}
            {/*                size="large"*/}
            {/*                onChange={e => console.log(e)}*/}
            {/*                options={selector}*/}
            {/*            />*/}
            {/*        </Form.Item>*/}
            {/*    </Form>*/}
            {/*</Card>*/}
            <GeneralCard days={days ?? []}/>
            <FilterCard days={days ?? []}/>
        </Space>
    );
};

export default HistoryPage;
