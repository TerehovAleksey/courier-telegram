import React, {useState} from 'react';
import {Button, Card, Checkbox, Dropdown, Empty, Form, Input, List, MenuProps, Space} from "antd";
import {useAdapter} from "../../../hooks/useAdapter";
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons";
import {IPaymentType} from "../../../models/IPaymentType";
import uuid from "react-uuid";

const items: MenuProps['items'] = [
    {
        key: 'edit',
        label: 'изменить',
        icon: <EditOutlined style={{fontSize: '18px'}}/>
    },
    {
        key: 'delete',
        danger: true,
        label: 'удалить',
        icon: <DeleteOutlined style={{fontSize: '18px'}}/>
    },
];

type PaymentTypesCardProps = {
    paymentTypes: IPaymentType[];
    onChanged: (deliveryTypes: IPaymentType[]) => void
}

const PaymentTypesCard = ({paymentTypes, onChanged}: PaymentTypesCardProps) => {

    const {showConfirm} = useAdapter();
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const handleDropDownClick = (key: string, item: IPaymentType) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить тип оплаты?', () => {
                onChanged(paymentTypes.filter(pt => pt.id != item.id));
            });
        } else {
            form.setFieldsValue({
                "id": item.id,
                "name": item.name,
                "addToDayCash": item.addToDayCash,
                "isDefault": item.isDefault
            });
            setEditMode(true);
        }
    }

    const addType = () => {
        form.resetFields();
        form.setFieldsValue({"addToDayCash": false, "isDefault": false});
        setEditMode(true);
    }

    const onFormSubmit = (values: IPaymentType) => {
        let result = [...paymentTypes];
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
    }

    return (
        <Card title="Типы оплат" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <>
                    {
                        editMode ?
                            <Form<IPaymentType> form={form} layout="vertical" onFinish={onFormSubmit}>
                                <Form.Item name="id" hidden>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Название" name="name"
                                           rules={[{required: true, message: 'Укажите название типа оплаты'}]}>
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
                                    <List itemLayout="horizontal" dataSource={paymentTypes}
                                          renderItem={(item) => (
                                              <List.Item actions={[
                                                  <Dropdown menu={{
                                                      items,
                                                      onClick: info => handleDropDownClick(info.key, item)
                                                  }}>
                                                      <a onClick={(e) => e.preventDefault()}>
                                                          <MoreOutlined style={{fontSize: '24px'}}/>
                                                      </a>
                                                  </Dropdown>]}>
                                                  <List.Item.Meta title={item.name}
                                                                  description={item.isDefault ? 'используется по умолчанию' : ''}/>
                                              </List.Item>
                                          )}/>
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
