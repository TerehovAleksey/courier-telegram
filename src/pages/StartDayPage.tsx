import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel, MenuItem,
    Select
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {MobileDateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import {SettingsContext} from "../providers/SettingsProvider";
import {IDay} from "../models/IDay";
import uuid from "react-uuid";
import {createDay} from "../firebase/dayApi";
import {AuthContext} from "../providers/AuthProvider";

const tg = window.Telegram.WebApp;

const StartDayPage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [templateId, setTemplateId] = useState('');
    const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs());
    const [cash, setCash] = useState('');
    const [isCashError, setIsCashError] = useState(false);

    useEffect(() => {
        tg.BackButton.onClick(goBack);
        tg.BackButton.show();
        return () => {
            tg.BackButton.offClick(goBack);
            tg.BackButton.hide();
        }
    }, []);

    useEffect(() => {
        if (settings) {
            let template = settings.templates.find(t => t.isDefault);
            if (!template) {
                template = settings.templates[0];
            }
            setTemplateId(template?.id ?? '');
        }
    }, [settings]);

    useEffect(() => {
        if (settings && templateId) {
            setCash(settings.templates.find(t => t.id === templateId)?.dayMoney.toString() ?? '');
        }
    }, [templateId]);

    const goBack = () => nav(-1);

    const onCashChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const num = Number.parseFloat(value);
        setCash(value);
        setIsCashError(isNaN(num) || num < 0);
    }

    const startDay = () => {
        const day: IDay = {
            id: uuid(),
            startTime: startTime.toDate(),
            dayCost: 0,
            endTime: null,
            count: 0,
            cashMoney: Number.parseFloat(cash),
            templateId: templateId,
            deliveries: [],
            dayMoney: 0,
            distance: null,
            expenses: null,
            note: null
        }
        if (user) {
            createDay(user.uid, day).then(() => {
                goBack();
            });
        }

    }

    return (
        <Card>
            <CardHeader title="Начало дня"/>
            <CardContent>
                <Box>
                    <FormControl fullWidth sx={{mb: 2}}>
                        <MobileDateTimePicker ampmInClock={false}
                                              ampm={false}
                                              label="Дата и время"
                                              defaultValue={dayjs()}
                                              value={startTime}
                                              onChange={d => setStartTime(d ?? dayjs())}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="template-select-label">Шаблон</InputLabel>
                        <Select
                            labelId="template-select-label"
                            id="template-select"
                            label="Шаблон"
                            displayEmpty
                            value={templateId}
                            onChange={e => setTemplateId(e.target.value)}>
                            {
                                settings?.templates.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            type="number"
                            margin="normal"
                            required
                            fullWidth
                            id="cash"
                            label="Разменка"
                            name="cash"
                            value={cash}
                            onChange={onCashChanged}
                            error={isCashError}
                        />
                    </FormControl>
                </Box>
            </CardContent>
            <CardActions>
                <Button variant='outlined' onClick={startDay} disabled={isCashError}>Начать</Button>
            </CardActions>
        </Card>
    );
};

export default StartDayPage;
