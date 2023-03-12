import React, {useEffect} from 'react';
import {Typography} from "@mui/material";

const HomePage = () => {

    useEffect(() => {
        console.log('--> HomePage MOUNTED');
        return () => console.log('--> HomePage UNMOUNTED');
    }, []);

    return (
        <Typography>Home Page</Typography>
    );
};

export default HomePage;
