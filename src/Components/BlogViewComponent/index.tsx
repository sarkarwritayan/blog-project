import { Col, Row } from "antd";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";

const BlogViewComponent = ({blog}: { blog: DocumentData | undefined }) => (
    <div className="mt-1">
    <Row>
        <Col span={24}>
            <div className="center card">
                <Image 
                alt={`img${blog?.id}`}
                src={blog?.url ?? '/Assets/Placeholder.svg.png'}
                width={300}
                height={250}
                />
            </div>
        </Col>
    </Row>
    <Row>
        <Col span={24}>
            <div className="center">
                <h1>{blog?.title}</h1>
            </div>
        </Col>
    </Row>
    <Row>
        <Col span={24}>
            <div className="center">
                <p>{blog?.description}</p>
            </div>
        </Col>
    </Row>
    </div>
);

export default BlogViewComponent;

