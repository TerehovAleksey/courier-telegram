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
import {IDelivery} from "../models/IDelivery";
import uuid from "react-uuid";
import {SettingsContext} from "../providers/SettingsProvider";
import {AuthContext} from '../providers/AuthProvider';
import {IDay} from "../models/IDay";
import {getCurrentDay, updateDay} from "../firebase/dayApi";
import {ITemplate} from "../models/ITemplate";
import {useNavigate} from "react-router-dom";

const DeliveryPage = () => {

    const nav = useNavigate();

    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);

    const [day, setDay] = useState<IDay | null>(null);
    const [template, setTemplate] = useState<ITemplate | null>(null);

    const [time, setTime] = useState<dayjs.Dayjs>(dayjs());
    const [cost, setCost] = useState('0');
    const [isCostError, setIsCostError] = useState(false);
    const [paymentTypeId, setPaymentTypeId] = useState('');
    const [deliveryTypeId, setDeliveryTypeId] = useState('');
    const [delivery, setDelivery] = useState<IDelivery>({
        id: uuid(),
        cost: 0,
        dateTime: new Date(),
        deliveryType: null,
        paymentType: null,
        address: null,
        number: null,
        note: null,
    });

    useEffect(() => {
        if (user) {
            getCurrentDay(user.uid).then(d => {
                setDay(d);
                const template = settings?.templates.find(t => t.id === d?.templateId);
                if (template) {
                    setTemplate(template);
                    let pId = template.paymentTypes.find(t => t.isDefault)?.id;
                    if (!pId) {
                        pId = template.paymentTypes[0]?.id;
                    }
                    setPaymentTypeId(pId ?? null);
                    let dId = template.deliveryTypes.find(t => t.isDefault)?.id;
                    if (!dId) {
                        dId = template.deliveryTypes[0]?.id;
                    }
                    setDeliveryTypeId(dId ?? null);
                }
            });
        }
    }, [user]);

    const onCostChanged = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const num = Number.parseFloat(value);
        setCost(value);
        setIsCostError(isNaN(num) || num < 0);
    }

    const addDelivery = () => {
        delivery.dateTime = time.toDate();
        delivery.cost = Number.parseFloat(cost);
        delivery.deliveryType = template?.deliveryTypes.find(t => t.id == deliveryTypeId) ?? null;
        delivery.paymentType = template?.paymentTypes.find(t => t.id == paymentTypeId) ?? null;

        if (day && user){
            //TODO: куда бы логику обновления дня
            day.count++;
            day.dayCost += delivery.deliveryType?.cost ?? 0;
            if (delivery.paymentType?.addToDayCash) {
                day.cashMoney += delivery.cost;
            }
            if (day.deliveries) {
                day.deliveries.push(delivery);
            } else {
                day.deliveries = [delivery];
            }
            updateDay(user.uid, day).then(() => nav(-1));
        }
    }

    return (
        <Card>
            <CardHeader title="Доставка"/>
            <CardContent>
                <Box>
                    <FormControl fullWidth margin="normal">
                        <MobileDateTimePicker ampmInClock={false}
                                              ampm={false}
                                              label="Дата и время"
                                              defaultValue={dayjs()}
                                              value={time}
                                              onChange={d => setTime(d ?? dayjs())}/>
                    </FormControl>
                    <TextField
                        type="text"
                        margin="normal"
                        fullWidth
                        id="number"
                        label="Номер"
                        name="number"
                        value={delivery.number ?? ''}
                        onChange={e => setDelivery(d => ({...d, number: e.target.value}))}
                    />
                    <TextField
                        type="text"
                        margin="normal"
                        fullWidth
                        id="address"
                        label="Адрес"
                        name="address"
                        value={delivery.address ?? ''}
                        onChange={e => setDelivery(d => ({...d, address: e.target.value}))}
                    />
                    <TextField
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        id="cash"
                        label="Сумма"
                        name="cash"
                        value={cost}
                        onChange={onCostChanged}
                        error={isCostError}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="template-select-label">Тип оплаты</InputLabel>
                        <Select
                            labelId="template-select-label"
                            id="template-select"
                            label="Тип оплаты"
                            displayEmpty
                            value={paymentTypeId}
                            onChange={e => setPaymentTypeId(e.target.value)}>
                            {
                                template?.paymentTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="template-select-label">Вид доставки</InputLabel>
                        <Select
                            labelId="template-select-label"
                            id="template-select"
                            label="Вид доставки"
                            displayEmpty
                            value={deliveryTypeId}
                            onChange={e => setDeliveryTypeId(e.target.value)}>
                            {
                                template?.deliveryTypes.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <TextField
                        type="text"
                        margin="normal"
                        fullWidth
                        id="note"
                        label="Примечание"
                        name="note"
                        value={delivery.note ?? ''}
                        onChange={e => setDelivery(d => ({...d, note: e.target.value}))}
                    />
                </Box>
            </CardContent>
            <CardActions>
                <Button variant='outlined' onClick={addDelivery} disabled={isCostError}>Добавить</Button>
            </CardActions>
        </Card>
    );
};

export default DeliveryPage;
