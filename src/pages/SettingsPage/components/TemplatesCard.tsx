import React, {useState} from "react";
import {Button, Card, Space, Typography} from "antd";
import {useAdapter} from "../../../hooks/useAdapter";
import {useNavigate} from "react-router-dom";
import {updateSettings} from "../../../firebase/settingsApi";
import CardLoader from "../../../components/CardLoader";
import {EditList} from "../../../components/EditList";
import {useUser} from "../../../hooks/useUser";
import {useSettings} from "../../../hooks/useSettings";

const TemplatesCard = () => {

    const nav = useNavigate();
    const user = useUser();
    const settings = useSettings();
    const {showNotification} = useAdapter();
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
            <Card title="Шаблоны" variant={'borderless'}>
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
