import React, {useEffect, useState} from "react";
import {Button, Card, DatePicker, Form, Input, InputNumber, Select, Space, TimePicker} from "antd";
import {tgBackButton, tgButton, tgEnabled} from "../helpers/telegram";
import {useNavigate} from "react-router-dom";
import dayjs, {Dayjs} from "dayjs";
import {IDeliveryType} from "../models/IDeliveryType";
import {useAdapter} from "../hooks/useAdapter";
import {calculateAddDay} from "../helpers/dayCalculation";
import {IDay} from "../models/IDay";
import uuid from "react-uuid";
import {createDay} from "../firebase/dayApi";
import locale from "antd/es/date-picker/locale/ru_RU";
import CardLoader from "../components/CardLoader";
import {useSettings} from "../hooks/useSettings";
import {useUser} from "../hooks/useUser";

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
    const settings = useSettings();
    const user = useUser();
    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

    const [deliveryTypes, setDeliveryTypes] = useState<IDeliveryType[] | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let template = settings?.templates.find(t => t.isDefault);
        if (!template) {
            template = settings?.templates[0];
        }
        setDeliveryTypes(template?.deliveryTypes ?? null);
        form.setFieldsValue({
            "dateStart": dayjs(),
            "timeStart": dayjs(),
            "templateId": template?.id ?? "",
            "deliveryTypeId": "",
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
        form.setFieldValue("deliveryTypeId", type?.id ?? "");
    }, [deliveryTypes]);

    const goBack = () => nav(-1);

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = "Добавить";
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

    const onTemplateChange = (templateId: string) => {
        setDeliveryTypes(settings?.templates.find(t => t.id === templateId)?.deliveryTypes ?? null);
    };

    const onFormSubmit = (values: IDayForm) => {
        if (!settings || !user) {
            return;
        }

        let dateTimeStart: Dayjs = dayjs(values.dateStart);
        dateTimeStart = dateTimeStart.set("hour", values.timeStart.hour());
        dateTimeStart = dateTimeStart.set("minutes", values.timeStart.minute());
        dateTimeStart = dateTimeStart.set("seconds", 0);

        let dateTimeEnd: Dayjs = dayjs(values.dateEnd);
        dateTimeEnd = dateTimeEnd.set("hour", values.timeEnd.hour());
        dateTimeEnd = dateTimeEnd.set("minutes", values.timeEnd.minute());
        dateTimeEnd = dateTimeEnd.set("seconds", 0);

        if (dateTimeStart.isSame(dateTimeEnd, "minutes") || dateTimeStart.isAfter(dateTimeEnd, "minutes")) {
            showAlert("Время окончания дня должно быть больше времени начала");
            return;
        }

        const diff = dateTimeEnd.diff(dateTimeStart, "minutes");
        if (diff > 1440) {
            showAlert("Мы увенены, что рабочий день не может быть более 24 часов!");
            return;
        }

        setLoading(true);

        const day: IDay = {
            id: uuid(),
            startTime: dateTimeStart.toDate(),
            endTime: dateTimeEnd.toDate(),
            dayCost: 0,
            count: values.count,
            templateId: values.templateId,
            cashMoney: 0,
            distance: values.distance,
            note: values.note ?? null,
            expenses: 0,
            dayMoney: values.cash,
            deliveries: []
        };

        calculateAddDay(day, settings, values.deliveryTypeId);

        createDay(user.uid, day)
            .then(() => {
                setLoading(false);
                nav(-1);
            });
    };

    return (
        <CardLoader isLoading={loading}>
            <Card title="Новый день" bordered={false}>
                <Space direction="vertical" style={{display: "flex"}}>
                    <Form<IDayForm> form={form} layout="vertical" onFinish={onFormSubmit}>
                        <Form.Item label="Дата начала" name="dateStart"
                                   rules={[{required: true, message: "Укажите дату начала"}]}>
                            <DatePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время начала" name="timeStart"
                                   rules={[{required: true, message: "Укажите время начала"}]}>
                            <TimePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Шаблон" name="templateId" hidden={(settings?.templates.length ?? 0) < 2}
                                   rules={[{required: true, message: "Выберете шаблон"}]}>
                            <Select
                                size="large"
                                onChange={onTemplateChange}
                                options={settings?.templates.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Тип доставок" name="deliveryTypeId" hidden={(deliveryTypes?.length ?? 0) < 2}
                                   rules={[{required: true, message: "Выберете тип доставок"}]}>
                            <Select
                                size="large"
                                options={deliveryTypes?.map(t => ({value: t.id, label: t.name}))}
                            />
                        </Form.Item>
                        <Form.Item label="Количество" name="count"
                                   rules={[{required: true, message: "Укажите количество доставок"},
                                       () => ({
                                           validator(_, value) {
                                               if (Number.parseInt(value) < 1) {
                                                   return Promise.reject(new Error("Доставки должны быть!"));
                                               }
                                               return Promise.resolve();
                                           }
                                       })]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="1"
                                style={{minWidth: "100%"}}
                            />
                        </Form.Item>
                        <Form.Item label="Пробег, км." name="distance"
                                   rules={[{required: true, message: "Укажите пройденное за день расстояние"}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: "100%"}}
                            />
                        </Form.Item>
                        <Form.Item label="Чаевые" name="cash"
                                   rules={[{required: true, message: "Укажите сумму чаевых за день"}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: "100%"}}
                            />
                        </Form.Item>
                        <Form.Item label="Примечание" name="note">
                            <Input size="large"/>
                        </Form.Item>
                        <Form.Item label="Дата окончания" name="dateEnd"
                                   rules={[{required: true, message: "Укажите дату окончания"}]}>
                            <DatePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly/>
                        </Form.Item>
                        <Form.Item label="Время окончания" name="timeEnd"
                                   rules={[{required: true, message: "Укажите время окончания"}]}>
                            <TimePicker allowClear={false} locale={locale} size="large" style={{minWidth: "100%"}}
                                        inputReadOnly/>
                        </Form.Item>
                        {!tgEnabled && <div style={{textAlign: "center"}}>
                            <Button htmlType="submit" type="primary" size="large">Добавить</Button>
                        </div>}
                    </Form>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default DayPage;
