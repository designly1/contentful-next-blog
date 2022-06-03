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