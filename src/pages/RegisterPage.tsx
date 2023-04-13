import React, {useEffect, useState} from "react";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {Avatar, Button, Form, Input, Space, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {useAdapter} from "../hooks/useAdapter";
import {tgButton, tgButtonAwaiting, tgEnabled} from "../helpers/telegram";
import {PWD_REGEX} from "../../constants";
import CardLoader from "../components/CardLoader";
import {useNavigate} from "react-router-dom";

interface ISignUpForm {
    email: string;
    password: string
    confirmPassword: string
}

const RegisterPage = () => {

    const [form] = Form.useForm();
    const {showAlert, showNoInternetAlert, showUnknownAlert} = useAdapter();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = "Зарегистрироваться";
            tgButton.onClick(form.submit);
            tgButton.show();
            return () => {
                tgButton.offClick(form.submit);
                tgButton.hide();
            };
        }
    }, []);

    useEffect(() => {
        tgButtonAwaiting(loading);
    }, [loading]);

    const onFormSubmit = (values: ISignUpForm) => {
        setLoading(true);
        createUserWithEmailAndPassword(getAuth(), values.email, values.password)
            .then(() => {
                setLoading(false);
                nav("/");
            })
            .catch(error => {
                setLoading(false);
                if (error.code === "auth/email-already-in-use") {
                    showAlert("Пользователь с таким email уже зарегистрирован");
                } else if (error.code === "auth/internal-error") {
                    showNoInternetAlert();
                } else {
                    console.log(error);
                    showUnknownAlert();
                }
            });
    };

    return (
        <Space direction="vertical" style={{display: "flex"}}>
            <div style={{marginTop: 50, textAlign: "center"}}>
                <Avatar size={52} icon={<UserOutlined/>} style={{backgroundColor: "#f56a00"}}/>
                <Typography.Title level={3}>Регистрация</Typography.Title>
            </div>
            <CardLoader isLoading={loading}>
                <Form<ISignUpForm> form={form} layout="vertical" onFinish={onFormSubmit} disabled={loading}>
                    <Form.Item label="Email" name="email"
                               rules={[{required: true, message: "Введите Email!"},
                                   {type: "email", message: "Не похоже на Email!"}]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label="Пароль" name="password"
                               rules={[{required: true, message: "Введите пароль!"},
                                   {min: 8, message: "Не менее 8 символов"},
                                   {pattern: PWD_REGEX, message: "Должны быть буквы, цифры и спец.символы"}]}>
                        <Input.Password size="large"/>
                    </Form.Item>
                    <Form.Item label="Подтверждение пароля" name="confirmPassword"
                               dependencies={["password"]}
                               rules={[{required: true, message: "Подтвердите пароль!"},
                                   ({getFieldValue}) => ({
                                       validator(_, value) {
                                           if (!value || getFieldValue("password") === value) {
                                               return Promise.resolve();
                                           }
                                           return Promise.reject(new Error("Введённые пароли не совпадают!"));
                                       },
                                   }),]}>
                        <Input.Password size="large"/>
                    </Form.Item>
                    {!tgEnabled && <div style={{textAlign: "center"}}>
                        <Button htmlType="submit" type="primary" size="large">Зарегистрироваться</Button>
                    </div>}
                </Form>
            </CardLoader>
        </Space>
    );
};

export default RegisterPage;
