import {Button, Card, Descriptions, Space} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";
import {IDay} from "../../../models/IDay";
import dayjs from "dayjs";
import {useSettings} from "../../../hooks/useSettings";

type GeneralCardProps = {
    day: IDay | null;
}

const GeneralCard = ({day}: GeneralCardProps) => {

    const nav = useNavigate();
    const settings = useSettings();

    const startTimeString = () => {
        if (day === null) {
            return "";
        }

        const st = dayjs(day.startTime);
        if (st.isSame(dayjs(), "day")) {
            return st.format("HH:mm");
        } else {
            return st.format("DD.MM.YYYY HH:mm");
        }
    };

    return (
        <Card title="Статистика за день" bordered={false}>
            <Space direction="vertical" style={{display: "flex"}}>
                <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Начало">{startTimeString()}</Descriptions.Item>
                    <Descriptions.Item label="Доставок">{day?.count}</Descriptions.Item>
                    <Descriptions.Item label="Заработано">{day?.dayCost} {settings?.currency}</Descriptions.Item>
                    <Descriptions.Item label="На кармане">{day?.cashMoney} {settings?.currency}</Descriptions.Item>
                </Descriptions>
                <Button type="primary" onClick={() => nav("end")}>Закончить день</Button>
            </Space>
        </Card>
    );
};

export default GeneralCard;
