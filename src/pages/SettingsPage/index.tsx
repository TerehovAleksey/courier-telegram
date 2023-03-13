import React, {useContext, useEffect} from 'react';
import {Button, Typography} from "@mui/material";
import {auth} from "../../firebase/firebase";
import {SettingsContext} from "../../providers/SettingsProvider";
import GeneralCard from "./components/GeneralCard";

const SettingsPage = () => {

    const settings = useContext(SettingsContext);

    useEffect(() => {
        console.log('--> SettingsPage MOUNTED');
        return () => console.log('--> SettingsPage UNMOUNTED');
    }, []);


    return (
        <>
            <GeneralCard settings={settings}/>
            <Button onClick={() => auth.signOut()}>Выход</Button>
        </>
    );
};

export default SettingsPage;
