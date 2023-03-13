import React, {useEffect} from 'react';
import {Button, Typography} from "@mui/material";
import {auth} from "../firebase/firebase";

const SettingsPage = () => {

    useEffect(() => {
        console.log('--> SettingsPage MOUNTED');
        return () => console.log('--> SettingsPage UNMOUNTED');
    }, []);

    return (
        <>
        <Typography>Settings Page</Typography>
        <Button onClick={()=> auth.signOut()}>Выход</Button>
        </>
    );
};

export default SettingsPage;
