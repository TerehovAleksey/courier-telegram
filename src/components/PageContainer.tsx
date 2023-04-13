import React from "react";

type PageContainerProps = {
    children: React.ReactNode
}

const PageContainer = ({children}: PageContainerProps) => {
    return (
        <div style={{maxWidth: 420, width: "100%", margin: "0 auto", padding: 10}}>
            {children}
        </div>
    );
};

export default PageContainer;
