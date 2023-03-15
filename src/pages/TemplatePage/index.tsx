import React, {useEffect} from 'react';
import {Space} from "antd";
import GeneralCard from "./components/GeneralCard";
import DeliveryTypesCard from "./components/DeliveryTypesCard";
import PaymentTypesCard from "./components/PaymentTypesCard";
import {tgBackButton, tgButton, tgEnabled} from "../../helpers/telegram";
import {useNavigate} from "react-router-dom";

const TemplatePage = () => {

    const nav = useNavigate();
    const goBack = () => nav(-1);

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = 'Сохранить';
            //tgButton.onClick(form.submit);
            tgButton.show();
            tgBackButton.onClick(goBack);
            tgBackButton.show();
            return () => {
                //tgButton.offClick(form.submit);
                tgButton.hide();
                tgBackButton.offClick(goBack);
                tgBackButton.hide();
            }
        }
    }, []);

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <GeneralCard/>
            <DeliveryTypesCard/>
            <PaymentTypesCard/>
        </Space>
    );
};

export default TemplatePage;
