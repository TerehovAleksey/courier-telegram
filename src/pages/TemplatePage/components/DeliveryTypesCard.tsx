import React from 'react';
import {Button, Card, Dropdown, Empty, List, MenuProps, Space} from "antd";
import {IDeliveryType} from "../../../models/IDeliveryType";
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons";
import {useAdapter} from "../../../hooks/useAdapter";

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

    const handleDropDownClick = (key: string, item: IDeliveryType) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить тип доставки?', () => {
                onChanged(deliveryTypes.filter(dt => dt.id != item.id));
            });
        } else {
            //
        }
    }

    return (
        <Card title="Типы доставок" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                {(deliveryTypes.length === 0) ?
                    <Empty/> :
                    <List itemLayout="horizontal" dataSource={deliveryTypes}
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

export default DeliveryTypesCard;
