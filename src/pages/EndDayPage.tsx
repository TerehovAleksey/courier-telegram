import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import Box from "@mui/material/Box";
import {MobileDateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import {useNavigate} from "react-router-dom";
import {SettingsContext} from "../providers/SettingsProvider";
import {AuthContext} from "../providers/AuthProvider";
import {getCurrentDay, updateDay} from "../firebase/dayApi";

const tg = window.Telegram.WebApp;

const EndDayPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs());
    const [distance, setDistance] = useState('0');
    const [isDistanceError, setIsDistanceError] = useState(false);
    const [cash, setCash] = useState('0');
    const [isCashError, setIsCashError] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        tg.BackButton.onClick(goBack);
        tg.BackButton.show();
        return () => {
            tg.BackButton.offClick(goBack);
            tg.BackButton.hide();
        }
    }, []);

    const goBack = () => nav(-1);

    const onDistanceChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const num = Number.parseFloat(value);
        setDistance(value);
        setIsDistanceError(isNaN(num) || num < 0);
    }

    const onCashChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const num = Number.parseFloat(value);
        setCash(value);
        setIsCashError(isNaN(num) || num < 0);
    }

    const calcExpenses = () => {
        const d = Number.parseFloat(distance);
        return d * (settings?.fuelExpenses ?? 0) / 100 * (settings?.fuelCost ?? 0);
    }

    const endDay = async () => {
        if (user) {
            const day = await getCurrentDay(user.uid);
            if (day) {
                day.endTime = endTime.toDate();
                day.note = note;
                day.dayMoney = Number.parseFloat(cash);
                day.distance = Number.parseFloat(distance);
                day.expenses = calcExpenses();

                await updateDay(user.uid, day);
                goBack();
            }
        }
    }

    return (
        <Card>
            <CardHeader title="Конец дня"/>
            <CardContent>
                <Box>
                    <FormControl fullWidth margin="normal">
                        <MobileDateTimePicker ampmInClock={false}
                                              ampm={false}
                                              label="Дата и время"
                                              defaultValue={dayjs()}
                                              value={endTime}
                                              onChange={d => setEndTime(d ?? dayjs())}/>
                    </FormControl>
                    <TextField
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        id="distance"
                        label="Пробег, км."
                        name="distance"
                        value={distance}
                        onChange={onDistanceChanged}
                        error={isDistanceError}
                    />
                    <TextField
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        id="cash"
                        label="Чаевые"
                        name="cash"
                        value={cash}
                        onChange={onCashChanged}
                        error={isCashError}
                    />
                    <TextField
                        type="text"
                        margin="normal"
                        required
                        fullWidth
                        id="note"
                        label="Примечание"
                        name="note"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </Box>
            </CardContent>
            <CardActions>
                <Button variant='outlined' onClick={endDay} disabled={isCashError || isDistanceError}>Закончить</Button>
            </CardActions>
        </Card>
    );
};

export default EndDayPage;
