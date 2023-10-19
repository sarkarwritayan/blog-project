import BlogViewComponent from '@/Components/BlogViewComponent';
import MainLayout from '@/Components/MainLayout';
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { GetServerSideProps } from 'next';
import { db } from '../../../firebase';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
const ViewBlogPage = ({blog}: { blog: DocumentData | undefined }) => {
    const router = useRouter()
    useEffect(() => {
        if(Object.keys(blog ?? {}).length === 0) router.push('/')
    }, [])
    return (
        <MainLayout>
            <BlogViewComponent blog={blog}/>
        </MainLayout>
    )
};

export default ViewBlogPage;

export const getServerSideProps : GetServerSideProps = async ({query})  => {
    const {id} = query
    let blog : DocumentData | undefined = {} 
    try {
        const docRef = doc(db, "Blogs", id as string);
        const docSnap = await getDoc(docRef);
        blog = docSnap?.data() ?? {};   
    } catch (error) {
        
    }
    return {
        props:{
            blog
        }
    }
}
  