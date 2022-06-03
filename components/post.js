/* post.js */

import { Container } from "react-bootstrap"
import Image from "next/image"
import PostBody from "./postBody"
import { formatDate } from "../lib/formatFunctions";

export default function Post({
    date,
    slug,
    image = "/kjd",
    title,
    category,
    content,
    author
}) {
    const authorAvatar = 'https:' + author.picture.fields.file.url;
    const featuredImage = image ? <Image src={image} alt="" width={1900} height={1080} /> : <></>;

    return (
        <Container key={slug} className="blog-post-container">
            <div className="post-header shadow-box">
                <div className="post-header-author">
                    <div className="author-avatar">
                        <img height={75} width={75} src={authorAvatar} alt={author.name} />
                    </div>
                </div>
                <div className="post-header-title">
                    <div>
                        <h1>{title}</h1>
                        <div className="by-line">Published by {" "}
                            <span className="author-name">{author.name}</span> on {" "}
                            <span className="publish-date">{formatDate(date)}</span>
                        </div>
                    </div>
                </div>
            </div>
            {featuredImage}
            <PostBody content={content} />
        </Container>
    )
}