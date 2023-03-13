import React from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {ISettings} from "../../../models/ISettings";

type GeneralCardProps = {
    settings: ISettings | null
}

const GeneralCard = ({settings}: GeneralCardProps) => {
    return (
        <Card sx={{my: 2}}>
            <CardHeader title="Основные параметры"/>
            <CardContent>
                <Box component="form" noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fuelCost"
                        label="Стоимость топлива"
                        name="fuelCost"
                        value={settings?.fuelCost ?? '0'}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="fuelExpenses"
                        label="Расход топлива"
                        name="fuelExpenses"
                        value={settings?.fuelExpenses ?? '0'}
                    />
                </Box>
            </CardContent>
            <CardActions>
                <Button size="small">Обновить</Button>
            </CardActions>
        </Card>
    );
};

export default GeneralCard;
