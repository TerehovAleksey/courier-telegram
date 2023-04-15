import React from "react";
import {auth} from "../../firebase/firebase";
import GeneralCard from "./components/GeneralCard";
import {Button, Space} from "antd";
import TemplatesCard from "./components/TemplatesCard";
import {useAdapter} from "../../hooks/useAdapter";

const SettingsPage = () => {

    const {showConfirm} = useAdapter();

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <GeneralCard />
            <TemplatesCard />
            <Button type="text" danger style={{width: "100%"}}
                    onClick={() => showConfirm("Вы уверены, что хотите выйти?", () => auth.signOut())}>Выход</Button>
        </Space>
    );
};

export default SettingsPage;
