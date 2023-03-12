import React, {useEffect} from 'react';
import {Typography} from "@mui/material";

const HistoryPage = () => {

    useEffect(() => {
        console.log('--> HistoryPage MOUNTED');
        return () => console.log('--> HistoryPage UNMOUNTED');
    }, []);

    return (
        <Typography>History Page</Typography>
    );
};

export default HistoryPage;
