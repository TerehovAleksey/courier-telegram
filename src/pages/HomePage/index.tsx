import React, {useContext, useEffect} from 'react';
import {Typography} from "@mui/material";
import {AuthContext} from "../../providers/AuthProvider";
import GeneralCard from "./components/GeneralCard";
import DeliveryCard from "./components/DeliveryCard";

const HomePage = () => {

    const user = useContext(AuthContext);

    useEffect(() => {
        console.log('--> HomePage MOUNTED');
        return () => console.log('--> HomePage UNMOUNTED');
    }, []);

    return (
        <>
            <GeneralCard/>
            <DeliveryCard/>
        </>
    );
};

export default HomePage;
