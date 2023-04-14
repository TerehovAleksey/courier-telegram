import React, {useContext, useEffect, useState} from "react";
import {ISettings} from "../../../models/ISettings";
import {Button, Card, Form, Input, InputNumber, Space} from "antd";
import {updateSettings} from "../../../firebase/settingsApi";
import {AuthContext} from "../../../providers/AuthProvider";
import {useAdapter} from "../../../hooks/useAdapter";
import CardLoader from "../../../components/CardLoader";

interface ISettingsForm {
    fuelCost: number;
    fuelExpenses: number;
    currency: string;
}

type GeneralCardProps = {
    settings: ISettings | null
}

const GeneralCard = ({settings}: GeneralCardProps) => {

    const user = useContext(AuthContext);
    const {showNotification} = useAdapter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            "fuelCost": settings?.fuelCost ?? 0,
            "fuelExpenses": settings?.fuelExpenses ?? 0,
            "currency": settings?.currency
        });
    }, [settings]);

    const onFormSubmit = (values: ISettingsForm) => {
        if (user) {
            setLoading(true);
            const result = {
                ...settings,
                fuelCost: values.fuelCost,
                fuelExpenses: values.fuelExpenses,
                currency: values.currency
            } as ISettings;
            updateSettings(user.uid, result)
                .then(() => showNotification("Параметры успешно обновлены!"))
                .finally(() => setLoading(false));
        }
    };

    return (
        <CardLoader isLoading={loading}>
            <Card title="Основные параметры" bordered={false}>
                <Space direction="vertical" style={{display: "flex"}}>
                    <Form<ISettingsForm> form={form} layout="vertical" onFinish={onFormSubmit}
                                         disabled={loading}>
                        <Form.Item label="Стоимость топлива" name="fuelCost"
                                   rules={[{required: true, message: "Укажите стоимость топлива"}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: "100%"}}
                                addonAfter={settings?.currency}
                            />
                        </Form.Item>
                        <Form.Item label="Расход топлива" name="fuelExpenses"
                                   rules={[{required: true, message: "Укажите расход топлива"}]}>
                            <InputNumber
                                size="large"
                                min="0"
                                step="0.01"
                                style={{minWidth: "100%"}}
                                addonAfter="л/100км"
                            />
                        </Form.Item>
                        <Form.Item label="Валюта" name="currency">
                            <Input size="large"/>
                        </Form.Item>
                        <Button htmlType="submit" type="primary">Обновить</Button>
                    </Form>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default GeneralCard;
