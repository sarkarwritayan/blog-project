import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import BlogCard from "../BlogCard";
import Cookies from 'js-cookie'
const BlogComponent = () => {
    const [blogs, setBlogs] = useState<{ id: string; }[]>([]);
    const [blogLoad, setBlogLoad] = useState(false);
    const [blogsCount, setBlogsCount] = useState(0);

    // Fetching all Blogs
    const fetchAllBlogs = async () => {
        setBlogLoad(true)
        await getDocs(collection(db, "Blogs"))
        .then((querySnapshot)=>{               
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
                setBlogs(newData)
                setBlogsCount(newData.length)
                setBlogLoad(false);
            console.log({newData});
        }).catch((error) => {
            alert('something went wrong')
            setBlogLoad(false)
        })
    }

    useEffect(() => {
        fetchAllBlogs()
    },[])
    const username = Cookies.get('name')
    return(
        <div>
            {!!username && <h1 className="text-center">Welcome {`${username}`}</h1>}
            <h2>Blogs</h2>
            { blogs.length < 1
                 ? <div className="w-100 h-100 center">
                     No Blogs to show
                 </div> 
                 :<Row gutter={[16, 16]} className="mt-1">
                 {blogs?.map((item) => (
                     <Col span={8} key={item.id}>
                     <BlogCard item={item} fetchAllBlogs={fetchAllBlogs as () => Promise<void>}/>
                 </Col>
                 ))}
             </Row>}
        </div>
    )
};

export default BlogComponent;