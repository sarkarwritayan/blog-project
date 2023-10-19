import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { ref, uploadBytesResumable, uploadBytes } from 'firebase/storage';
import {storage} from '../../../firebase';
import { arrayBuffer } from 'stream/consumers';

type upload = {
    fileList:UploadFile[]
    setFileList: (e: Array<{
        uid: string,
        name: string,
        url?: string,
        thumbUrl?: string,
    }>) => void
}

const UploadImage: React.FC<upload> = ({fileList, setFileList}) => {    
    const changeUpload = (e: UploadChangeParam<UploadFile<any>>) => {
        console.log({e});
        
        const obj = {
        uid: e?.file?.uid,
        name: e?.file?.name,
        url: e?.file?.thumbUrl,
        thumbUrl: e?.file?.thumbUrl,
        }
        setFileList([obj]);
        const storageRef = ref(storage,`blogImage/References`);
        const blob = new Blob([e.file as unknown as BlobPart], { type: e?.file?.type ?? 'image/png'})
        const uploadImage = uploadBytes(storageRef, blob)
    } 

    useEffect(() => {
console.log({fileList});

    }, [fileList])
  return <>
    <Upload
      listType="picture"
      defaultFileList={[...fileList]}
      maxCount={1}
      onChange={(e) => changeUpload(e)}
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  </>
};

export default UploadImage;