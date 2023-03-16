import React, {useEffect} from 'react';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {LockOutlined} from '@ant-design/icons';
import {Alert, Avatar, Button, Form, Input, Space, Typography} from "antd";
import {useAdapter} from "../hooks/useAdapter";
import {tgButton, tgEnabled} from "../helpers/telegram";
import {PWD_REGEX} from "../../constants";
import {Link} from "react-router-dom";

interface ILoginForm {
    email: string;
    password: string
}

const LoginPage = () => {

    const [form] = Form.useForm();
    const {showAlert} = useAdapter();

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

    const onFormSubmit = (values: ILoginForm) => {
        signInWithEmailAndPassword(getAuth(), values.email, values.password)
            .catch(error => {
                console.log(error);
                if (error.code === 'auth/user-not-found') {
                    showAlert('Пользователь не найден');
                } else if (error.code === 'auth/wrong-password') {
                    showAlert('Пароль не подходит');
                }
            });
    }

    return (
        <Space direction="vertical" style={{display: 'flex'}}>
            <div style={{marginTop: 50, textAlign: 'center'}}>
                <Avatar size={52} icon={<LockOutlined/>} style={{backgroundColor: '#4e8752'}}/>
                <Typography.Title level={3}>Вход</Typography.Title>
            </div>
            <Form<ILoginForm> form={form} layout="vertical" onFinish={onFormSubmit}>
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
            {
                !tgEnabled &&
                <div>
                    <Alert type="info" message={
                        <>
                            <Typography>Данное приложение оптимизировано для работы в качестве Telegram Web App и
                                доступно по ссылке</Typography>
                            <Typography.Link><Link
                                to="https://t.me/courier_app_bot">@courier_app_bot</Link></Typography.Link>
                        </>
                    }/>
                </div>
            }
        </Space>
    );
};

export default LoginPage;
