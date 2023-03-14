import React, {useContext, useEffect} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {AppBar, Container} from "@mui/material";
import {AuthContext} from "../providers/AuthProvider";
import AppMenu from "../modules/AppMenu";
import Box from "@mui/material/Box";

const PageLayout = () => {

    const user = useContext(AuthContext);

    useEffect(()=>{
        console.log('--> PageLayout MOUNTED');
        return () => console.log('--> PageLayout UNMOUNTED');
    },[]);

    return (
        <Container>
            <Box sx={{mb: '56px', py: 2}}>
                {user ? <Outlet/> : <Navigate to="/courier-telegram/auth" />}
            </Box>
            <AppBar position="fixed" sx={{top: "auto", bottom: 0}}>
                <AppMenu/>
            </AppBar>
        </Container>
    );
};

export default PageLayout;
