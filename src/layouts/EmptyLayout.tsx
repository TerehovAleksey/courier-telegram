import React, {useContext} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {AuthContext} from "../providers/AuthProvider";
import {Layout} from "antd";
import PageContainer from "../components/PageContainer";
import dayjs from "dayjs";
import AuthMenu from "../components/AuthMenu";

const {Header, Content, Footer} = Layout;

const EmptyLayout = () => {

    const user = useContext(AuthContext);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: 0, display: "flex", justifyContent: 'center'}}>
                <AuthMenu/>
            </Header>
            <Content>
                <PageContainer>
                    {user ? <Navigate to="/courier-telegram/"/> : <Outlet/>}
                </PageContainer>
            </Content>
            <Footer style={{textAlign: 'center'}}>Courier ©{dayjs().year()}</Footer>
        </Layout>
    );
};

export default EmptyLayout;
