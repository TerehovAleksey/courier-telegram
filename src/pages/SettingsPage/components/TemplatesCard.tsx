import React, {useContext, useState} from 'react';
import {Button, Card, Dropdown, List, MenuProps, Space, Typography} from "antd";
import {ISettings} from "../../../models/ISettings";
import {MoreOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {useAdapter} from "../../../hooks/useAdapter";
import {useNavigate} from "react-router-dom";
import {ITemplate} from "../../../models/ITemplate";
import {updateSettings} from "../../../firebase/settingsApi";
import {AuthContext} from "../../../providers/AuthProvider";
import CardLoader from "../../../components/CardLoader";

type TemplatesCardProps = {
    settings: ISettings | null
}

const items: MenuProps['items'] = [
    {
        key: 'edit',
        label: 'изменить',
        icon: <EditOutlined style={{fontSize: '18px'}}/>
    },
    {
        key: 'delete',
        danger: true,
        label: 'удалить',
        icon: <DeleteOutlined style={{fontSize: '18px'}}/>
    },
];

const TemplatesCard = ({settings}: TemplatesCardProps) => {

    const nav = useNavigate();
    const {showConfirm, showNotification} = useAdapter();
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

    const onDropdownClick = (key: string, item: ITemplate) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить шаблон?', () => {
                deleteTemplate(item.id);
            });
        } else {
            nav(`template/${item.id}`);
        }
    };

    return (
        <CardLoader isLoading={loading}>
            <Card title="Шаблоны" bordered={false}>
                <Space direction="vertical" style={{display: 'flex'}}>
                    {(settings === null || settings.templates.length === 0) ?
                        <Typography>Доставок пока нет</Typography> :
                        <List itemLayout="horizontal" dataSource={settings.templates}
                              renderItem={(item) => (
                                  <List.Item
                                      actions={[<Dropdown
                                          menu={{items, onClick: (key) => onDropdownClick(key.key, item)}}>
                                          <a onClick={(e) => e.preventDefault()}>
                                              <MoreOutlined style={{fontSize: '24px'}}/>
                                          </a>
                                      </Dropdown>]}>
                                      <List.Item.Meta title={item.name}
                                                      description={item.isDefault ? 'используется по умолчанию' : ''}/>
                                  </List.Item>
                              )}/>
                    }
                    <Button type="primary" onClick={() => nav('template')}>Новый шаблон</Button>
                </Space>
            </Card>
        </CardLoader>
    );
};

export default TemplatesCard;
