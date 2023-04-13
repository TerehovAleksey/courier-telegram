import {Button, Card, Descriptions, Space} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";
import {IDay} from "../../../models/IDay";

type GeneralCardProps = {
    day: IDay | null;
}

const GeneralCard = ({day}: GeneralCardProps) => {

    const nav = useNavigate();

    return (
        <Card title="Статистика за день" bordered={false}>
            <Space direction="vertical" style={{display: "flex"}}>
                <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Начало">{day?.startTime.toLocaleTimeString()}</Descriptions.Item>
                    <Descriptions.Item label="Доставок">{day?.count}</Descriptions.Item>
                    <Descriptions.Item label="Заработано">{day?.dayCost.toFixed(2)}</Descriptions.Item>
                    <Descriptions.Item label="На кармане">{day?.cashMoney}</Descriptions.Item>
                </Descriptions>
                <Button type="primary" onClick={() => nav("end")}>Закончить день</Button>
            </Space>
        </Card>
    );
};

export default GeneralCard;
