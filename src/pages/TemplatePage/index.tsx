import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Space} from "antd";
import GeneralCard from "./components/GeneralCard";
import DeliveryTypesCard from "./components/DeliveryTypesCard";
import PaymentTypesCard from "./components/PaymentTypesCard";
import {tgBackButton, tgButton, tgEnabled} from "../../helpers/telegram";
import {useNavigate, useParams} from "react-router-dom";
import {SettingsContext} from "../../providers/SettingsProvider";
import {ITemplate} from "../../models/ITemplate";
import uuid from "react-uuid";
import {useAdapter} from "../../hooks/useAdapter";
import {updateSettings} from "../../firebase/settingsApi";
import {AuthContext} from "../../providers/AuthProvider";
import {ISettings} from "../../models/ISettings";
import CardLoader from "../../components/CardLoader";

const TemplatePage = () => {

    const nav = useNavigate();
    const {id} = useParams();
    const settings = useContext(SettingsContext);
    const user = useContext(AuthContext);
    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

    const goBack = () => nav(-1);

    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState<ITemplate>({
        id: "",
        name: "",
        hourCost: 0,
        dayMoney: 0,
        paymentTypes: [],
        deliveryTypes: [],
        isDefault: false
    });

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = "Сохранить";
            tgButton.show();
            tgBackButton.onClick(goBack);
            tgBackButton.show();
            return () => {
                tgButton.hide();
                tgBackButton.offClick(goBack);
                tgBackButton.hide();
            };
        }
    }, []);

    useEffect(() => {
        if (tgEnabled) {
            tgButton.onClick(save);
            return () => {
                tgButton.offClick(save);
            };
        }
    }, [template]);

    useEffect(() => {
        if (settings && id) {
            const template = settings.templates.find(t => t.id === id);
            if (template) {
                setTemplate(template);
            }
        }
    }, [settings, id]);

    const save = () => {
        form.validateFields()
            .then(() => {
                if (template.paymentTypes.length === 0 || template.deliveryTypes.length === 0) {
                    errorAlert();
                } else if (user && settings) {
                    setLoading(true);
                    const result = [...settings.templates];
                    if (template.id) {
                        result.forEach(t => {
                            if (t.id === template.id) {
                                t.name = template.name;
                                t.dayMoney = template.dayMoney;
                                t.hourCost = template.hourCost;
                                t.isDefault = template.isDefault;
                                t.paymentTypes = template.paymentTypes;
                                t.deliveryTypes = template.deliveryTypes;
                            } else if (template.isDefault) {
                                t.isDefault = false;
                            }
                        });
                    } else {
                        const newTemplate = ({...template, id: uuid()});
                        if (newTemplate.isDefault) {
                            result.forEach(d => {
                                d.isDefault = false;
                            });
                        }
                        result.push(newTemplate);
                    }
                    const newSettings: ISettings = {...settings};
                    newSettings.templates = result;
                    updateSettings(user.uid, newSettings)
                        .then(() => {
                            setLoading(false);
                            nav(-1);
                        });
                }
            }).catch(() => {
            errorAlert();
        });
    };

    const errorAlert = () => showAlert("Проверьте, что все заполнено правильно и есть хотя бы один тип оплаты и один тип доставки!");

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <CardLoader isLoading={loading}>
                <GeneralCard form={form} initialValues={template}
                             onChanged={val => setTemplate(state => ({
                                 ...state,
                                 name: val.name,
                                 hourCost: val.hourCost,
                                 dayMoney: val.dayMoney
                             }))}/>
            </CardLoader>
            <CardLoader isLoading={loading}>
                <DeliveryTypesCard deliveryTypes={template.deliveryTypes} onChanged={dt =>
                    setTemplate(state => ({...state, deliveryTypes: dt}))}/>
            </CardLoader>
            <CardLoader isLoading={loading}>
                <PaymentTypesCard paymentTypes={template.paymentTypes} onChanged={pt =>
                    setTemplate(state => ({...state, paymentTypes: pt}))}/>
            </CardLoader>
            {!tgEnabled && <div style={{textAlign: "center"}}>
                <Button type="primary" size="large" disabled={loading} onClick={save}>Сохранить</Button>
            </div>}
        </Space>
    );
};

export default TemplatePage;
