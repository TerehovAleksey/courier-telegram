import React, {useEffect, useState} from "react";
import {Descriptions, Divider, Empty} from "antd";
import {IDay} from "../../../models/IDay";

export interface IFilterStatistics {
    time: string | null;
    days: number | null;
    count: number;
    dayMoney: number;
    dayCost: number;
    distance: number;
    expenses: number;
    total: number;
}

type DisplayStatisticsProps = {
    displayType: "date" | "week" | "month";
    days: IDay[];
}

const DisplayStatistics = ({displayType, days}: DisplayStatisticsProps) => {

    const [statistics, setStatistics] = useState<IFilterStatistics | null>(null);

    useEffect(() => {
        if (displayType == "date") {
            setDayStatistics(days[0]);
        } else {
            setDaysStatistics(days);
        }
    }, [displayType, days]);

    const setDayStatistics = (day: IDay | null) => {
        if (day) {
            const stat: IFilterStatistics = {
                days: null,
                dayCost: day.dayCost,
                dayMoney: day.dayMoney,
                count: day.count,
                distance: day.distance ?? 0,
                expenses: day.expenses ?? 0,
                time: `${day.startTime.toLocaleTimeString()} - ${day.endTime?.toLocaleTimeString() ?? "не закончен"}`,
                total: day.dayCost + day.dayMoney - (day.expenses ?? 0)
            };
            setStatistics(stat);
        } else {
            setStatistics(null);
        }
    };

    const setDaysStatistics = (days: IDay[]) => {
        if (days && days.length) {
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
            };
            setStatistics(stat);


        } else {
            setStatistics(null);
        }
    };

    return (
        <div style={{marginTop: 30}}>
            {!statistics && <Empty/>}
            {statistics &&
                <>
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
                    </Descriptions>
                </>
            }
        </div>
    );
};

export default DisplayStatistics;
