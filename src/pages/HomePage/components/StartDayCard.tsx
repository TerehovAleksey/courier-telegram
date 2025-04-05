import {Button, Card, Space, Typography} from "antd";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {tgButton, tgEnabled} from "../../../helpers/telegram";

const StartDayCard = () => {

    const nav = useNavigate();
    const startDay = () => nav("start");

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = "Начать день";
            tgButton.onClick(startDay);
            tgButton.show();
            return () => {
                tgButton.offClick(startDay);
                tgButton.hide();
            };
        }
    }, []);

    return (
        <Card title="День ещё не начат!" variant={'borderless'}>
            <Space direction="vertical">
                <Typography>Начните день или добавьте готовые данные.</Typography>
                <Button onClick={() => nav("day")}>Добавить день</Button>
            </Space>
        </Card>
    );
};

export default StartDayCard;
