import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, TimePicker} from "antd";
import {tgBackButton, tgButton, tgEnabled} from "../helpers/telegram";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import {SettingsContext} from "../providers/SettingsProvider";
import {AuthContext} from "../providers/AuthProvider";
import {IDeliveryType} from "../models/IDeliveryType";
import {useAdapter} from "../hooks/useAdapter";

interface IDayForm {
    dateStart: Dayjs;
    timeStart: Dayjs;
    templateId: string;
    deliveryTypeId: string;
    count: number;
    distance: number;
    cash: number;
    note: string | undefined;
    dateEnd: Dayjs;
    timeEnd: Dayjs;
}

const DayPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

    const [deliveryTypes, setDeliveryTypes] = useState<IDeliveryType[] | null>(null);

    useEffect(() => {
        let template = settings?.templates.find(t => t.isDefault);
        if (!template) {
            template = settings?.templates[0];
        }
        setDeliveryTypes(template?.deliveryTypes ?? null);
        form.setFieldsValue({
            "dateStart": dayjs(),
            "timeStart": dayjs(),
            "templateId": template?.id ?? '',
            "deliveryTypeId": '',
            "count": 0,
            "distance": 0,
            "cash": 0,
            "dateEnd": dayjs(),
            "timeEnd": dayjs()
        });
    }, []);

    useEffect(() => {
        let type = deliveryTypes?.find(t => t.isDefault);
        if (!type) {
            type = deliveryTypes?.length ? deliveryTypes[0] : undefined;
        }
        form.setFieldValue("deliveryTypeId", type?.id ?? '');
    }, [deliveryTypes]);

    const goBack = () => nav(-1);

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = 'Добавить';
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

    const onFormSubmit = (values: IDayForm) => {
        showAlert('Не реализовано!');
    }

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <Card title="Новый день" bordered={false}>
                <Space direction="vertical" style={{display: 'flex'}}>
                    <Form<IDayForm> form={form} layout="vertical" onFinish={onFormSubmit}>
                        <Form.Item label="Дата начала" name="dateStart"
                                   rules={[{required: true, message: 'Укажите дату начала'}]}>
                            <DatePicker size="large" style={{minWidth: '100%'}} inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время начала" name="timeStart"
                                   rules={[{required: true, message: 'Укажите время начала'}]}>
                            <TimePicker size="large" style={{minWidth: '100%'}} inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Шаблон" name="templateId"
                                   rules={[{required: true, message: 'Выберете шаблон'}]}>
                            <Select
                                size="large"
                                onChange={e => console.log(e)}
                                options={settings?.templates.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Тип доставок" name="deliveryTypeId"
                                   rules={[{required: true, message: 'Выберете тип доставок'}]}>
                            <Select
                                size="large"
                                options={deliveryTypes?.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Количество" name="count"
                                   rules={[{required: true, message: 'Укажите количество доставок'},
                                       ({getFieldValue}) => ({
                                           validator(_, value) {
                                               if (Number.parseInt(value) < 1) {
                                                   return Promise.reject(new Error('Доставки должны быть!'));
                                               }
                                               return Promise.resolve();
                                           }
                                       })]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="1"
                                style={{minWidth: '100%'}}
                            />
                        </Form.Item>
                        <Form.Item label="Пробег, км." name="distance"
                                   rules={[{required: true, message: 'Укажите пройденное за день расстояние'}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: '100%'}}
                            />
                        </Form.Item>
                        <Form.Item label="Чаевые" name="cash"
                                   rules={[{required: true, message: 'Укажите сумму чаевых за день'}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: '100%'}}
                            />
                        </Form.Item>
                        <Form.Item label="Примечание" name="note">
                            <Input size="large"/>
                        </Form.Item>
                        <Form.Item label="Дата окончания" name="dateEnd"
                                   rules={[{required: true, message: 'Укажите дату окончания'}]}>
                            <DatePicker size="large" style={{minWidth: '100%'}} inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время окончания" name="timeEnd"
                                   rules={[{required: true, message: 'Укажите время окончания'}]}>
                            <TimePicker size="large" style={{minWidth: '100%'}} inputReadOnly/>
                        </Form.Item>
                        {!tgEnabled && <div style={{textAlign: 'center'}}>
                            <Button htmlType="submit" type="primary" size="large">Добавить</Button>
                        </div>}
                    </Form>
                </Space>
            </Card>
        </Space>
    );
};

export default DayPage;