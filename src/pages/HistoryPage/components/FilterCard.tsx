import React, {useMemo, useState} from 'react';
import {Card, DatePicker, Descriptions, Divider, Empty, Select} from "antd";
import locale from 'antd/es/date-picker/locale/ru_RU';
import {IDay} from "../../../models/IDay";
import dayjs, {Dayjs} from "dayjs";

const {Option} = Select;

type FilterCardProps = {
    days: IDay[];
}

const FilterCard = ({days}: FilterCardProps) => {

    const [type, setType] = useState<"date" | "week" | "month">('date');
    const [day, setDay] = useState<IDay | null>(null);

    const dates = useMemo(() => {
        return days.map(d => dayjs(d.startTime).date())
    }, [days]);

    const onDateSelected = (date: Dayjs | null) => {
        if (date) {
            //тут надо смотреть, день, неделя или месяц и в зависимости от этого менять логику
            const selected = days.find(d => d.startTime.toDateString() === date.toDate().toDateString());
            setDay(selected ?? null);
        }
    }

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
                            onChange={onDateSelected}
                            dateRender={(current) => {
                                const style: React.CSSProperties = {};
                                if (dates.includes(current.date())) {
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
                {!day && <Empty/>}
                {day &&
                    <Descriptions size="small" column={1}>
                        <Descriptions.Item label="Доставок">{day.count}</Descriptions.Item>
                        <Descriptions.Item label="Чаевые">{day.dayMoney}</Descriptions.Item>
                        <Descriptions.Item label="К выплате">{day.dayCost}</Descriptions.Item>
                        <Descriptions.Item label="Расстояние">{day.distance}</Descriptions.Item>
                        <Descriptions.Item label="Затраты">{day.expenses}</Descriptions.Item>
                        <Divider/>
                        <Descriptions.Item label="Итого">{day.dayCost + day.dayMoney - (day.expenses ?? 0)}</Descriptions.Item>
                    </Descriptions>}
            </div>
        </Card>
    );
};

export default FilterCard;
