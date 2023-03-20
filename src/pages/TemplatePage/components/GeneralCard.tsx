import React, {useEffect} from 'react';
import {Card, Form, FormInstance, Input, InputNumber, Space} from "antd";

interface ITemplateForm {
    name: string;
    hourCost: number;
    dayMoney: number;
}

type GeneralCardProps = {
    initialValues: ITemplateForm;
    form: FormInstance<any>;
    onChanged: (values: ITemplateForm) => void;
};

const GeneralCard = ({initialValues, form, onChanged}: GeneralCardProps) => {

    useEffect(() => {
        form.setFieldsValue({
            "name": initialValues.name,
            "hourCost": initialValues.hourCost,
            "dayMoney": initialValues.dayMoney
        });
    }, [initialValues]);

    return (
        <Card title="Новый шаблон" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Form<ITemplateForm> form={form} layout="vertical" onValuesChange={(_, values) => onChanged(values)}>
                    <Form.Item label="Название" name="name"
                               rules={[{required: true, message: 'Укажите название шаблона'}]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label="Оплата за час" name="hourCost"
                               rules={[{required: true, message: 'Укажите стоимость часа работы'}]}>
                        <InputNumber
                            size="large"
                            min="0"
                            step="0.01"
                            style={{minWidth: '100%'}}
                        />
                    </Form.Item>
                    <Form.Item label="Разменка" name="dayMoney"
                               rules={[{required: true, message: 'Укажите количество разменных денег'}]}>
                        <InputNumber
                            size="large"
                            min="0"
                            step="0.01"
                            style={{minWidth: '100%'}}
                        />
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    );
};

export default GeneralCard;
