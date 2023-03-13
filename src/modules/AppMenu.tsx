import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import TuneIcon from '@mui/icons-material/Tune';
import {useLocation, useNavigate} from "react-router-dom";

interface IMenu {
    index: number;
    path: string;
    label: string;
    icon: React.ReactNode;
}

const menu: IMenu[] = [
    {index: 0, path: "/courier-telegram/", label: "Главная", icon: <HomeIcon/>},
    {index: 1, path: "/courier-telegram/history", label: "История", icon: <HistoryIcon/>},
    {index: 2, path: "/courier-telegram/settings", label: "Параметры", icon: <TuneIcon/>},
];

const AppMenu = () => {

    const nav = useNavigate();
    const loc = useLocation();
    const [value, setValue] = React.useState(0);

    useEffect(()=>{
        console.log('--> AppMenu MOUNTED');
        return () => console.log('--> AppMenu UNMOUNTED');
    },[]);

    useEffect(() => {
        const path = loc.pathname;
        const index = menu.find(m => m.path === path)?.index ?? 0;
        setValue(index);
    }, [loc]);

    return (
        <Box sx={{width: "100%"}}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    nav(menu[newValue].path);
                }}
            >
                {menu.map(m => (<BottomNavigationAction key={m.index} label={m.label} icon={m.icon}/>))}
            </BottomNavigation>
        </Box>
    );
};

export default AppMenu;
