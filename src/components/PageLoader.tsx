import React from 'react';
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";

const PageLoader = () => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );
};

export default PageLoader;
