import React from "react";
import {Layout} from "antd";
import dayjs from "dayjs";

const {Footer} = Layout;

type PageFooterProps = {
    user?: string | null | undefined;
}

const PageFooter = ({user}: PageFooterProps) => {
    return (
        <Footer style={{textAlign: "center"}}>
            Courier {import.meta.env.VITE_APP_VERSION} ©{dayjs().year()}{user ? ` - ${user}` : ""}
        </Footer>
    );
};

export default PageFooter;
