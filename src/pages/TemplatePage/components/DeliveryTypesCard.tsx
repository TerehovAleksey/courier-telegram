import React, {useState} from "react";
import {Button, Card, Checkbox, Empty, Form, Input, InputNumber, Space} from "antd";
import {IDeliveryType} from "../../../models/IDeliveryType";
import {v4 as uuid} from 'uuid';
import {EditList} from "../../../components/EditList";

type DeliveryTypesCardProps = {
    deliveryTypes: IDeliveryType[];
    onChanged: (deliveryTypes: IDeliveryType[]) => void
}

const DeliveryTypesCard = ({deliveryTypes, onChanged}: DeliveryTypesCardProps) => {

    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const addType = () => {
        form.resetFields();
        form.setFieldsValue({"isDefault": false});
        setEditMode(true);
    };

    const onFormSubmit = (values: IDeliveryType) => {
        const result = [...deliveryTypes];
        if (values.id) {
            result.forEach(d => {
                if (d.id === values.id) {
                    d.name = values.name;
                    d.cost = values.cost;
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
        <Card title="Типы доставок" variant={'borderless'}>
            <Space direction="vertical" style={{display: "flex"}}>
                <>
                    {
                        editMode ?
                            <Form<IDeliveryType> form={form} layout="vertical" onFinish={onFormSubmit}>
                                <Form.Item name="id" hidden>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Название" name="name"
                                           rules={[{required: true, message: "Укажите название типа доставки"}]}>
                                    <Input size="large"/>
                                </Form.Item>
                                <Form.Item label="Оплата за доставку" name="cost"
                                           rules={[{required: true, message: "Укажите величину оплаты за доставку"}]}>
                                    <InputNumber
                                        size="large"
                                        min="0"
                                        step="0.01"
                                        style={{minWidth: "100%"}}
                                    />
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
                                {(deliveryTypes.length === 0) ?
                                    <Empty/> :
                                    <EditList items={deliveryTypes}
                                              title={item => item.name}
                                              description={item => item.isDefault ? "используется по умолчанию" : ""}
                                              onItemEdit={id => {
                                                  const item = deliveryTypes.find(i => i.id === id);
                                                  form.setFieldsValue({
                                                      "id": id,
                                                      "name": item?.name,
                                                      "cost": item?.cost,
                                                      "isDefault": item?.isDefault
                                                  });
                                                  setEditMode(true);
                                              }}
                                              onItemDelete={id => {
                                                  onChanged(deliveryTypes.filter(dt => dt.id != id));
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

export default DeliveryTypesCard;
