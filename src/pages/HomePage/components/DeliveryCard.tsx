import React from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {IDay} from "../../../models/IDay";

type DeliveryCardProps = {
    day: IDay | null;
}


const DeliveryCard = ({day}: DeliveryCardProps) => {

    const nav = useNavigate();

    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Доставки"/>
            <CardContent>
                {(day === null || day.deliveries.length === 0) ?
                    <Typography>Доставок пока нет</Typography> :
                    <List>
                        {
                            day.deliveries.map(d =>
                                <ListItem key={d.id}>
                                    <ListItemText primary={`#${d.number} ${d.dateTime.toLocaleTimeString()}`}
                                                  secondary={d.address}/>
                                </ListItem>
                            )
                        }
                    </List>
                }
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => nav('delivery')}>Добавить</Button>
            </CardActions>
        </Card>
    );
};

export default DeliveryCard;
