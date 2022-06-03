/* contentful.js */

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? null
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ?? null

const client = require('contentful').createClient({
    space: space,
    accessToken: accessToken,
})

// Fetch post meta data for all posts
export async function getPostsMeta() {
    const entries = await client.getEntries({
        content_type: 'blogPost',
        select: 'fields.title,fields.publishDate,fields.slug,fields.featuredImage,fields.category,fields.excerpt,fields.author'
    })
    if (entries.items) {
        return entries.items;
    }
    console.error("Could not fetch blog posts!")
}

// Fetch a single post by slug
export async function getPost(slug) {
    const entries = await client.getEntries({
        content_type: 'blogPost',
        'fields.slug': slug
    })
    if (entries.items) {
        return entries.items;
    }
    console.error(`Could not fetch blog post: ${slug}!`)
}