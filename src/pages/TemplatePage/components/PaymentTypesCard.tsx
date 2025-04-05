import React, {useState} from "react";
import {Button, Card, Checkbox, Empty, Form, Input, Space} from "antd";
import {IPaymentType} from "../../../models/IPaymentType";
import {v4 as uuid} from 'uuid';
import {EditList} from "../../../components/EditList";

type PaymentTypesCardProps = {
    paymentTypes: IPaymentType[];
    onChanged: (deliveryTypes: IPaymentType[]) => void
}

const PaymentTypesCard = ({paymentTypes, onChanged}: PaymentTypesCardProps) => {

    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const addType = () => {
        form.resetFields();
        form.setFieldsValue({"addToDayCash": false, "isDefault": false});
        setEditMode(true);
    };

    const onFormSubmit = (values: IPaymentType) => {
        const result = [...paymentTypes];
        if (values.id) {
            result.forEach(d => {
                if (d.id === values.id) {
                    d.name = values.name;
                    d.addToDayCash = values.addToDayCash;
                    d.isDefault = values.isDefault;
                } else if (values.isDefault) {
                    d.isDefault = false;
                }
            });
        } else {
            values.id = uuid();
            if (values.isDefault) {
                result.forEach(d => {
                    d.isDefault = false;
                });
            }
            result.push(values);
        }
        onChanged(result);
        setEditMode(false);
    };

    return (
        <Card title="Типы оплат" variant={'borderless'}>
            <Space direction="vertical" style={{display: "flex"}}>
                <>
                    {
                        editMode ?
                            <Form<IPaymentType> form={form} layout="vertical" onFinish={onFormSubmit}>
                                <Form.Item name="id" hidden>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Название" name="name"
                                           rules={[{required: true, message: "Укажите название типа оплаты"}]}>
                                    <Input size="large"/>
                                </Form.Item>
                                <Form.Item name="addToDayCash" valuePropName="checked">
                                    <Checkbox>Добавлять в наличные дня</Checkbox>
                                </Form.Item>
                                <Form.Item name="isDefault" valuePropName="checked">
                                    <Checkbox>Использовать по умолчанию</Checkbox>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Сохранить</Button>
                                    <Button style={{marginLeft: 10}}
                                            onClick={() => setEditMode(false)}>Отменить</Button>
                                </Form.Item>
                            </Form> :
                            <>
                                {(paymentTypes.length === 0) ?
                                    <Empty/> :
                                    <EditList items={paymentTypes}
                                              title={item => item.name}
                                              description={item => item.isDefault ? "используется по умолчанию" : ""}
                                              onItemEdit={id => {
                                                  const item = paymentTypes.find(i => i.id === id);
                                                  form.setFieldsValue({
                                                      "id": id,
                                                      "name": item?.name,
                                                      "addToDayCash": item?.addToDayCash,
                                                      "isDefault": item?.isDefault
                                                  });
                                                  setEditMode(true);
                                              }}
                                              onItemDelete={id => {
                                                  onChanged(paymentTypes.filter(pt => pt.id != id));
                                              }}/>
                                }
                                <Button type="default" onClick={addType}>Добавить</Button>
                            </>
                    }
                </>
            </Space>
        </Card>
    );
};

export default PaymentTypesCard;
