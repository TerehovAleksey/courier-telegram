import * as React from 'react';
import Box from '@mui/material/Box';
import {useEffect, useState} from "react";
import {Container, Tab, Tabs, Typography} from "@mui/material";
import Login from "./component/Login";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {

    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`auth-tabpanel-${index}`}
            aria-labelledby={`auth-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Container>{children}</Container>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `auth-tab-${index}`,
        'aria-controls': `auth-tabpanel-${index}`,
    };
}

export default function AuthPage() {

    const [value, setValue] = useState(0);

    useEffect(() => {
        console.log('--> AuthPage MOUNTED');
        return () => console.log('--> AuthPage UNMOUNTED');
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} >
                    <Tab label="Вход" {...a11yProps(0)} sx={{width: '50%'}}/>
                    <Tab label="Регистрация" {...a11yProps(1)} sx={{width: '50%'}}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Login />
            </TabPanel>
            <TabPanel value={value} index={1}>
               В разработке
            </TabPanel>
        </Box>
    );
}
