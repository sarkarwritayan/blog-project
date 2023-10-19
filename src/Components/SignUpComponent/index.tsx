import { Button, Form, Input } from 'antd';
import { addDoc, collection, getDocs } from "firebase/firestore";
import Router from 'next/router';
import React, { useState } from 'react';
import { db } from '../../../firebase';

let CryptoJS = require('crypto-js');

type FieldType = {
  username?: string;
  password?: string;
  confirm_password?: string;
};

const SignUpComponent: React.FC = () => {

    const [ load, setLoad] = useState(false);

    const onFinish = async (values: any) => {
        setLoad(true);
        let users:Array<Record<string,string>> = []
        const obj = {
            username: values?.username,
            password: encryptPassword(values?.password),
            admin: false,
        }
        await getDocs(collection(db, "Users"))
        .then(async (querySnapshot)=>{               
            users = querySnapshot.docs
                .map((doc) => ({...doc.data()}));

                try {
                    if(users.find((item) => item?.username === values?.username))
                    {
                        setLoad(false)
                        alert('Same username already exists')
                    }else{
                        await addDoc(collection(db, "Users"), obj)
                        await Router.push('/sign-in')
                        setLoad(false)
                    }
                } catch (error) {
                    setLoad(false)
                    alert('Something went wrong')
                }
        }).catch((error) => {
            alert('something went wrong')
        })
      };
      
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

      const encryptPassword = (pass: string) => {
        // const ciphertext = CryptoJS.AES.encrypt(pass, 'Pass').toString();
        return pass;
      };

  return( 
    <div>
        <div className='w-100 h-100 center mt-4'>
            <h1>Sign Up</h1>
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

                <Form.Item<FieldType>
                label="Confirm Password"
                name="confirm_password"
                rules={[
                    {
                    required: true,
                    message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                    },
                    }),
                ]}
                >
                <Input.Password />
                </Form.Item>

                <Button type='link' onClick={() => Router.push('/sign-in')}>
                    Sign in
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

export default SignUpComponent;