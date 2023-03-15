import React, {useContext} from 'react';
import {auth} from "../../firebase/firebase";
import {SettingsContext} from "../../providers/SettingsProvider";
import GeneralCard from "./components/GeneralCard";
import {Button, Space} from "antd";

const SettingsPage = () => {

    const settings = useContext(SettingsContext);

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <GeneralCard settings={settings}/>
            <Button type="primary" onClick={() => auth.signOut()}>Выход</Button>
        </Space>
    );
};

export default SettingsPage;
