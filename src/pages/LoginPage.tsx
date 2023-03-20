import React, {useEffect, useState} from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {LockOutlined} from '@ant-design/icons';
import {Alert, Avatar, Button, Form, Input, Space, Typography} from "antd";
import {useAdapter} from "../hooks/useAdapter";
import {tgButton, tgButtonAwaiting, tgEnabled} from "../helpers/telegram";
import {PWD_REGEX} from "../../constants";
import {useNavigate} from "react-router-dom";
import CardLoader from "../components/CardLoader";

const {Link} = Typography;

interface ILoginForm {
    email: string;
    password: string
}

const LoginPage = () => {

    const [form] = Form.useForm();
    const {showAlert, showNoInternetAlert, showUnknownAlert} = useAdapter();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (tgEnabled) {
            tgButton.text = 'Войти';
            tgButton.onClick(form.submit);
            tgButton.show();
            return () => {
                tgButton.offClick(form.submit);
                tgButton.hide();
            }
        }
    }, []);

    useEffect(() => {
        tgButtonAwaiting(loading);
    }, [loading]);

    const onFormSubmit = (values: ILoginForm) => {
        setLoading(true);
        signInWithEmailAndPassword(getAuth(), values.email, values.password)
            .then(() => {
                setLoading(false);
                nav('/');
            })
            .catch(error => {
                setLoading(false);
                if (error.code === 'auth/user-not-found') {
                    showAlert('Пользователь не найден!');
                } else if (error.code === 'auth/wrong-password') {
                    showAlert('Пароль не подходит!');
                } else if (error.code === 'auth/internal-error') {
                    showNoInternetAlert();
                } else {
                    console.log(error);
                    showUnknownAlert();
                }
            });
    }

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <div style={{marginTop: 50, textAlign: 'center'}}>
                <Avatar size={52} icon={<LockOutlined/>} style={{backgroundColor: '#4e8752'}}/>
                <Typography.Title level={3}>Вход</Typography.Title>
            </div>
            <CardLoader isLoading={loading}>
                <Form<ILoginForm> form={form} layout="vertical" onFinish={onFormSubmit} disabled={loading}>
                    <Form.Item label="Email" name="email"
                               rules={[{required: true, message: 'Введите Email!'},
                                   {type: 'email', message: 'Не похоже на Email!'}]}>
                        <Input size="large"/>
                    </Form.Item>
                    <Form.Item label="Пароль" name="password"
                               rules={[{required: true, message: 'Введите пароль!'},
                                   {min: 8, message: 'Не менее 8 символов'},
                                   {pattern: PWD_REGEX, message: 'Должны быть буквы, цифры и спец.символы'}]}>
                        <Input.Password size="large"/>
                    </Form.Item>
                    {!tgEnabled && <div style={{textAlign: 'center'}}>
                        <Button htmlType="submit" type="primary" size="large" style={{minWidth: 160}}>Войти</Button>
                    </div>}
                </Form>
            </CardLoader>
            {
                !tgEnabled &&
                <div style={{marginTop: 60}}>
                    <Alert type="info" message={
                        <>
                            <Typography>Данное приложение оптимизировано для работы в качестве Telegram Web App и
                                доступно по ссылке</Typography>
                            <Link href="https://t.me/courier_app_bot" target="_blank">
                                @courier_app_bot
                            </Link>
                        </>
                    }/>
                </div>
            }
        </Space>
    );
};

export default LoginPage;
