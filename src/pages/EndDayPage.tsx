import React, {useContext, useEffect} from 'react';
import dayjs, {Dayjs} from "dayjs";
import {useNavigate} from "react-router-dom";
import {SettingsContext} from "../providers/SettingsProvider";
import {AuthContext} from "../providers/AuthProvider";
import {getCurrentDay, updateDay} from "../firebase/dayApi";
import {Button, Card, DatePicker, Form, Input, InputNumber, Space, TimePicker} from "antd";
import {tgBackButton, tgButton, tgEnabled} from "../helpers/telegram";
import {useAdapter} from "../hooks/useAdapter";
import locale from 'antd/es/date-picker/locale/ru_RU';

interface IEndDayForm {
    date: Dayjs;
    time: Dayjs;
    distance: number;
    cash: number;
    note: string | undefined;
}

const EndDayPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

    const goBack = () => nav(-1);

    useEffect(() => {

        form.setFieldsValue({"date": dayjs(), "time": dayjs(), "distance": 0, "cash": 0});

        if (tgEnabled) {
            tgButton.text = 'Закончить день';
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

    const calcExpenses = (distance: number) =>
        distance * (settings?.fuelExpenses ?? 0) / 100 * (settings?.fuelCost ?? 0);

    const onFormSubmit = async (values: IEndDayForm) => {
        let dateTime: Dayjs = dayjs(values.date);
        dateTime = dateTime.set("hour", values.time.hour());
        dateTime = dateTime.set("minutes", values.time.minute());

        if (user) {
            const day = await getCurrentDay(user.uid);

            if (day) {

                if (dateTime.isBefore(day.startTime)) {
                    showAlert('Время окончания не может быть раньше времени начала дня!');
                    return;
                }

                const diff = dateTime.diff(day.startTime, 'minutes');
                if (diff > 1440) {
                    showAlert('Мы увенены, что рабочий день не может быть более 24 часов!');
                    return;
                }

                day.endTime = dateTime.toDate();
                day.note = values.note ?? null;
                day.dayMoney = values.cash;
                day.distance = values.distance;
                day.expenses = calcExpenses(values.distance);

                await updateDay(user.uid, day);
                goBack();
            }
        }
    }

    return (
        <Card title="Конец дня" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Form<IEndDayForm> form={form} layout="vertical" onFinish={onFormSubmit}>
                    <Form.Item label="Дата" name="date">
                        <DatePicker allowClear={false} locale={locale} size="large" style={{minWidth: '100%'}}
                                    inputReadOnly/>
                    </Form.Item>
                    <Form.Item label="Время" name="time">
                        <TimePicker allowClear={false} locale={locale} size="large" style={{minWidth: '100%'}}
                                    inputReadOnly/>
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
                    {!tgEnabled && <div style={{textAlign: 'center'}}>
                        <Button htmlType="submit" type="primary" size="large">Закончить</Button>
                    </div>}
                </Form>
            </Space>
        </Card>
    );
};

export default EndDayPage;
