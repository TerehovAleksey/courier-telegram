import {Button, Card, Space, Typography} from 'antd';
import React from 'react';
import {useNavigate} from "react-router-dom";

const StartDayCard = () => {

    const nav = useNavigate();

    return (
        <Card title="Статистика за день" bordered={false}>
            <Space direction="vertical">
                <Typography>День ещё не начат</Typography>
                <Button onClick={() => nav("start")}>Начать день</Button>
            </Space>
        </Card>
    );
};

export default StartDayCard;
