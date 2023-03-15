import React, {useEffect} from 'react';
import GeneralCard from "./components/GeneralCard";
import {Space} from "antd";

const HistoryPage = () => {

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <GeneralCard/>
        </Space>
    );
};

export default HistoryPage;
