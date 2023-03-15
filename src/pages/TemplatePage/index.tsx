import React, {useContext, useEffect, useState} from 'react';
import {Form, Space} from "antd";
import GeneralCard from "./components/GeneralCard";
import DeliveryTypesCard from "./components/DeliveryTypesCard";
import PaymentTypesCard from "./components/PaymentTypesCard";
import {tgBackButton, tgButton, tgEnabled} from "../../helpers/telegram";
import {useNavigate} from "react-router-dom";
import {SettingsContext} from "../../providers/SettingsProvider";
import {ITemplate} from "../../models/ITemplate";
import uuid from "react-uuid";

const TemplatePage = () => {

    const nav = useNavigate();
    const settings = useContext(SettingsContext);
    const [form] = Form.useForm();

    const [template, setTemplate] = useState<ITemplate>({
        id: uuid(),
        name: '',
        hourCost: 0,
        dayMoney: 0,
        paymentTypes: [],
        deliveryTypes: [],
        isDefault: false
    });

    useEffect(() => {
        if (settings) {
            setTemplate(settings.templates[0]);
        }
    }, [settings]);

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
            <GeneralCard form={form} initialValues={template}
                         onFormSubmit={val => console.log(val)}/>
            <DeliveryTypesCard deliveryTypes={template.deliveryTypes} onChanged={dt =>
                console.log('deliveryTypes', dt)}/>
            <PaymentTypesCard paymentTypes={template.paymentTypes} onChanged={pt =>
                console.log('paymentTypes', pt)}/>
        </Space>
    );
};

export default TemplatePage;
