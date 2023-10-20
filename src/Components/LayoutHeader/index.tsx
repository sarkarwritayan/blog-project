// @ts-nocheck
import { Layout, Menu, theme } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {useSelector, useDispatch} from "react-redux";
import { dataAction } from '@/redux/features/data';
import { googleLogout } from '@react-oauth/google';

const { Header } = Layout;

const LayoutHeader: React.FC = () => {
  const dispatch = useDispatch()
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const authToken = Cookies.get('authToken')

  const router = useRouter()
  const selectPage = (): string => {
    if(router.pathname === '/')return('0')
    else if(router.pathname === '/create-blog')return('1')
    return '0'
  }
  const [page, setPage] = useState<string>(selectPage());

  const {admin, authorization} = useSelector((state) => state?.data?.data)
  
  const navItems: ItemType<MenuItemType>[] = admin ? [
    {
        key:'0',
        label: "Blogs",
        onClick:  () => {
            router.push('/')
        }
    },
    {
      key: '1',
      label: "Create",
      onClick: () => {
          router.push('/create-blog');
      }
    }
  ] : [
    {
      key:'0',
      label: "Blogs",
      onClick:  () => {
          router.push('/')
      }
  },
  ]

    navItems[2]?.key==='2' && navItems.pop();
    authorization ? navItems.push({
        key: '2',
        label: "Logout",
        onClick: () => {
            const type = Cookies.get('logType')
            type === 'social' && googleLogout();
            Cookies.remove('authToken')
            Cookies.remove('name')
            Cookies.remove('admin')
            Cookies.remove('logType')

            dispatch(dataAction.setAuth({
              admin: null,
              authorization:  false
          }))
            router.push('/sign-in');
        }
      }) : navItems.push({
        key: '2',
        label: "Sign In",
        onClick: () => {
          router.push('/sign-in');
        }
      }) 


  useEffect(() => {
    setPage(selectPage())
  },[router.pathname])

  return (
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          onSelect={(e) => {setPage(e?.key ?? '0')}}
          items={navItems}
          defaultSelectedKeys={[page]}
          activeKey={page}
        />
      </Header>    
  );
};

export default LayoutHeader;