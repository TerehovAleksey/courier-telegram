import React, {useContext, useEffect, useState} from "react";
import {Button, Card, DatePicker, Form, InputNumber, Select, Space, TimePicker} from "antd";
import {tgBackButton, tgButton, tgButtonAwaiting, tgEnabled} from "../helpers/telegram";
import dayjs, {Dayjs} from "dayjs";
import {AuthContext} from "../providers/AuthProvider";
import {SettingsContext} from "../providers/SettingsProvider";
import {createDay} from "../firebase/dayApi";
import {useNavigate} from "react-router-dom";
import uuid from "react-uuid";
import {IDay} from "../models/IDay";
import locale from "antd/es/date-picker/locale/ru_RU";
import CardLoader from "../components/CardLoader";

interface IStartDayForm {
    date: Dayjs;
    time: Dayjs;
    template: string;
    money: number;
}

const StartDayPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const goBack = () => nav(-1);

    useEffect(() => {
        let template = settings?.templates.find(t => t.isDefault);
        if (!template) {
            template = settings?.templates[0];
        }
        form.setFieldsValue({"date": dayjs(), "time": dayjs(), "template": template?.id, "money": template?.dayMoney});

        if (tgEnabled) {
            tgButton.text = "Начать день";
            tgButton.onClick(form.submit);
            tgButton.show();
            tgBackButton.onClick(goBack);
            tgBackButton.show();
            return () => {
                tgButton.offClick(form.submit);
                tgButton.hide();
                tgBackButton.offClick(goBack);
                tgBackButton.hide();
            };
        }
    }, []);

    useEffect(() => {
        tgButtonAwaiting(loading);
    }, [loading]);

    const onTemplateChange = (templateId: string) => {
        form.setFieldValue("money", settings?.templates.find(t => t.id === templateId)?.dayMoney ?? 0);
    };

    const onFormSubmit = (values: IStartDayForm) => {
        let dateTime: Dayjs = dayjs(values.date);
        dateTime = dateTime.set("hour", values.time.hour());
        dateTime = dateTime.set("minutes", values.time.minute());
        dateTime = dateTime.set("seconds", 0);

        const day: IDay = {
            id: uuid(),
            startTime: dateTime.toDate(),
            dayCost: 0,
            endTime: null,
            count: 0,
            cashMoney: values.money,
            templateId: values.template,
            deliveries: [],
            dayMoney: 0,
            distance: null,
            expenses: null,
            note: null
        };

        if (user) {
            setLoading(true);
            createDay(user.uid, day).then(() => {
                goBack();
            }).finally(() => {
                setLoading(false);
            });
        }
    };

    return (
        <CardLoader isLoading={loading}>
            <Card title="Начало дня" bordered={false}>
                <Space direction="vertical" style={{display: "flex"}}>
                    <Form<IStartDayForm> form={form} layout="vertical" onFinish={onFormSubmit}>
                        <Form.Item label="Дата" name="date">
                            <DatePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время" name="time">
                            <TimePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly showSecond={false}/>
                        </Form.Item>
                        <Form.Item label="Шаблон" name="template" hidden={(settings?.templates.length ?? 0) < 2}
                                   rules={[{required: true, message: "Выберете шаблон для продолжения"}]}>
                            <Select
                                onSelect={onTemplateChange}
                                size="large"
                                options={settings?.templates.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Разменка" name="money"
                                   rules={[{required: true, message: "Укажите сумму разменных денег"}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: "100%"}}
                            />
                        </Form.Item>
                        {!tgEnabled && <div style={{textAlign: "center"}}>
                            <Button htmlType="submit" type="primary" size="large">Начать</Button>
                        </div>}
                    </Form>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default StartDayPage;
