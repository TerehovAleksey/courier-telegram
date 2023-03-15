import {Button, Card, List, Space, Typography} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {IDay} from "../../../models/IDay";

type DeliveryCardProps = {
    day: IDay | null;
}


const DeliveryCard = ({day}: DeliveryCardProps) => {

    const nav = useNavigate();

    return (
        <Card title="Доставки" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                {(day === null || day.deliveries.length === 0) ?
                    <Typography>Доставок пока нет</Typography> :
                    <List itemLayout="horizontal" dataSource={day.deliveries}
                          renderItem={(item) => (
                              <List.Item>
                                  <List.Item.Meta title={`#${item.number} (${item.address}) - ${item.dateTime.toLocaleTimeString()}`}
                                                  description={`${item.cost} - ${item.paymentType?.name}`}/>
                              </List.Item>
                          )}/>
                }
                <Button type="primary" onClick={() => nav("delivery")}>Добавить</Button>
            </Space>
        </Card>
    );
};

export default DeliveryCard;
