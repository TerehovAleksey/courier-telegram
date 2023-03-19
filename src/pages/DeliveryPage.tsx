import React, {useContext, useEffect, useState} from 'react';
import dayjs, {Dayjs} from "dayjs";
import {IDelivery} from "../models/IDelivery";
import uuid from "react-uuid";
import {SettingsContext} from "../providers/SettingsProvider";
import {AuthContext} from '../providers/AuthProvider';
import {IDay} from "../models/IDay";
import {getCurrentDay, updateDay} from "../firebase/dayApi";
import {ITemplate} from "../models/ITemplate";
import {useNavigate} from "react-router-dom";
import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, TimePicker} from "antd";
import {tgBackButton, tgButton, tgButtonAwaiting, tgEnabled} from "../helpers/telegram";
import {useAdapter} from "../hooks/useAdapter";
import {fixedRound} from "../helpers/dayCalculation";
import CardLoader from "../components/CardLoader";

interface IDeliveryForm {
    date: Dayjs;
    time: Dayjs;
    number: string | undefined;
    address: string | undefined;
    cost: number;
    paymentId: string;
    typeId: string;
    note: string | undefined;
}

const DeliveryPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

    const [day, setDay] = useState<IDay | null>(null);
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<ITemplate | null>(null);

    const goBack = () => nav(-1);

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = 'Добавить доставку';
            tgButton.onClick(form.submit);
            tgButton.show();
            tgBackButton.onClick(goBack);
            tgBackButton.show();
            return () => {
                tgButton.offClick(form.submit);
                tgButton.hide();
                tgBackButton.offClick(goBack);
                tgBackButton.hide();
            }
        }
    }, []);

    useEffect(() => {
        tgButtonAwaiting(loading);
    }, [loading]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getCurrentDay(user.uid).then(d => {
                setDay(d);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [user]);

    useEffect(() => {
        if (day && settings) {
            const template = settings.templates.find(t => t.id === day.templateId);
            if (template) {
                setTemplate(template);
                let pId = template.paymentTypes.find(t => t.isDefault)?.id;
                if (!pId) {
                    pId = template.paymentTypes[0]?.id;
                }
                let dId = template.deliveryTypes.find(t => t.isDefault)?.id;
                if (!dId) {
                    dId = template.deliveryTypes[0]?.id;
                }
                form.setFieldsValue({
                    "date": dayjs(day.startTime),
                    "time": dayjs(dayjs()),
                    "cost": 0,
                    "paymentId": pId,
                    "typeId": dId
                });
            }
        }
    }, [day, settings]);

    const onFormSubmit = (values: IDeliveryForm) => {
        let dateTime: Dayjs = dayjs(values.date);
        dateTime = dateTime.set("hour", values.time.hour());
        dateTime = dateTime.set("minutes", values.time.minute());
        dateTime = dateTime.set("seconds", 0);

        if (dateTime.isBefore(day?.startTime)) {
            showAlert('Время доставки не может быть раньше времени начала дня!');
            return;
        }

        if (day) {
            const diff = dateTime.diff(day.startTime, 'minutes');
            if (diff > 1440) {
                showAlert('Мы увенены, что рабочий день не может быть более 24 часов!');
                return;
            }
        }

        const delivery: IDelivery = {
            id: uuid(),
            number: values.number ?? null,
            address: values.address ?? null,
            cost: values.cost,
            dateTime: dateTime.toDate(),
            note: values.note ?? null,
            paymentType: template?.paymentTypes.find(t => t.id === values.paymentId) ?? null,
            deliveryType: template?.deliveryTypes.find(t => t.id === values.typeId) ?? null,
        };

        if (day && user) {

            setLoading(true);

            day.count++;
            day.dayCost = fixedRound(day.dayCost + (delivery.deliveryType?.cost ?? 0), 2);
            if (delivery.paymentType?.addToDayCash) {
                day.cashMoney = fixedRound(day.cashMoney + delivery.cost, 2);
            }
            if (day.deliveries) {
                day.deliveries.push(delivery);
            } else {
                day.deliveries = [delivery];
            }

            updateDay(user.uid, day).then(() => {
                nav(-1);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <CardLoader isLoading={loading}>
            <Card title="Доставка" bordered={false}>
                <Space direction="vertical" style={{display: 'flex'}}>
                    <Form<IDeliveryForm> form={form} layout="vertical" disabled={loading} onFinish={onFormSubmit}>
                        <Form.Item label="Дата" name="date">
                            <DatePicker allowClear={false} size="large" style={{minWidth: '100%'}} inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время" name="time">
                            <TimePicker allowClear={false} size="large" style={{minWidth: '100%'}}
                                        inputReadOnly showSecond={false}/>
                        </Form.Item>
                        <Form.Item label="Номер" name="number">
                            <Input size="large"/>
                        </Form.Item>
                        <Form.Item label="Адрес" name="address">
                            <Input size="large"/>
                        </Form.Item>
                        <Form.Item label="Сумма" name="cost"
                                   rules={[{required: true, message: 'Укажите сумму за доставку'}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: '100%'}}
                            />
                        </Form.Item>
                        <Form.Item label="Тип оплаты" name="paymentId"
                                   hidden={(template?.paymentTypes.length ?? 0) < 2}
                                   rules={[{required: true, message: 'Выберете тип оплаты для продолжения'}]}>
                            <Select
                                size="large"
                                options={template?.paymentTypes.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Вид доставки" name="typeId"
                                   hidden={(template?.deliveryTypes?.length ?? 0) < 2}
                                   rules={[{required: true, message: 'Выберете вид доставки для продолжения'}]}>
                            <Select
                                size="large"
                                options={template?.deliveryTypes.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Примечание" name="note">
                            <Input size="large"/>
                        </Form.Item>
                        {!tgEnabled && <div style={{textAlign: 'center'}}>
                            <Button htmlType="submit" type="primary" size="large">Добавить</Button>
                        </div>}
                    </Form>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default DeliveryPage;
