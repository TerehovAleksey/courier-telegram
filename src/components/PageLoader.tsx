import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const PageLoader = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
            <Spin indicator={antIcon} />
        </div>
    );
};

export default PageLoader;
