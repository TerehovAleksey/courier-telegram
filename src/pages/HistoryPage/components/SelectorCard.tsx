import React, {useContext, useEffect, useState} from "react";
import {Card, Form, Select} from "antd";
import {DefaultOptionType} from "antd/es/select";
import {SettingsContext} from "../../../providers/SettingsProvider";

type SelectorCardProps = {
    defaultKey?: string;
    onSelect: (id: string) => void;
}

const SelectorCard = ({onSelect, defaultKey = "ALL"}: SelectorCardProps) => {

    const emptySelector: DefaultOptionType[] = [{label: "Все", value: defaultKey}];

    const settings = useContext(SettingsContext);
    const [form] = Form.useForm();
    const [selector, setSelector] = useState(emptySelector);

    useEffect(() => {
        if (settings) {
            setSelector(emptySelector.concat(settings.templates.map(t => ({label: t.name, value: t.id}))));
        }
    }, [settings]);

    useEffect(() => {
        form.setFieldValue("templateId", selector[0].value);
        onSelect(selector[0].value?.toString() ?? defaultKey);
    }, [selector]);

    return (
        <Card title="Выберете шаблон" bordered={false}>
            <Form form={form} layout="vertical">
                <Form.Item label="Шаблон" name="templateId"
                           rules={[{required: true, message: "Выберете шаблон"}]}>
                    <Select
                        size="large"
                        onSelect={onSelect}
                        options={selector}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SelectorCard;
