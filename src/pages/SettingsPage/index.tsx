import React, {useContext} from 'react';
import {auth} from "../../firebase/firebase";
import {SettingsContext} from "../../providers/SettingsProvider";
import GeneralCard from "./components/GeneralCard";
import {Button, Space} from "antd";
import TemplatesCard from "./components/TemplatesCard";
import {useAdapter} from "../../hooks/useAdapter";

const SettingsPage = () => {

    const settings = useContext(SettingsContext);
    const {showConfirm} = useAdapter();

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <GeneralCard settings={settings}/>
            <TemplatesCard settings={settings}/>
            <Button type="text" danger style={{width: '100%'}}
                    onClick={() => showConfirm('Вы уверены, что хотите выйти?', auth.signOut)}>Выход</Button>
        </Space>
    );
};

export default SettingsPage;
