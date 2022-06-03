/* [slug].js */

import { useRouter } from 'next/router'
import Layout from '../../../components/layout';
import Post from "../../../components/post";
import ErrorPage from 'next/error'
import { getPostsMeta, getPost } from '../../../lib/contentful';

function PostDetails({ post }) {
    console.log(post)
    const router = useRouter()

    if (!router.isFallback && typeof post === typeof undefined || !post.hasOwnProperty('slug')) {
        return <ErrorPage statusCode={404} />
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const canonicalUrl = baseUrl + router.asPath;

    const featuredImage = post.featuredImage ? 'https:' + post.featuredImage.fields.file.url : null;

    // LdJSON data for Google Rich Results
    const ldJsonBlog = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "about": post.excerpt,
        "image": [featuredImage],
        "datePublished": post.publishDate,
        "dateModified": post.publishDate,
        "author": {
            "@type": "Person",
            "name": post.author.fields.name,
            "image": 'http:' + post.author.fields.picture.fields.file.url,
            "url": canonicalUrl
        }
    }

    return (
        <Layout
            title={post.title}
            description={post.excerpt}
            headCustom={
                <>
                    <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJsonBlog) }} />
                </>
            }
        >
            <Post
                date={post.publishDate}
                image={featuredImage}
                title={post.title}
                excerpt={post.excerpt}
                content={post.content}
                slug={post.slug}
                category={post.category.fields}
                author={post.author.fields}
            />
        </Layout>
    );
}

export async function getStaticProps({ params }) {
    const res = await getPost(params.slug)
    const post = res.length && res[0].hasOwnProperty('fields') ? res[0].fields : {};
    return {
        props: {
            post: post
        },
    }
}

export async function getStaticPaths() {
    const meta = await getPostsMeta();

    const fs = require('fs');
    const path = require('path');
    const dataFile = path.join(__dirname, '../../../../../public/blogPostMeta.json');

    // Write meta-data to JSON file
    const postsMeta = [];
    meta.forEach(function (item) {
        const fields = item.fields;
        const id = item.sys.id;

        if (id) {
            postsMeta.push(fields);
        }
        fs.writeFileSync(dataFile, JSON.stringify(postsMeta, null, 4));
    });

    const paths = meta.map((post) => ({
        params: { slug: post.fields.slug },
    }));

    return {
        paths,
        fallback: false
    };
}

export default PostDetails;