import React, {useEffect, useState} from 'react';
import {ConfigProvider, ThemeConfig, theme} from "antd";

const tg = window.Telegram.WebApp;
const detectDarkMode = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
const config: ThemeConfig = {
    algorithm: theme.defaultAlgorithm
}

type ThemeProviderProps = {
    children: React.ReactNode
}

const ThemeProvider = ({children}: ThemeProviderProps) => {

    //если выполнение не в Telegram, то tg.colorScheme вернёт 'light'
    const [colorMode, setColorMode] = useState(detectDarkMode());

    const [themeConfig, setThemeConfig] = useState<ThemeConfig>(config);

    useEffect(() => {
        const isTgEnv = tg.platform !== 'unknown';
        console.log(isTgEnv ? 'Выполнение с среде телеграм' : 'Выполнение в браузере');
        if (isTgEnv) {
            bindColorScheme();
            tg.onEvent("themeChanged", () => {
                bindColorScheme();
                setColorMode(tg.colorScheme);
            });
        } else {
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addEventListener("change", (event) => {
                    const isDarkTheme = event.matches;
                    setColorMode(isDarkTheme ? 'dark' : 'light');
                });
        }
    }, []);

    useEffect(() => {
        setThemeConfig(config => ({
            ...config,
            algorithm: colorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
        }));
    }, [colorMode]);

    const bindColorScheme = () => {
        setThemeConfig(config => ({
            ...config, token: {
                colorPrimaryBg: tg.themeParams.bg_color,
                colorBgBase: tg.themeParams.bg_color,
                colorBgLayout: tg.themeParams.bg_color,
                colorInfoBg: tg.themeParams.bg_color,
                colorBgContainer: tg.themeParams.secondary_bg_color,
                colorPrimary: tg.themeParams.button_color,
                colorTextBase: tg.themeParams.text_color,
                colorLink: tg.themeParams.link_color,
            }
        }));
    };

    return (
        <ConfigProvider theme={themeConfig}>
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
