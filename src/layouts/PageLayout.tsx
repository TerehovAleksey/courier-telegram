import React, {useContext} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {AuthContext} from "../providers/AuthProvider";
import {Layout} from "antd";
import PageContainer from "../components/PageContainer";
import dayjs from "dayjs";
import MainMenu from "../components/MainMenu";

const {Header, Content, Footer} = Layout;

const PageLayout = () => {

    const user = useContext(AuthContext);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: 0, display: 'flex'}}>
                <MainMenu/>
            </Header>
            <Content>
                <PageContainer>
                    {user ? <Outlet/> : <Navigate to="/courier-telegram/login"/>}
                </PageContainer>
            </Content>
            <Footer style={{textAlign: 'center'}}>Courier {import.meta.env.VITE_APP_VERSION} ©{dayjs().year()} - {user?.email}</Footer>
        </Layout>
    );
};

export default PageLayout;
