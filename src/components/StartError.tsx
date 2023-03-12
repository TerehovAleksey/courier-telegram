import React from 'react';
import {Alert, AlertTitle, Box, Container, Divider, Link, Typography} from "@mui/material";

const StartError = () => {
    return (
        <Container>
            <Box sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Alert severity="error" sx={{maxWidth: 600, padding: 5}}>
                    <AlertTitle><strong>Ошибка</strong></AlertTitle>
                    <Typography>
                        Если вы видите данное сообщение, то или вы пытаетесь запустить приложение не в
                        среде <strong>Telegram</strong> или вы бот ;)
                    </Typography>
                    <Divider sx={{marginY: 2}}/>
                    <Typography>
                        Приложение доступно по ссылке <Link href="https://t.me/courier_app_bot">@courier_app_bot</Link>
                    </Typography>
                </Alert>
            </Box>
        </Container>
    );
};

export default StartError;
