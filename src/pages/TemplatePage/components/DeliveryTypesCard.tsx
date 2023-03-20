import React, {useState} from 'react';
import {Button, Card, Checkbox, Dropdown, Empty, Form, Input, InputNumber, List, MenuProps, Space} from "antd";
import {IDeliveryType} from "../../../models/IDeliveryType";
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons";
import {useAdapter} from "../../../hooks/useAdapter";
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

type DeliveryTypesCardProps = {
    deliveryTypes: IDeliveryType[];
    onChanged: (deliveryTypes: IDeliveryType[]) => void
}

const DeliveryTypesCard = ({deliveryTypes, onChanged}: DeliveryTypesCardProps) => {

    const {showConfirm} = useAdapter();
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);

    const handleDropDownClick = (key: string, item: IDeliveryType) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить тип доставки?', () => {
                onChanged(deliveryTypes.filter(dt => dt.id != item.id));
            });
        } else {
            form.setFieldsValue({"id": item.id, "name": item.name, "cost": item.cost, "isDefault": item.isDefault});
            setEditMode(true);
        }
    }

    const addType = () => {
        form.resetFields();
        form.setFieldsValue({"isDefault": false});
        setEditMode(true);
    }

    const onFormSubmit = (values: IDeliveryType) => {
        let result = [...deliveryTypes];
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
    }

    return (
        <Card title="Типы доставок" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <>
                    {
                        editMode ?
                            <Form<IDeliveryType> form={form} layout="vertical" onFinish={onFormSubmit}>
                                <Form.Item name="id" hidden>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="Название" name="name"
                                           rules={[{required: true, message: 'Укажите название типа доставки'}]}>
                                    <Input size="large"/>
                                </Form.Item>
                                <Form.Item label="Оплата за доставку" name="cost"
                                           rules={[{required: true, message: 'Укажите величину оплаты за доставку'}]}>
                                    <InputNumber
                                        size="large"
                                        min="0"
                                        step="0.01"
                                        style={{minWidth: '100%'}}
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
                                    <List itemLayout="horizontal" dataSource={deliveryTypes}
                                          renderItem={(item) => (
                                              <List.Item actions={[
                                                  <Dropdown
                                                      menu={{
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

export default DeliveryTypesCard;
