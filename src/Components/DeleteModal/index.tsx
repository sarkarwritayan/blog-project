import { Modal } from 'antd';
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from 'react';
import { db } from '../../../firebase';

const DeleteModal: React.FC<{
    isModalOpen: boolean,
    id:string,
    setIsModalOpen: (e: boolean) => void,
    fetchAllBlogs: () => Promise<void>
}> = ({isModalOpen, setIsModalOpen, id, fetchAllBlogs}) => {

    const [load, setLoad] = useState(false)
  const handleOk = async() => {
    setLoad(true)
    const docRef = doc(db, 'Blogs', id)
    try {
        await deleteDoc(docRef)
        await fetchAllBlogs()
        setLoad(false)        
        setIsModalOpen(false);
    } catch (error) {
        alert('Something went wrong')
        setLoad(false)
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
      <Modal title="Delete Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} confirmLoading={load}>
        <p>Are you sure, you want to delete this blog? </p>
      </Modal>
  );
};

export default DeleteModal;