import React from 'react';
import {Button, Card, Dropdown, List, MenuProps, Space, Typography} from "antd";
import {ISettings} from "../../../models/ISettings";
import {MoreOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import {useAdapter} from "../../../hooks/useAdapter";
import {useNavigate} from "react-router-dom";

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
    const {showConfirm} = useAdapter();

    const onClick: MenuProps['onClick'] = ({key}) => {
        if (key === 'delete') {
            showConfirm('Вы уверены, что хотите удалить шаблон?', () => {
            });
        } else {
            //
        }
    };

    return (
        <Card title="Шаблоны" bordered={false}>
            <Space direction="vertical" style={{display: 'flex'}}>
                {(settings === null || settings.templates.length === 0) ?
                    <Typography>Доставок пока нет</Typography> :
                    <List itemLayout="horizontal" dataSource={settings.templates}
                          renderItem={(item) => (
                              <List.Item actions={[<Dropdown menu={{items, onClick}}>
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
    );
};

export default TemplatesCard;
