import { Button, Form, Input } from 'antd';
import { collection, getDocs } from "firebase/firestore";
import Cookies from 'js-cookie';
import Router from 'next/router';
import React, { useState } from 'react';
import { db } from '../../../firebase';
import {useDispatch} from 'react-redux'
import { dataAction } from '@/redux/features/data';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";

type FieldType = {
  username?: string;
  password?: string;
};

const SignInComponent: React.FC = () => {

    const [ load, setLoad] = useState(false);

    const afterLogin = (userObj: { admin: boolean; username: string; }, token: string) => {
        Cookies.set('admin', userObj?.admin as unknown as string)
        Cookies.set('authToken', token)
        Cookies.set('name', userObj?.username)
        dispatch(dataAction.setAuth({
            admin: userObj?.admin,
            authorization:  token
        }))
        Router.push('/')
    }

    const dispatch = useDispatch()
    const decryptPassword = (hash:string, pass: string) => {
       const result =  bcrypt.compareSync(pass, hash);
        
        return result;
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
            users = querySnapshot.docs.map((doc) => ({...doc.data()}));

            const userObj = users.find((item) => item?.username === values?.username)
            
            if(userObj){                
                if(decryptPassword(userObj?.password, values?.password)){
                    let secret = 'qwerty';
                    const token = jwt.sign(userObj, secret);
                    afterLogin(userObj as unknown as { admin: boolean; username: string; }, token)
                    Cookies.set('logType', 'normal')
                    
                }
                else{
                    alert("Invalid Credential")
                }
            }else{
                alert("Invalid Credential")
            }
                setLoad(false)
            }).catch((error) => {
            setLoad(false)
            console.error(error);
            
            alert('something went wrong')
        })
        } catch (error) {
            setLoad(false)
            console.error(error);
            
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
        <div className='center'>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log({credentialResponse});
                    const userDetails = jwt_decode(credentialResponse?.credential as string)
                    const obj = {
                        admin: false,
                        username: (userDetails as Record<string,string>).email
                    }
                    afterLogin(obj, credentialResponse?.credential as string);
                    Cookies.set('logType', 'social')
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    </div>
  )
};

export default SignInComponent;