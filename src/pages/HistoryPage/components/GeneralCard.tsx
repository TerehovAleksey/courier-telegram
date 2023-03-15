import React, {useMemo} from 'react';
import {Card, Descriptions, Space} from "antd";
import {IDay} from "../../../models/IDay";

type GeneralCardProps = {
    days: IDay[];
}

const GeneralCard = ({days}: GeneralCardProps) => {

    const totalCount = useMemo(() => Object.values(days).reduce((a, b) => a + b.count, 0), [days]);

    return (
        <Card title="Статистика" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Всего доставок">{totalCount}</Descriptions.Item>
                    <Descriptions.Item label="Всего рабочих дней">{days.length}</Descriptions.Item>
                </Descriptions>
            </Space>
        </Card>
    );
};

export default GeneralCard;
