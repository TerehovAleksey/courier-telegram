import React, {useState} from 'react';
import {Menu, MenuProps} from "antd";
import {HistoryOutlined, HomeOutlined, SettingOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const items: MenuProps['items'] = [
    {
        label: 'Главная',
        key: '/courier-telegram',
        icon: <HomeOutlined />,
    },
    {
        label: 'История',
        key: '/courier-telegram/history',
        icon: <HistoryOutlined />,
    },
    {
        label: 'Параметры',
        key: '/courier-telegram/settings',
        icon: <SettingOutlined />,
    },
];

const MainMenu = () => {

    const nav = useNavigate();
    const [current, setCurrent] = useState(items[0]?.key?.toString() ?? "");

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        nav(e.key);
    };

    return (
        <Menu style={{margin: '0 auto'}} mode="horizontal" items={items} theme="dark"
              onClick={onClick} selectedKeys={[current]}/>
    );
};

export default MainMenu;
