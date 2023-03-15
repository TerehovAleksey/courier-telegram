import React, {useEffect} from 'react';
import GeneralCard from "./components/GeneralCard";
import {Card, Form, Select, Space} from "antd";
import FilterCard from "./components/FilterCard";

const HistoryPage = () => {

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <Card>
                <Form layout="vertical">
                    <Form.Item label="Шаблон" name="templateId"
                               rules={[{required: true, message: 'Выберете шаблон'}]}>
                        <Select
                            size="large"
                            onChange={e => console.log(e)}
                            options={Array(5).fill('item', 0, 5).map((t, i) => ({value: i, label: `${t} ${i}`}))}
                        />
                    </Form.Item>
                </Form>
            </Card>
            <GeneralCard/>
            <FilterCard/>
        </Space>
    );
};

export default HistoryPage;
