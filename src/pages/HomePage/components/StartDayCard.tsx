import React from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const StartDayCard = () => {

    const nav = useNavigate();

    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Статистика за день"/>
            <CardContent>
                <Typography>День ещё не начат</Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => nav("start")}>Начать день</Button>
            </CardActions>
        </Card>
    );
};

export default StartDayCard;
