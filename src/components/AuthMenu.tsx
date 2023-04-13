import React, {useState} from "react";
import {Menu, MenuProps} from "antd";
import {useNavigate} from "react-router-dom";

const items: MenuProps["items"] = [
    {
        label: "Вход",
        key: "/login",
    },
    {
        label: "Регистрация",
        key: "/register",
    },
];

const AuthMenu = () => {

    const nav = useNavigate();
    const [current, setCurrent] = useState(items[0]?.key?.toString() ?? "");

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
        nav(e.key);
    };

    return (
        <Menu style={{minWidth: 180}} mode={"horizontal"} items={items} theme="dark"
              onClick={onClick} selectedKeys={[current]}/>
    );
};

export default AuthMenu;
