import React, {useEffect} from 'react';
import {Typography} from "@mui/material";

const SettingsPage = () => {

    useEffect(() => {
        console.log('--> SettingsPage MOUNTED');
        return () => console.log('--> SettingsPage UNMOUNTED');
    }, []);

    return (
        <Typography>Settings Page</Typography>
    );
};

export default SettingsPage;
