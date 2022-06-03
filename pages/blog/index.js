/* index.js */

import Layout from "../../components/layout"
import { Container } from "react-bootstrap"
import { getPostsMeta } from "../../lib/contentful";
import PostCard from "../../components/postCard";
import { formatDate } from "../../lib/formatFunctions";
import { useRouter } from "next/router";

export default function Blog({ posts }) {
    const router = useRouter();

    const handePostClick = (slug) => {
        router.push("/blog/post/"+slug);
    }

    const postList = posts.map((post) => {
        const featuredImage = post.fields.featuredImage ? 'https:' + post.fields.featuredImage.fields.file.url : null;
        console.log(post)
        return (
            <PostCard
                key={post.fields.slug}
                title={post.fields.title}
                image={featuredImage}
                excerpt={post.fields.excerpt}
                authorAvatar={post.fields.author.fields.picture.fields.file.url}
                authorName={post.fields.author.fields.name}
                publishDate={formatDate(post.fields.publishDate)}
                category={post.fields.category.fields.categoryName}
                onClick={() => { handePostClick(post.fields.slug) }}
            />
        )
    })

    return (
        <Layout title="blog">
            <div className="post-list-wrapper">
                <div className="post-list-container">
                    {postList}
                </div>
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const posts = await getPostsMeta();

    return {
        props: {
            posts: posts
        }
    }
}
