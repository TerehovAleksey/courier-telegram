import {Button, Card, CardActions, CardContent, CardHeader, Typography} from '@mui/material';
import React from 'react';

const GeneralCard = () => {
    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Статистика за день"/>
            <CardContent>
                <Typography>Доставок: 0</Typography>
                <Typography>Заработано: 0</Typography>
                <Typography>На кармане: 80</Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Закончить день</Button>
            </CardActions>
        </Card>
    );
};

export default GeneralCard;
