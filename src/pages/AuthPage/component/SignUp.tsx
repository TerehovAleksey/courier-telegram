import React, {useCallback, useEffect, useState} from 'react';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {EMAIL_REGEX, PWD_REGEX} from "../../../../constants";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const tg = window.Telegram.WebApp;

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [isEmailError, setIsEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isPasswordConfirmError, setIsPasswordConfirmError] = useState(false);

    useEffect(() => {
        console.log('--> SignUp MOUNTED');
        return () => console.log('--> SignUp UNMOUNTED');
    }, []);

    useEffect(() => {
        tg.MainButton.show();
        tg.MainButton.text = 'Зарегистрироваться';
        return () => {
            tg.MainButton.hide();
        };
    }, []);

    useEffect(() => {
        tg.MainButton.onClick(signup);
        return () => {
            tg.MainButton.offClick(signup);
        };
    }, [email, password, passwordConfirm]);

    const signup = () => {
        console.log('signup called');
        const e1 = checkEmail(email);
        const e2 = checkPassword(password);
        const e3 = checkPasswordConfirm(passwordConfirm);
        if (e1 && e2 && e3) {
            createUserWithEmailAndPassword(getAuth(), email, password)
                .catch(error => {
                    console.log(error);
                    if (error.code === 'auth/email-already-in-use'){
                        console.log('Пользователь с таким email уже зарегистрирован');
                        tg.showAlert('Пользователь с таким email уже зарегистрирован');
                    }
                    else {
                        tg.showAlert('Произошла ошибка при создании пользователя');
                    }
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

    function onChangePasswordConfirm(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        checkPasswordConfirm(value)
        setPasswordConfirm(value);
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

    function checkPasswordConfirm(text: string): boolean {
        const result = PWD_REGEX.test(text);
        setIsPasswordConfirmError(!result || text !== password);
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
                <Avatar sx={{m: 1, bgcolor: 'warning.main'}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Регистрация
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
                        value={password}
                        onChange={onChangePassword}
                        error={isPasswordError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Подтверждение пароля"
                        type="password"
                        id="confirm-password"
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                        error={isPasswordConfirmError}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
