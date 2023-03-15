import React, {useEffect} from 'react';
import {ISettings} from "../../../models/ISettings";
import {Button, Card, Form, InputNumber, Space} from "antd";

interface ISettingsForm {
    fuelCost: number;
    fuelExpenses: number;
}

type GeneralCardProps = {
    settings: ISettings | null
}

const GeneralCard = ({settings}: GeneralCardProps) => {

    const [form] = Form.useForm();

    useEffect(()=>{
        form.setFieldsValue({"fuelCost": settings?.fuelCost ?? 0, "fuelExpenses": settings?.fuelExpenses ?? 0});
    },[settings]);

    const onFormSubmit = (values: ISettingsForm) => {
        console.log(values);
    }

    return (
        <Card title="Основные параметры" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Form<ISettingsForm> form={form} layout="vertical" onFinish={onFormSubmit}>
                    <Form.Item label="Стоимость топлива" name="fuelCost"
                               rules={[{required: true, message: 'Укажите стоимость топлива'}]}>
                        <InputNumber
                            size="large"
                            min="0"
                            step="0.01"
                            style={{minWidth: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item label="Расход топлива" name="fuelExpenses"
                               rules={[{required: true, message: 'Укажите расход топлива'}]}>
                        <InputNumber
                            size="large"
                            min="0"
                            step="0.01"
                            style={{minWidth: '100%'}}
                        />
                    </Form.Item>
                </Form>
                <Button htmlType="submit" type="primary">Обновить</Button>
            </Space>
        </Card>
    );
};

export default GeneralCard;
