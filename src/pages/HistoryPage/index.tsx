import React, {useEffect} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import GeneralCard from "./components/GeneralCard";

const HistoryPage = () => {

    useEffect(() => {
        console.log('--> HistoryPage MOUNTED');
        return () => console.log('--> HistoryPage UNMOUNTED');
    }, []);

    return (
        <>
            <FormControl fullWidth margin="normal">
                <InputLabel id="template-select-label">Шаблон</InputLabel>
                <Select
                    labelId="template-select-label"
                    id="template-select"
                    label="Шаблон"
                    displayEmpty>
                    <MenuItem value={0}>Все шаблоны</MenuItem>
                </Select>
            </FormControl>
            <GeneralCard/>
        </>
    );
};

export default HistoryPage;
