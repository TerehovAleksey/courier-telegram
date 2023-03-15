import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../providers/AuthProvider";
import GeneralCard from "./components/GeneralCard";
import DeliveryCard from "./components/DeliveryCard";
import {getCurrentDay} from "../../firebase/dayApi";
import {IDay} from "../../models/IDay";
import PageLoader from "../../components/PageLoader";
import StartDayCard from "./components/StartDayCard";
import {Space} from "antd";

const HomePage = () => {

    const user = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [day, setDay] = useState<IDay | null>(null);

    useEffect(() => {
        if (user) {
            getCurrentDay(user.uid).then(response => {
                setDay(response);
                setIsLoading(false);
            });
        }
    }, [user]);

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            {isLoading && <PageLoader/>}
            {!isLoading && day == null && <StartDayCard/>}
            {!isLoading && day != null &&
                <>
                    <GeneralCard day={day}/>
                    <DeliveryCard day={day}/>
                </>}
            {}
        </Space>
    );
};

export default HomePage;
