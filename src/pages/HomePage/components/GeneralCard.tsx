import {Button, Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import React from 'react';
import {useNavigate} from "react-router-dom";
import {IDay} from "../../../models/IDay";

type GeneralCardProps = {
    day: IDay | null;
}

const GeneralCard = ({day}: GeneralCardProps) => {

    const nav = useNavigate();

    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Статистика за день"/>
            <CardContent>
                <Typography>Начало: {day?.startTime.toLocaleTimeString()}</Typography>
                <Typography>Доставок: {day?.count}</Typography>
                <Typography>Заработано: {day?.dayCost.toFixed(2)}</Typography>
                <Typography>На кармане: {day?.cashMoney}</Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => nav("end")}>Закончить день</Button>
            </CardActions>
        </Card>
    );
};

export default GeneralCard;
