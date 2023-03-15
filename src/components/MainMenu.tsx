import React, {useState} from 'react';
import {Menu} from "antd";
import {HistoryOutlined, HomeOutlined, SettingOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import type { MenuProps } from 'antd/es/menu';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
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
        <Menu style={{margin: '0 auto'}} mode="horizontal"
              items={items}
              defaultSelectedKeys={['/courier-telegram']}
              theme="dark"
              onClick={onClick}
              selectedKeys={[current]}
        />
    );
};

export default MainMenu;
