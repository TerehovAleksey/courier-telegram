import React, {useEffect, useState} from "react";
import GeneralCard from "./components/GeneralCard";
import DeliveryCard from "./components/DeliveryCard";
import {getCurrentDay, updateDay} from "../../firebase/dayApi";
import {IDay} from "../../models/IDay";
import PageLoader from "../../components/PageLoader";
import StartDayCard from "./components/StartDayCard";
import {Button, Space} from "antd";
import {tgEnabled} from "../../helpers/telegram";
import {useNavigate} from "react-router-dom";
import {calculateRemoveDelivery} from "../../helpers/dayCalculation";
import {useUser} from "../../hooks/useUser";

const HomePage = () => {

    const nav = useNavigate();

    const user = useUser();
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

    const editDelivery = (id: string) => {
        const edited = day?.deliveries.find(d => d.id === id);
        nav("delivery", {state: edited});
    };

    const deleteDelivery = (id: string) => {
        if (day && user) {
            const edited = {...day};
            calculateRemoveDelivery(edited, id);
            updateDay(user.uid, edited)
                .then(() => {
                    setIsLoading(false);
                    setDay(edited);
                });
        }
    };

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            {isLoading && <PageLoader/>}
            {!isLoading && day == null &&
                <>
                    <StartDayCard/>
                    {!tgEnabled && <div style={{textAlign: "center"}}>
                        <Button type="primary" size="large" onClick={() => nav("start")}>Начать</Button>
                    </div>}
                </>
            }
            {!isLoading && day != null &&
                <>
                    <GeneralCard day={day}/>
                    <DeliveryCard day={day} onAddDelivery={() => nav("delivery")}
                                  onEditDelivery={editDelivery}
                                  onDeleteDelivery={deleteDelivery}/>
                </>
            }
        </Space>
    );
};

export default HomePage;
