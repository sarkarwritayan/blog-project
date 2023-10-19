import { Button, Col, Form, Input, Row, Space } from 'antd';
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DocumentData } from "firebase/firestore";
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase';

const CreateBlogComponent: React.FC<{ blog: DocumentData | undefined }> = ({blog = {}}) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>();
    const edit = Object.keys(blog ?? {}).length > 0
    const [loader, setLoader] = useState<boolean | { delay?: number | undefined; } | undefined>(false);

    const router = useRouter();

    useEffect(() => {
        if(edit) {
            form.setFieldsValue({
                title: blog?.title,
                description: blog?.description,
            })
        }
    }, [])

    const handleImage = (files: any) => {
        if(files && files[0].size < 10000000){
            setFile(files[0]);
        }else{
            alert("Image is too large")
        }
    }

    const onFinish = async (e: any) => {
        const postedAt = `${moment().format('YYYY-MM-DD HH:mm:ss')}`
        setLoader(true)
        if(file){
            const storageRef = ref(storage,`blogImage/${e.title}_${postedAt}`);
            const blob = new Blob([file], { type: e?.file?.type ?? 'image/png'})
            const uploadImage = uploadBytes(storageRef, blob)
            uploadImage.then(async () => {
                getDownloadURL(storageRef).then(async(url) => {
                    edit ? await editBlogtoDB(e, url) : await addBlogtoDB(e,postedAt, url)
                }
                ).catch(_err => {
                    setLoader(false);
                    alert('Something went wrong');
                  })
            }).catch(_err => {
              setLoader(false);
              alert('Something went wrong');
            })
        }else{
            edit ? await editBlogtoDB(e) : await addBlogtoDB(e, postedAt)
        }
    }

    const addBlogtoDB = async (e:any,postedAt: string, url:string| null = null ) => {
       const blogObj = {
        ...e,
        url,
        postedAt,
       }
       try {
        await addDoc(collection(db, "Blogs"), blogObj);
        await router.push('/')
        setLoader(false);
      } catch (e) {
        alert('Something went wrong');
        setLoader(true);
      }
    }
    const editBlogtoDB = async (e:any, url:string| null = null ) => {
       const blogObj = {
        ...e,
       }
       
       !!url && Object.assign(blogObj, {url})
       try {
        const docRef = doc(db, 'Blogs', router?.query?.id as string)        
        await updateDoc(docRef, blogObj);
        await router.push('/')
        setLoader(false);
      } catch (e) {        
        alert('Something went wrong');
        setLoader(false);
      }
    }

  return (
    <div className='w-100 center'>
        <div className='w-100'>
            <div className='w-100 center mt-1'>
                <h1>{`${edit ? 'Edit' : 'Create'} Blog`}</h1>        
            </div>
            <Form form={form} name="addblog" layout="vertical" autoComplete="off" className='w-100 mt-1' onFinish={onFinish}>
                <Row className='w-100 center'>
                    <Col span={16}>
                        <Form.Item name="title" label="Title" rules={[{ required: true }]} >
                            <Input />
                        </Form.Item>        
                    </Col>
                </Row>
                <Row className='w-100 center'>
                    <Col span={16}>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                            <Input.TextArea rows={10}/>
                        </Form.Item>        
                    </Col>
                </Row>
                <Row className='w-100 center'>
                    {
                        edit && <div className='spanWarn'>Selecting an Image and then updating will delete the previous image and update to the new image </div>
                    }
                    <Col span={16}>
                        <Input 
                         type='file'
                         placeholder='Select Image'
                         maxLength={1}
                         max={1}
                         onChange={(files) => handleImage(files.target.files)}
                         accept='image/*'
                        />
                    </Col>
                </Row>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loader}>
                        {edit? 'Update' : 'Submit'}
                    </Button>
                </Space>
            </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default CreateBlogComponent;