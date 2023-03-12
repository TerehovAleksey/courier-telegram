import React, {useContext, useEffect} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {AuthContext} from "../providers/AuthProvider";

const EmptyLayout = () => {

    const user = useContext(AuthContext);

    useEffect(() => {
        console.log('--> EmptyLayout MOUNTED');
        return () => console.log('--> EmptyLayout UNMOUNTED');
    }, []);

    return (
        <Container>
            {user ? <Navigate to="/courier-telegram/"/> : <Outlet/>}
        </Container>
    );
};

export default EmptyLayout;
