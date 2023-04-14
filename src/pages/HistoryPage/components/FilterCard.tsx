import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, DatePicker, Form, Select, Space} from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import {IDay} from "../../../models/IDay";
import dayjs, {Dayjs} from "dayjs";
import DisplayStatistics from "./DisplayStatistics";
import {DefaultOptionType} from "antd/es/select";

const {Option} = Select;

type FilterCardProps = {
    days: IDay[];
    deleteDay: (dayId: string) => void;
    reopenDay: (dayId: string) => void;
}

const FilterCard = ({days, deleteDay, reopenDay}: FilterCardProps) => {

    const [type, setType] = useState<"date" | "week" | "month">("week");
    const [date, setDate] = useState<Dayjs>(dayjs());
    const [filteredDays, setFilteredDays] = useState<IDay[]>([]);

    const [form] = Form.useForm();
    const [selector, setSelector] = useState<DefaultOptionType[]>([]);


    useEffect(() => {

        setSelector([]);
        form.resetFields();

        if (date) {
            const filter = type === "date" ? "day" : type;
            const selected = days.filter(d => dayjs(d.startTime).isSame(date, filter));
            if (type === "date") {
                if (selected.length > 1) {
                    setSelector(selected.map(d => ({value: d.id, label: d.startTime.toLocaleTimeString()})));
                    form.setFieldValue("day", selected[0].id);
                }
                if (selected[0]) {
                    setFilteredDays([selected[0]]);
                } else {
                    setFilteredDays([]);
                }
            } else {
                setFilteredDays(selected);
            }
        } else {
            setFilteredDays([]);
        }
    }, [days, type, date]);

    const dates = useMemo(() => {
        return days.map(d => dayjs(d.startTime).format("YYYY-MM-DD"));
    }, [days]);

    const onSelect = (dayId: string) => {
        const day = days.find(d => d.id === dayId);
        if (day) {
            setFilteredDays([day]);
        } else {
            setFilteredDays([]);
        }
    };

    return (
        <Card title="Фильтр" bordered={false}>
            <div style={{display: "flex"}}>
                <Select value={type} onChange={setType} size="large" style={{flexGrow: 1}}>
                    <Option value="date">Дата</Option>
                    <Option value="week">Неделя</Option>
                    <Option value="month">Месяц</Option>
                </Select>
                <DatePicker locale={locale} inputReadOnly size="large" style={{marginLeft: 5, flexGrow: 2}}
                            picker={type}
                            value={date}
                            onChange={d => {
                                if (d) {
                                    setDate(d);
                                }
                            }}
                            dateRender={(current) => {
                                const style: React.CSSProperties = {};
                                const date = current.format("YYYY-MM-DD");
                                if (dates.includes(date)) {
                                    style.border = "1px solid green";
                                }
                                return (
                                    <div className="ant-picker-cell-inner" style={style}>
                                        {current.date()}
                                    </div>
                                );
                            }}
                />
            </div>
            {
                <Form form={form} layout="vertical" style={{marginTop: 10}} hidden={selector.length <= 1}>
                    <Form.Item label="Смены" name="day">
                        <Select
                            size="large"
                            onSelect={onSelect}
                            options={selector}
                        />
                    </Form.Item>
                </Form>
            }
            <DisplayStatistics displayType={type} days={filteredDays}/>
            {
                type === "date" && filteredDays.length == 1 &&
                <Space direction="horizontal">
                    <Button type="primary" ghost disabled={filteredDays[0].endTime === null}
                            onClick={() => reopenDay(filteredDays[0].id)}>Переоткрыть</Button>
                    <Button type="primary" danger ghost onClick={() => deleteDay(filteredDays[0].id)}>Удалить</Button>
                </Space>
            }
        </Card>
    );
};

export default FilterCard;
