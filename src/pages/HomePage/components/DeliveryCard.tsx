import React from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";

const DeliveryCard = () => {
    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Доставки"/>
            <CardContent>
                <Typography>Доставок пока нет</Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Добавить</Button>
            </CardActions>
        </Card>
    );
};

export default DeliveryCard;
