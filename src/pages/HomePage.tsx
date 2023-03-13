import React, {useContext, useEffect} from 'react';
import {Typography} from "@mui/material";
import {AuthContext} from "../providers/AuthProvider";

const HomePage = () => {

    const user = useContext(AuthContext);

    useEffect(() => {
        console.log('--> HomePage MOUNTED');
        return () => console.log('--> HomePage UNMOUNTED');
    }, []);

    return (
        <>
            <Typography>Home Page</Typography>
            <Typography>{user?.email}</Typography>
        </>
    );
};

export default HomePage;
