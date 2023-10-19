import CreateBlogComponent from '@/Components/CreateBlogComponent';
import MainLayout from '@/Components/MainLayout';

const CreateBlogPage = () => (
    <MainLayout>
        <CreateBlogComponent blog = {undefined} />
    </MainLayout>
);

export default CreateBlogPage;