import React from 'react';
import {Layout, theme } from 'antd';
import LayoutHeader from '../LayoutHeader';
import LayoutFooter from '../LayoutFooter';

const { Content } = Layout;

const MainLayout: React.FC<{children: JSX.Element}> = ({children}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content container-main" style={{ background: colorBgContainer }}>
            {children}
        </div>
    </Content>
  );
};

export default MainLayout;