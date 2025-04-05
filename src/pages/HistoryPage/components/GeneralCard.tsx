import React, {useEffect, useState} from "react";
import {Card, Col, Row, Statistic} from "antd";
import {IDay} from "../../../models/IDay";
import CountUp from "react-countup";
import {valueType} from "antd/es/statistic/utils";

type GeneralCardProps = {
    days: IDay[];
}

const formatter = (value: valueType) => <CountUp end={Number.parseInt(value.toString())}/>;

const GeneralCard = ({days}: GeneralCardProps) => {

    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const total = Object.values(days).reduce((a, b) => a + b.count, 0);
        setTotalCount(total);
    }, [days]);

    return (
        <Card title="Статистика" variant={'borderless'}>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Всего доставок" value={totalCount} formatter={formatter}/>
                </Col>
                <Col span={12}>
                    <Statistic title="Всего рабочих дней" value={days.length} formatter={formatter}/>
                </Col>
            </Row>
        </Card>
    );
};

export default GeneralCard;
