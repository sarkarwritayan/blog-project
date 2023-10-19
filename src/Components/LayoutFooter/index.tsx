import React from 'react';
import {Layout } from 'antd';
import moment from 'moment';

const { Footer } = Layout;

const LayoutFooter: React.FC = () => {

  return (
      <Footer style={{ textAlign: 'center' }}>Blog Project ©{moment().year()} Created by Writayan Sarkar</Footer>
  );
};

export default LayoutFooter;