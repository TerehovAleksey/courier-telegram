import React from "react";
import {Dropdown, List, MenuProps} from "antd";
import {DeleteOutlined, EditOutlined, MoreOutlined} from "@ant-design/icons";
import {IIdentityModel} from "../models/IIdentityModel";
import {useAdapter} from "../hooks/useAdapter";

const itemStyle: React.CSSProperties = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    margin: 2
};
const menuItems: MenuProps["items"] = [
    {
        key: "edit",
        label: "изменить",
        icon: <EditOutlined style={{fontSize: "18px"}}/>,
        style: itemStyle,
    },
    {
        key: "delete",
        danger: true,
        label: "удалить",
        icon: <DeleteOutlined style={{fontSize: "18px"}}/>,
        style: itemStyle,
    },
];


interface IEditListProps<T extends IIdentityModel> {
    items: T[];
    title: (item: T) => string;
    description: (item: T) => string;
    onItemEdit: (id: string) => void;
    onItemDelete: (id: string) => void;
}

export function EditList<T extends IIdentityModel>({
                                                       items,
                                                       title,
                                                       description,
                                                       onItemEdit,
                                                       onItemDelete
                                                   }: IEditListProps<T>) {

    const {showConfirm} = useAdapter();

    const onDropdownClick = (key: string, id: string) => {
        if (key === "delete") {
            showConfirm("Вы уверены, что хотите удалить элемент?", () => {
                onItemDelete(id);
            });
        } else {
            showConfirm("Вы уверены, что хотите изменить элемент?", () => {
                onItemEdit(id);
            });
        }
    };

    return (
        <List itemLayout="horizontal"
              dataSource={items}
              renderItem={(item) => (
                  <List.Item
                      actions={[<Dropdown key={item.id}
                                          menu={{
                                              items: menuItems,
                                              onClick: (key) => onDropdownClick(key.key, item.id)
                                          }}>
                          <a onClick={(e) => e.preventDefault()}>
                              <MoreOutlined style={{fontSize: "24px"}}/>
                          </a>
                      </Dropdown>]}>
                      <List.Item.Meta title={title(item)}
                                      description={description(item)}/>
                  </List.Item>
              )}/>
    );
}
