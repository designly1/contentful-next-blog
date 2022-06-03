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