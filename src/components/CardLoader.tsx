import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

type CardLoaderProps = {
    isLoading: boolean;
    children: React.ReactNode;
}

const CardLoader = ({isLoading, children}: CardLoaderProps) => {
    return (
        <Spin indicator={antIcon} spinning={isLoading} children={children} delay={500}/>
    );
};

export default CardLoader;
