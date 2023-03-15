import React from 'react';
import {Button, Card, Dropdown, Empty, List, MenuProps, Space} from "antd";
import {useAdapter} from "../../../hooks/useAdapter";
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons";
import {IPaymentType} from "../../../models/IPaymentType";

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

    const handleDropDownClick = (key: string, item: IPaymentType) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить тип оплаты?', () => {
                onChanged(paymentTypes.filter(pt => pt.id != item.id));
            });
        } else {
            //
        }
    }

    return (
        <Card title="Типы оплат" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                {(paymentTypes.length === 0) ?
                    <Empty/> :
                    <List itemLayout="horizontal" dataSource={paymentTypes}
                          renderItem={(item) => (
                              <List.Item actions={[
                                  <Dropdown menu={{items, onClick: info => handleDropDownClick(info.key, item)}}>
                                      <a onClick={(e) => e.preventDefault()}>
                                          <MoreOutlined style={{fontSize: '24px'}}/>
                                      </a>
                                  </Dropdown>]}>
                                  <List.Item.Meta title={item.name}
                                                  description={item.isDefault ? 'используется по умолчанию' : ''}/>
                              </List.Item>
                          )}/>
                }
                <Button htmlType="submit" type="primary">Добавить</Button>
            </Space>
        </Card>
    );
};

export default PaymentTypesCard;
