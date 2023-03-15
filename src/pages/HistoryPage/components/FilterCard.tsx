import React, {useState} from 'react';
import {Card, DatePicker, Empty, Select, Space} from "antd";

const {Option} = Select;

const FilterCard = () => {
    const [type, setType] = useState<"date" | "week" | "month">('date');
    return (
        <Card title="Фильтр" bordered={false}>
            <div style={{display: 'flex'}}>
                <Select value={type} onChange={setType} size="large" style={{flexGrow: 1}}>
                    <Option value="date">Дата</Option>
                    <Option value="week">Неделя</Option>
                    <Option value="month">Месяц</Option>
                </Select>
                <DatePicker inputReadOnly size="large" style={{marginLeft: 5, flexGrow: 2}} picker={type}
                            onChange={(value) => console.log(value)}/>
            </div>
            <div style={{marginTop: 50}}>
                <Empty/>
            </div>
        </Card>
    );
};

export default FilterCard;
