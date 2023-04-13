import {Button, Card, Space, Typography} from "antd";
import React from "react";
import {IDay} from "../../../models/IDay";
import {EditList} from "../../../components/EditList";

type DeliveryCardProps = {
    day: IDay | null;
    onAddDelivery: () => void;
    onEditDelivery: (deliveryId: string) => void;
    onDeleteDelivery: (deliveryId: string) => void;
}

const DeliveryCard = ({day, onAddDelivery, onEditDelivery, onDeleteDelivery}: DeliveryCardProps) => {
    return (
        <Card title="Доставки" bordered={false}>
            <Space direction="vertical" style={{display: "flex"}}>
                {(day === null || day.deliveries.length === 0) ?
                    <Typography>Доставок пока нет</Typography> :
                    <EditList items={day.deliveries}
                              title={item => `#${item.number} (${item.address}) - ${item.dateTime.toLocaleTimeString()}`}
                              description={item => `${item.cost} - ${item.paymentType?.name}`}
                              onItemEdit={onEditDelivery}
                              onItemDelete={onDeleteDelivery}/>
                }
                <Button type="primary" onClick={onAddDelivery}>Добавить</Button>
            </Space>
        </Card>
    );
};

export default DeliveryCard;
