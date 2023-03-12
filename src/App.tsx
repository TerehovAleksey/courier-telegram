import React, {useEffect, useState} from "react";
import {
    createTheme,
    CssBaseline,
    PaletteMode,
    ThemeProvider,
} from "@mui/material";
import StartError from "./components/StartError";
import AppContent from "./AppContent";

const tg = window.Telegram.WebApp;

function App() {

    const [mode, setMode] = useState<PaletteMode>(tg.colorScheme);
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log('---> App MOUNTED');
        tg.ready();
        const e = tg.platform === 'unknown' || tg.initDataUnsafe.user?.is_bot;
        if (e) {
            setError(e);
        }
        tg.onEvent("themeChanged", () => setMode(tg.colorScheme));
        return () => console.log('---> App UNMOUNTED');
    }, []);

    const theme = React.useMemo(
        () => createTheme({
            palette: {
                mode,
                primary: {
                    main: tg?.themeParams.button_color ?? '#1976d2',
                    dark: tg?.themeParams.button_color ?? '#1565c0'
                },
                background: {
                    default: tg?.themeParams.bg_color ?? '#fff',
                    paper: tg?.themeParams.secondary_bg_color ?? '#fff'
                },
            },
        }),
        [mode],
    );

    return (
        <>
            {
                error ? (<StartError/>) :
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <AppContent/>
                    </ThemeProvider>
            }
        </>
    )
}

export default App
