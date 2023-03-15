import React from 'react';
import {Card, Descriptions, Space} from "antd";

const GeneralCard = () => {
    return (
        <Card title="Статистика" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Descriptions size="small" column={1}>
                    <Descriptions.Item label="...">...</Descriptions.Item>
                </Descriptions>
            </Space>
        </Card>
    );
};

export default GeneralCard;
