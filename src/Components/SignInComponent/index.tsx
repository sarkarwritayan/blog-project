import { Button, Form, Input } from 'antd';
import { collection, getDocs } from "firebase/firestore";
import Cookies from 'js-cookie';
import Router from 'next/router';
import React, { useState } from 'react';
import { db } from '../../../firebase';
import {useDispatch} from 'react-redux'
import { dataAction } from '@/redux/features/data';

type FieldType = {
  username?: string;
  password?: string;
};

const SignInComponent: React.FC = () => {

    const [ load, setLoad] = useState(false);

    const dispatch = useDispatch()
    const decryptPassword = (pass: string) => {
        // const bytes  = CryptoJS.AES.decrypt(pass, "Pass");
        // const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return pass;
      };

    const onFinish = async (values: any) => {
        setLoad(true);
        let users:Array<Record<string,string>> = []
        const obj = {
            username: values?.username,
            password: values?.password,
        }
        try {
            await getDocs(collection(db, "Users"))
        .then(async (querySnapshot)=>{               
            users = querySnapshot.docs
                .map((doc) => ({...doc.data()}));
        }).catch((error) => {
            alert('something went wrong')
        })
        const userObj = users.find((item) => item?.username === values?.username)
        console.log({users: users[1].username, val: values?.username, userObj});
        
        if(userObj){
            if(userObj?.password === decryptPassword(values?.password)){
                
                console.log('hiiii');
                Cookies.set('admin', userObj?.admin)
                Cookies.set('authToken', userObj?.username)
                Cookies.set('name', userObj?.username)
                dispatch(dataAction.setAuth({
                    admin: userObj?.admin,
                    authorization:  userObj?.username
                }))
                Router.push('/')
            }
            else{
                alert("Invalid Credential")
            }
        }else{
            alert("Invalid Credential")
        }
            setLoad(false)
        } catch (error) {
            setLoad(false)
            alert('Something went wrong')
        }
      };
      
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

  return( 
    <div>
        <div className='w-100 h-100 center mt-4'>
            <h1>Sign In</h1>
        </div>
        <div className='w-100 h-100 center mt-4'>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className='w-100'
            >
                <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                >
                <Input.Password />
                </Form.Item>

                <Button type='link' onClick={() => Router.push('/sign-up')}>
                    Sign up
                </Button>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={load}>
                    Submit
                </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  )
};

export default SignInComponent;