// @ts-nocheck
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Image from 'next/image';
import Router  from 'next/router';
import React, { useState, useEffect } from 'react';
import DeleteModal from '../DeleteModal';
import Cookies from 'js-cookie';
import {useSelector} from 'react-redux'
const { Meta } = Card;

type blogCard = {
    item : Record<string,string>
    fetchAllBlogs: () => Promise<void>
}

const BlogCard: React.FC<blogCard> = ({item, fetchAllBlogs}) => {
  const [deleteModal, setDeleteModal] = useState(false)
  const {admin, authorization} = useSelector((state) => state?.data?.data)

  const [actionIcon, setActionIcon] = useState([
    <EyeOutlined key="setting" onClick={() => authorization  ? Router.push(`/view-blog/${item.id}`) : Router.push(`/sign-in`)}/>,
  ])
  useEffect(() => {
    admin && setActionIcon([...actionIcon, <EditOutlined key="edit" onClick={() => Router.push(`/edit-blog/${item.id}`)}/>,
    <DeleteOutlined key="ellipsis" onClick={() => setDeleteModal(true)}/>,])
  }, [])
  return (
    <>
      <Card
        style={{ width: 300 }}
        className='card'
        cover={
          <Image
            alt={`img${item.id}`}
            src={item?.url ?? '/Assets/Placeholder.svg.png'}
            width={100}
            height={150}
          />
        }
        actions={actionIcon}
      >
        <Meta
          title={item?.title ?? 'No Title'}
          description={item?.description
            ? `${item?.description?.length > 25 
                ? item?.description?.slice(0,25) 
                : item?.description}...`
            : 'No Description'}
        />
      </Card>
      {deleteModal && <DeleteModal isModalOpen={deleteModal} id={item?.id as string} setIsModalOpen = {setDeleteModal} fetchAllBlogs={fetchAllBlogs}/>}
    </>
  )
};

export default BlogCard;