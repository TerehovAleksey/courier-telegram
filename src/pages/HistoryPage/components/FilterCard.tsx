import React, {useEffect, useMemo, useState} from 'react';
import {Card, DatePicker, Descriptions, Divider, Empty, Select} from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU';
import {IDay} from "../../../models/IDay";
import dayjs, {Dayjs} from "dayjs";

const {Option} = Select;

interface IFilterStatistics {
    time: string | null;
    days: number | null;
    count: number;
    dayMoney: number;
    dayCost: number;
    distance: number;
    expenses: number;
    total: number;
}

type FilterCardProps = {
    days: IDay[];
}

const FilterCard = ({days}: FilterCardProps) => {

    const [type, setType] = useState<"date" | "week" | "month">('week');
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [statistics, setStatistics] = useState<IFilterStatistics | null>(null);

    const dates = useMemo(() => {
        return days.map(d => dayjs(d.startTime).format('YYYY-MM-DD'))
    }, [days]);

    const setDayStatistics = (day: IDay | undefined) => {
        if (day) {
            const stat: IFilterStatistics = {
                days: null,
                dayCost: day.dayCost,
                dayMoney: day.dayMoney,
                count: day.count,
                distance: day.distance ?? 0,
                expenses: day.expenses ?? 0,
                time: `${day.startTime.toLocaleTimeString()} - ${day.endTime?.toLocaleTimeString() ?? 'не закончен'}`,
                total: day.dayCost + day.dayMoney - (day.expenses ?? 0)
            }
            setStatistics(stat);
        } else {
            setStatistics(null);
        }
    }

    const setDaysStatistics = (days: IDay[]) => {
        if (days.length) {
            const dayCost = Object.values(days).reduce((cost, day) => cost + day.dayCost, 0);
            const dayMoney = Object.values(days).reduce((cost, day) => cost + day.dayMoney, 0);
            const expenses = Object.values(days).reduce((cost, day) => cost + (day.expenses ?? 0), 0);
            const stat: IFilterStatistics = {
                days: days.length,
                dayCost: dayCost,
                dayMoney: dayMoney,
                count: Object.values(days).reduce((cost, day) => cost + day.count, 0),
                distance: Object.values(days).reduce((cost, day) => cost + (day.distance ?? 0), 0),
                expenses: expenses,
                time: null,
                total: dayCost + dayMoney - expenses
            }
            setStatistics(stat);
        } else {
            setStatistics(null);
        }
    }

    useEffect(() => {
        if (date) {
            if (type === 'date') {
                const selected = days.find(d => dayjs(d.startTime).isSame(date, 'day'));
                setDayStatistics(selected);
            } else {
                const selected = days.filter(d => dayjs(d.startTime).isSame(date, type));
                setDaysStatistics(selected);
            }
        } else {
            setStatistics(null);
        }
    }, [type, date]);

    return (
        <Card title="Фильтр" bordered={false}>
            <div style={{display: 'flex'}}>
                <Select value={type} onChange={setType} size="large" style={{flexGrow: 1}}>
                    <Option value="date">Дата</Option>
                    <Option value="week">Неделя</Option>
                    <Option value="month">Месяц</Option>
                </Select>
                <DatePicker locale={locale} inputReadOnly size="large" style={{marginLeft: 5, flexGrow: 2}}
                            picker={type}
                            value={date}
                            onChange={d => setDate(d)}
                            dateRender={(current) => {
                                const style: React.CSSProperties = {};
                                const date = current.format('YYYY-MM-DD');
                                if (dates.includes(date)) {
                                    style.border = '1px solid green';
                                }
                                return (
                                    <div className="ant-picker-cell-inner" style={style}>
                                        {current.date()}
                                    </div>
                                );
                            }}
                />
            </div>
            <div style={{marginTop: 50}}>
                {!statistics && <Empty/>}
                {statistics &&
                    <Descriptions size="small" column={1}>
                        {
                            statistics.time &&
                            <Descriptions.Item label="Время">{statistics.time}</Descriptions.Item>
                        }
                        {
                            statistics.days &&
                            <Descriptions.Item label="Рабочих дней">{statistics.days}</Descriptions.Item>
                        }
                        <Descriptions.Item label="Доставок">{statistics.count}</Descriptions.Item>
                        <Descriptions.Item label="Чаевые">{statistics.dayMoney.toFixed(2)}</Descriptions.Item>
                        <Descriptions.Item label="К выплате">{statistics.dayCost.toFixed(2)}</Descriptions.Item>
                        <Descriptions.Item label="Расстояние">{statistics.distance.toFixed(2)}</Descriptions.Item>
                        <Descriptions.Item label="Затраты">{statistics.expenses?.toFixed(2)}</Descriptions.Item>
                        <Divider/>
                        <Descriptions.Item label="Итого">{statistics.total.toFixed(2)}</Descriptions.Item>
                    </Descriptions>}
            </div>
        </Card>
    );
};

export default FilterCard;
