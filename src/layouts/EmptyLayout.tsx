import React, {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {Layout} from "antd";
import PageContainer from "../components/PageContainer";
import AuthMenu from "../components/AuthMenu";
import PageFooter from "../components/PageFooter";
import {auth} from "../firebase/firebase";

const {Header, Content} = Layout;

const EmptyLayout = () => {

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        setLoggedIn(!!user);
    }, []);

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
                padding: 0,
                display: "flex",
                justifyContent: "center"
            }}>
                <AuthMenu/>
            </Header>
            <Content>
                <PageContainer>
                    {loggedIn ? <Navigate to="/"/> : <Outlet/>}
                </PageContainer>
            </Content>
            <PageFooter/>
        </Layout>
    );
};

export default EmptyLayout;
