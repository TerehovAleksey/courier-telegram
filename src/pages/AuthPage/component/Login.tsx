import React, {useCallback, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {EMAIL_REGEX, PWD_REGEX} from "../../../../constants";

const tg = window.Telegram.WebApp;

const Login = () => {

    const [email, setEmail] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);

    useEffect(() => {
        console.log('--> Login MOUNTED');
        return () => console.log('--> Login UNMOUNTED');
    }, []);

    useEffect(() => {
        tg.MainButton.show();
        tg.MainButton.text = 'Войти';
        return () => {
            tg.MainButton.hide();
        };
    }, []);

    useEffect(() => {
        tg.MainButton.onClick(login);
        return () => {
            tg.MainButton.offClick(login);
        };
    }, [email, password]);

    const login = () => {
        console.log('login called');
        const e1 = checkEmail(email);
        const e2 = checkPassword(password);
        if (e1 && e2) {
            signInWithEmailAndPassword(getAuth(), email, password)
                .then(() => {
                    console.log('SignIn Success!');
                })
                .catch(error => {
                    if (error.code === 'auth/user-not-found') {
                        tg.showAlert('Пользователь не найден');
                    } else if (error.code === 'auth/wrong-password') {
                        tg.showAlert('Пароль не подходит');
                    }
                    console.log(error);
                });
        }
    }

    function onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        checkEmail(value);
        setEmail(value);
    }

    function onChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        checkPassword(value)
        setPassword(value);
    }

    function checkEmail(text: string): boolean {
        const result = EMAIL_REGEX.test(text);
        setIsEmailError(!result);
        return result;
    }

    function checkPassword(text: string): boolean {
        const result = PWD_REGEX.test(text);
        setIsPasswordError(!result);
        return result;
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход
                </Typography>
                <Box component="form" noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email адрес"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={onChangeEmail}
                        error={isEmailError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChangePassword}
                        error={isPasswordError}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
