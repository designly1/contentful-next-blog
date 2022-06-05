In case you haven't heard, [**Next.JS**](https://nextjs.org/) is a **React JS** framework that super-optimizes website page speeds. When you host your Next website on [**Vercel's**](https://vercel.com) platform (for free), you get their automatic image optimization as well when you use Next's [**Next/Image**](https://nextjs.org/docs/api-reference/next/image) built-in component.

Another key feature of Next is the ability to generate static pages from external data sources using the `getStaticProps()` function. This dramatically speeds up data-driven websites, such as blogs because there is no back-end call to a server or CMS when visitors come to your site. The data is pulled from the database or CMS at build-time.

[**Contentful**](https://contentful.com) is a headless content management system (CMS). Headless simply means there is no front-end to display the content to the consumer. It's basically a database, but much easier to setup and maintain than a traditional relational database. Contentful provides a very easy-to-use API for fetching and managing content. They also support GraphQL queries if you're into that.

Contentful's paid plan is quite pricey (nearly $500/mo), but the free (community plan) is very generous and should suit most small to medium size projects. If you want all the details, please check out Contentful's [Technical Limits](https://www.contentful.com/developers/docs/technical-limits) for their free tier.

Contentful has two SDKs that are available for integration with React/Next. The first is their [**Content Delivery API (CDA)**](https://github.com/contentful/contentful.js). And the second is their [**Content Management API (CMA)**](https://github.com/contentful/contentful-management.js). The first is a read-only API that's used for delivering content to your front-end. The second is read/write and allows creating, editing and managing content and content models programmatically.

Unlike a database, Contentful is object-driven. Contentful calls data objects **Content Models**. You can consider a content model a type of document. In this tutorial, we are going to create two types of content models: **Blog Post** and **Author**.

To create our blog, we're going to need the following prerequisites:

- A free-forever Contentful account
- A free-forever Vercel account
- A Github account (free as well)
- Node.JS and NPM installed on your PC
- A development IDE, such as Visual Studio Code (also free)

The complete repository for this tutorial can be found [Here](https://github.com/designly1/contentful-next-blog).

And a demo of this tutorial app can be found [Here](https://designly-blog-example.vercel.app)

Ok, let's get started!

#### Step 1: Set Up Github

If you're a seasoned developer, you probably already have a Github account. If not [head over there](https://github.com) now and set one up. Github is a development collaboration and code-management / versioning system. Vercel will automatically rebuild your Next.JS website when you push a new commit of your code to Github.

I also recommend using the [**Github Desktop**](https://desktop.github.com) app, which is great for visualizing changes bewtween commits. If you're already a seasoned command-line user, then I understand! :-)

#### Step 2: Set Up Contentful

Head over to [Contentful.com](https://contentful.com) and register for a free account. No credit card needed. You can use your Github account to register and sign-in. Once you have your account registered and you're logged in, you should be at your Contentful Space Dashboard.

Ok, first we want to create our dependency content models before we create the actual blog post model. This is because **Blog Post** will refer to **Author** and **Category** much like a relational database.

Begin by clicking the **Content Model** tab at the top of the dashboard. Then click the **Add Content Type** button in the upper right corner. Let's name it **Author**. Note that the **API Identifier** field is automatically filled in. You can type in a friendly name (with spaces) as the field name and Contentful will automatically generate the variable name in camel case, which is how we will refer to the field programmatically.

![Create Author Content Type](https://cdn.designly.biz/blog_files/contentful-next/image1.jpg)

Now let's create some fields. Click the **Add Field** button to the right and select **Text** as the field type. Name the field **Name** and then click **Create and Configure**.

![Create a Name Field](https://cdn.designly.biz/blog_files/contentful-next/image2.jpg)

Under **Field Options** check the box labeled **This field represents the Entry title**. Then under the **Validation** tab check **Required Field**.

![Configure the Name Field](https://cdn.designly.biz/blog_files/contentful-next/image3.jpg)

Next, repeat the same process and add a field named **Image**. Select **Media** as the field type. Leave **One File** checked, as an author will only have one profile image, and then click **Create**. When you're done click the **Save** button in the upper right corner.

Now let's create a content model called **Category**. This model will have two **Short Text** fields: **Category Name** and **Description**. Be sure to check **Category Name** as the entry title.

Ok now we can finally create our **Blog Post** content model. Blog post will have the following fields:

| Field Name     | Type     | Settings     |
| ---------- | ---------- | ---------- |
| Title       | Short Text       | ✅Represents title field       |
| Publish Date | Date & Time     |        |
| Slug | Short Text | Appearance Tab: Generate slug from Title |
| Featured Image | Media | ✅One File |
| Author | Reference | Validation: Accept Only Entry Type: Author |
| Category | Reference | Validation: Accept Only Entry Type: Category |
| Excerpt | Long Text | |
| Content | Long Text | |

Note that the **Slug** field will automatically be generated from the **Title** field. The slug field will be used for generating our static routes in Next. For example, if we had a post titled *All Your Base Are Belong to Us*, the slug would be *all-your-base-are-belong-to-us*, which is a URL-safe format.

#### Step 3: Create a Test Post

First, create an author entry. Under the **Content** tab, click the **Add** dropdown menu in the upper right and select **Author**. Enter your name and upload your profile pic. You can also use Contentful's built-in editing tools to crop or rotate your image as well. You can enter a title and description, but it's not necessary. We will use the **Name** field of the author entry for the `<img alt="" />` property in our Next app.

![Upload and Crop Image](https://cdn.designly.biz/blog_files/contentful-next/image4.jpg)

Next, we'll need a category. Again, click the **Add** dropdown and select category. I'm going to name mine *General*. You can add as many categories as you like, but we'll start with just one for testing purposes.

And now we can finally create our test post. Fill out all the fields and upload a **Featured Image**. Your featured image should be roughly 1920x1200 pixels. Next.JS will automatically optimize and render the `<img src-set="" />`. For **Excerpt**, you should type an SEO-friendly synopsis of what your blog post is about.

In the content field, I've added an image as well. You can use the **Insert Media** tool to upload images directly to Contentful's CDN, but you are limited to image size and bandwidth per month. If you plan to have a **lot** of images in our blog posts, I might suggest using a CDN service or an S3 bucket to store images. You might also want to check out my article titled [*How to Use AWS CloudFront to Create Your Own Free CDN*](https://designly.biz/blog/post/how-to-use-aws-cloudfront-to-create-your-own-free-cdn).

You should end up with something like this:

![Test Post Example](https://cdn.designly.biz/blog_files/contentful-next/image5.jpg)

When you're done, click **Publish**.

Great. Now for the fun part!

#### Step 4: Create Our Blog App

Ok, so hopefully you have the latest versions of **Node.JS** and **NPM** installed. This tutorial doesn't cover that, but here's a [point in the right direction](https://nodejs.org/en/download). Personally, I prefer **Ubuntu** for my React development environment, but Node will run on Windows or Mac as well. I think you need to use [**Homebrew**](https://brew.sh) to install it on MacOS.

We also need to create our Github repository. Hopefully you've downloaded and installed [Guthub Desktop](https://desktop.github.com) and are logged in to your Github account.

From file **File** menu, choose **New Repository**. Choose a name for your repository (usually lowercase with dashes). I chose `contentful-next-blog` for this tutorial. Then you can either choose a location for your respository or you can keep the defaults, which is **Home_Dir > Documents > GitHub**. You don't need to worry about a `.gitignore` file. NPM will create one for us when we initialize our app. Also, do not choose to create a `README.md` file as it will conflict with the `create-next-app` command. Once it's created, click the **Publish Repository** button. You should leave **Keep this code private** unless you want your code to be publicly visible.

Now, when ever you make any local changes to your reponsitory, you can come back here and see the changes that have been made. You can also discard changes as well, which makes Github like a super-duper undo button!

![Create Your Github Repository](https://cdn.designly.biz/blog_files/contentful-next/image6.jpg)

***

Next, open up your terminal, depending on your operating system and navigate to your Github root directory (usually HOME_DIR/Documents/GitHub), just outside your repository directory. Enter the following command:

```bash
npx create-next-app@latest
```

It should install in a few seconds. Now let's test it:

```bash
cd contentful-next-blog
npm run dev
```

You should see an output like this:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
wait  - compiling...
event - compiled client and server successfully in 1331 ms (125 modules)
```

Hit `CTRL+C` to exit the development server. Now we need to install some additional packages for your blog:

```bash
npm install nextjs-progressbar next-sitemap react-markdown react-syntax-highlighter rehype-raw
npm install remark-gfm sweetalert2 contentful react-bootstrap bootstrap
```

Here's a brief summary of the packages we're going to use:

| Package Name | Purpose |
|--------------|---------|
| nextjs-progressbar | Shows a progress bar at the top of the page during page loads |
| next-sitemap | Automatically generates a sitemap.xml for statically-generated pages |
| react-markdown | Renders our blog content's markdown as HTML |
| react-syntax-highlighter | Highlights common programming syntax |
| rehype-raw | Supports HTML embedded in markdown |
| remark-gfm | Adds Github-like markdown support (e.g. tables) |
| sweetalert2 | A very nice modal / alert system that we'll use for popup images |
| contentful | Contentful Delivery API SDK for fetching our blog content |
| react-bootstrap | The UI framework we'll use for the demo, but you can use whatever you like |

Ok now we need to set up our environment variables for development. In the root directory of your project, create a file called `.env.local`. This file will store our contenful API key and space ID. Next, go back to your contentful dashboard, click the **Settings** dropdown at the top and select **API Keys**. Then click **Add API Key**.

![Create a Contentful API Key](https://cdn.designly.biz/blog_files/contentful-next/image7.jpg)

Now copy the space ID and access token to your `.env.local` file like so:

```bash
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=YOUR_TOKEN
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

On a side note, apps created by `create-next-app` must have environment variables prefixed by `NEXT_PUBLIC_`. Also, `NEXT_PUBLIC_BASE_URL` will be used by `next-sitemap`.

Now save your file and go back to the terminal and run:

```bash
npm run dev
```

In your browser, nagivate to http://localhost:3000. You should see a page like this:

![Default Next.JS Page](https://cdn.designly.biz/blog_files/contentful-next/image8.jpg)

Now we need to edit our main page wrapper `pages/_app.js` to include bootstrap and nextjs-progressbar, as well as import our styles (which we'll create in a minute):

```js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import '../styles/blogPost.css'
import '../styles/postList.css'
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress height={10} color="#2c85ba" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
```

***

Now we need to configure `next-sitemap` to generate our blog's `sitemap.xml`. Create a new file in the root directory called `next-sitemap.config.js`.

```js
// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

const fs = require('fs');

let postsMeta = fs.readFileSync('./public/blogPostMeta.json');
postsMeta = JSON.parse(postsMeta);

module.exports = {
    siteUrl: baseUrl,
    generateRobotsTxt: true,
    changefreq: 'monthly',
    transform: async (config, path) => {
        let additionalProps = {};

        if (path.match(/blog\/post/)) {
            const pathAr = path.split("/");
            const findSlug = pathAr.pop();

            const post = postsMeta.find( ({ slug }) => slug === findSlug );
            if (post) {
                additionalProps = {
                    'image:image': post.coverImage
                };
            }
        }

        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
            ...additionalProps
        };
    },
}
```

You may be wondering about the additional configuration options. What this does is allows `next-sitemap` to add `image` tags to our blog post listings from a JSON file that we will generate later.

Now we need to add the post-build script to `package.json`:

```json
 {
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint",
     "postbuild": "next-sitemap"
   }
 }
```

***

Next, edit `next.config.js` in the root directory to look like this:

```js
/* next.config.js */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.ctfassets.net',
    ],
  }
}

module.exports = nextConfig
```

This will allow `next/image` to load images from the Contentful CDN. Add any other image sources here.

***

And we'll create two style files in `/styles`:

```css
/* postList.css */

@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap");

*,
*::before,
*::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

.post-list-wrapper {
    font-family: "Quicksand", sans-serif;
    display: grid;
    place-items: center;
    height: 100vh;
    background: #7f7fd5;
    background: linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5);
}

.post-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1200px;
    margin-block: 2rem;
    gap: 2rem;
    flex-direction: row;
}

img {
    max-width: 100%;
    display: block;
    object-fit: cover;
}

.post-card {
    display: flex;
    flex-direction: column;
    width: clamp(20rem, calc(20rem + 2vw), 22rem);
    overflow: hidden;
    box-shadow: 0 .1rem 1rem rgba(0, 0, 0, 0.1);
    border-radius: 1em;
    background: #ECE9E6;
    background: linear-gradient(to right, #FFFFFF, #ECE9E6);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.post-card:hover {
    opacity: 0.8;
}

.card__body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.tag {
    align-self: flex-start;
    padding: .25em .75em;
    border-radius: 1em;
    font-size: .75rem;
}

.tag+.tag {
    margin-left: .5em;
}

.tag-blue {
    background: #56CCF2;
    background: linear-gradient(to bottom, #2F80ED, #56CCF2);
    color: #fafafa;
}

.tag-brown {
    background: #D1913C;
    background: linear-gradient(to bottom, #FFD194, #D1913C);
    color: #fafafa;
}

.tag-red {
    background: #cb2d3e;
    background: linear-gradient(to bottom, #ef473a, #cb2d3e);
    color: #fafafa;
}

.card__body h4 {
    font-size: 1.5rem;
    text-transform: capitalize;
}

.card__footer {
    display: flex;
    padding: 2rem 1rem;
    margin-top: auto;
}

.user {
    display: flex;
    gap: .5rem;
}

.user__image {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.user__info>small {
    color: #666;
}
```

```css
/* blogPost.css */

@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

.blog-post-container {
    font-family: 'Roboto', sans-serif;
    padding-top: 2em;
}

hr.blog-hr {
    width: 200px;
    height: 20px;
    margin: 60px auto;
    background: radial-gradient(circle closest-side, #d4d4d4 98%, #0000) 0/calc(100%/5) 100%;
}

.post-heading {
    margin-bottom: 1em;
}

.post-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 3em;
}

.post-header-author {
    display: flex;
    flex-direction: column;
    background-color: rgb(81, 81, 81);
    padding: 2em;
}

.author-avatar {
    display: flex;
}

.author-avatar img {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 2px solid #cddc39;
    filter: drop-shadow(0 0 8px rgb(255, 87, 34));
    margin: auto;
}

.post-header-title {
    display: flex;
    flex-direction: column;
    background-color: rgb(51, 51, 51);
    width: 100%;
    color: white;
    padding: 2em;
}

.author-name {
    color: #f19494;;
}

.publish-date {
    color: #afafff;
    font-style: italic;
}

.post-markdown figcaption {
    font-size: 0.8em;
    background-color: rgb(51, 51, 51);
    color: white;
    padding: 0.5em;
    text-align: center;
}

.shadow-box {
    -webkit-box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
    box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0)
}

.blog-pre {
    margin-bottom: 3em;;
}

.blog-pre > div {
    -webkit-box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
    box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0)
}

.blog-ul {
    margin-bottom: 3em;
}

.blog-p {
    margin-bottom: 2em;
}

.blog-table {
    -webkit-box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
    box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
    margin-bottom: 3em !important;
}

code.blog-code:not(pre *) {
    color: rgb(227, 227, 227);
    font-size: 0.9em;
    background-color: rgb(110, 110, 110);
    padding: 4px 6px;
    border-radius: 3px;
    word-break: keep-all;
}

.pop-image {
    cursor: pointer;
    transition: 0.3s ease-in-out;
    -webkit-box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
    box-shadow: -10px 0px 13px -7px #000000, 10px 0px 13px -7px #000000, 35px -23px 2px -16px rgba(0, 0, 0, 0);
}

.pop-image:hover {
    transform: scale(1.01);
    opacity: 0.8;
}
```

***

Create a folder in the root directory called `lib` and a file within called `contentful.js`. This will contain our functions for fetching data from Contentful:

```js
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
```

And also a file called `formatFunctions.js`. This will have a function for formatting ISO dates:

```js
/* formatFunctions.js */

export function formatDate(str) {
    let date = new Date(str);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options);
}
```

***

Now we can create our main layout component. Create a folder in the root directory called `components` and create the following components:

```js
/* layout.js */

import Head from 'next/head'
import { Navbar, Nav, Container } from "react-bootstrap";
import { useRouter } from 'next/router'
import NavLink from './navLink';

export default function Layout({
    children,
    title,
    description = "My blog site default description",
    image,
    headCustom = ""
}) {
    const router = useRouter()
    const canonicalUrl = process.env.NEXT_PUBLIC_BASE_URL + router.asPath;

    // Configure dynamic title
    let dispTitle = "My Blog"; // title prefix
    if (title) dispTitle = dispTitle + " | " + title;

    return (
        <>
            <Head>
                <title>{dispTitle}</title>
                <meta name="description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={dispTitle} />
                <meta property="og:description" content={description} />
                {image &&
                    <meta property="og:image" content={image} />
                }
                {headCustom}
            </Head>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#" onClick={() => router.push('/')}>
                        My Blog
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <NavLink href="/blog">My Blog</NavLink>
                    </Nav>
                </Container>
            </Navbar>
            {children}
        </>
    );
}
```

```js
// navLink.js

import Link from "next/link";
import { Nav } from "react-bootstrap";

export default function NavLink(props) {
    return (
        <Link href={props.href} passHref>
            <Nav.Link>{props.children}</Nav.Link>
        </Link>
    );
}
```

```js
/* postCard.js */

import Image from "next/image"

export default function PostCard({
    title,
    image,
    excerpt,
    authorName,
    authorAvatar,
    publishDate,
    category,
    onClick
}) {
    const featuredImage = image
        ? <Image src={image} alt="card__image" className="card__image" width={600} height={338} />
        : <></>

    return (
        <div className="post-card" onClick={onClick}>
            <div className="card__header">
                {featuredImage}
            </div>
            <div className="card__body">
                <span className="tag tag-blue">{category}</span>
                <h4>{title}</h4>
                <p>{excerpt}</p>
            </div>
            <div className="card__footer">
                <div className="user">
                    <img src={authorAvatar} alt={authorName} className="user__image" />
                    <div className="user__info">
                        <h5>{authorName}</h5>
                        <small>{publishDate}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}
```

```js
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
```

```js
/* postBody.js */

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import PopImage from './popImage';

export default function PostBody({ content }) {
    const HeaderOne = ({ children }) => <h1 className="post-heading">{children}</h1>
    const HeaderTwo = ({ children }) => <h2 className="post-heading">{children}</h2>
    const HeaderThree = ({ children }) => <h3 className="post-heading">{children}</h3>
    const HeaderFour = ({ children }) => <h4 className="post-heading">{children}</h4>
    const Table = ({ children }) => <table className="table table-striped table-bordered table-responsive-sm blog-table shadow-box">{children}</table>
    const Thead = ({ children }) => <thead className="thead-dark">{children}</thead>
    const Pre = ({ children }) => <pre className="blog-pre">{children}</pre>
    const Ul = ({ children }) => <ul className="blog-ul">{children}</ul>
    const P = ({ children }) => <p className="blog-p">{children}</p>
    const Hr = () => <hr className="blog-hr" />

    return (
        <ReactMarkdown
            className='post-markdown'
            linkTarget='_blank'
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
                h1: HeaderOne,
                h2: HeaderTwo,
                h3: HeaderThree,
                h4: HeaderFour,
                table: Table,
                thead: Thead,
                pre: Pre,
                ul: Ul,
                p: P,
                hr: Hr,
                code({ node, inline, className = "blog-code", children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={a11yDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                },
                img: ({ src, ...props }) => <PopImage src={src} {...props} />
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
```

```js
/* popImage.js */

import React from "react";
import Swal from "sweetalert2";
import Image from "next/image";

export default class PopImage extends React.Component {
    state = {
        isOpen: false,
        winWidth: null
    };

    constructor(props) {
        super(props);

        // Fix contentful's image prefix
        if (this.props.src.match(/^\/\//)) {
            this.src = 'https:' + this.props.src;
        }else{
            this.src = this.props.src;
        }

        this.dialogTitle = (this.props.alt) ? this.props.alt : "Image";
    }

    componentDidMount() {
        this.setState({
            winWidth: window.innerWidth
        });
    }

    imgPop = () => {
        this.setState({ isOpen: !this.state.isOpen });

        Swal.fire({
            title: this.props.title,
            html: `
                <div style="display: flex; width:100%;">
                    <img src="${this.src}" alt="${this.props.alt}" className="${this.props.className}"
                        onClick="document.querySelector('.swal2-confirm').click()" style="margin: auto; width:100%;" />
                </div>
            `,
            confirmButtonText: "CLOSE",
            width: '100%',
            backdrop: 'black',
            background: 'black',
            padding: '1px',
            margin: '1px',
            loaderHtml: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="translate(26.666666666666668,26.666666666666668)">
              <rect x="-20" y="-20" width="40" height="40" fill="#93dbe9">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.3s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(73.33333333333333,26.666666666666668)">
              <rect x="-20" y="-20" width="40" height="40" fill="#689cc5">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.2s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(26.666666666666668,73.33333333333333)">
              <rect x="-20" y="-20" width="40" height="40" fill="#5e6fa3">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="0s"></animateTransform>
              </rect>
            </g>
            <g transform="translate(73.33333333333333,73.33333333333333)">
              <rect x="-20" y="-20" width="40" height="40" fill="#3b4368">
                <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.1s"></animateTransform>
              </rect>
            </g>
            <!-- [ldio] generated by https://loading.io/ --></svg>`
        });
    };

    render() {
        return (
            <Image
                {...this.props}
                className="pop-image"
                src={this.src}
                onClick={this.imgPop}
                alt={this.props.alt}
                width={1920}
                height={1080}
            />
        );
    }
}
```

***

Next, create a folder in `/pages/` called `blog`, and a file within called `index.js`. This will be our main blog index:

```js
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
```

***

Next, create a folder in `/pages/blog` called `/post` and a file within called `[slug].js`. This is a special Next.JS file that allows dynamic routing based on the slug in the URI path:

```js
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
```

***

Now restart the dev server with `npm run dev` and navigate to `http://localhost:3000/blog`. You should see your test post displayed as a card. Click on the card and `next/router` should navigate you to the dynamic `[slug].js` page. Notice the progress bar and single-page app loading, which is the doing of `next/router`.

#### Step 5: Publish Your App on Vercel

Switch over to GitHub Desktop and commit your changes and push to origin:

![Commit Changes to GitHub](https://cdn.designly.biz/blog_files/contentful-next/image9.jpg)

Ok, it's time to go live! Head over to [Vercel](https://vercel.com) and create your free account. You can use GitHub to register, which is a good idea because you're going to link your GitHub account to Vercel for automatic building of your app.

Once you have your account and GitHub linked, create a new project and import your blog app:

![Create a New Vercel Project](https://cdn.designly.biz/blog_files/contentful-next/image10.jpg)

Next, we need to add our environment variables to be able to connect to Contentful. Don't worry about our BASE_URL variable, we need to wait to get our assigned Vercel domain to add that:

![Add Your Environment Variables](https://cdn.designly.biz/blog_files/contentful-next/image11.jpg)

Finally, click **Deploy**. Vercel will pull your commit from GitHub and build your app with statically-generated blog pages! When the build completes, you should get some confetti:

![Vercel Build Completed](https://cdn.designly.biz/blog_files/contentful-next/image12.jpg)

Now you need to set a custom domain for your app. If you have a domain name you want to use, you can add it by adding some records on your registrar, but  for the purposes of this tutorial, we're going to use a vercel.app subdomain.  Click on **Dashboard** and then click **View Domains**. On the domain name that was assigned, click **Edit** and enter your custom domain name.

![Customize Your Domain](https://cdn.designly.biz/blog_files/contentful-next/image13.jpg)

The last thing you need to do is go back to your project settings and add the `NEXT_PUBLIC_BASE_URL` environment variable to be your new domain name. Then re-deploy your app.

***

I hope you found this tutorial useful. Designly's blog uses much of this code and we're always developing new ways to do things. For more great tutorials, please visit [Our Blog](https://designly.biz/blog).