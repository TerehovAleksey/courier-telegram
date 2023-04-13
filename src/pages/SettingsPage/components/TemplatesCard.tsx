import React, {useContext, useState} from "react";
import {Button, Card, Space, Typography} from "antd";
import {ISettings} from "../../../models/ISettings";
import {useAdapter} from "../../../hooks/useAdapter";
import {useNavigate} from "react-router-dom";
import {updateSettings} from "../../../firebase/settingsApi";
import {AuthContext} from "../../../providers/AuthProvider";
import CardLoader from "../../../components/CardLoader";
import {EditList} from "../../../components/EditList";

type TemplatesCardProps = {
    settings: ISettings | null
}

const TemplatesCard = ({settings}: TemplatesCardProps) => {

    const nav = useNavigate();
    const {showNotification} = useAdapter();
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const deleteTemplate = (id: string) => {
        if (user && settings) {
            setLoading(true);
            updateSettings(user.uid, ({...settings, templates: settings.templates.filter(t => t.id !== id)}))
                .then(() => showNotification("Параметры успешно обновлены!"))
                .finally(() => setLoading(false));
        }
    };

    return (
        <CardLoader isLoading={loading}>
            <Card title="Шаблоны" bordered={false}>
                <Space direction="vertical" style={{display: "flex"}}>
                    {(settings === null || settings.templates.length === 0) ?
                        <Typography>Доставок пока нет</Typography> :
                        <EditList items={settings.templates}
                                  title={item => item.name}
                                  description={item => item.isDefault ? "используется по умолчанию" : ""}
                                  onItemEdit={id => nav(`template/${id}`)}
                                  onItemDelete={id => deleteTemplate(id)}/>
                    }
                    <Button type="primary" onClick={() => nav("template")}>Новый шаблон</Button>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default TemplatesCard;
