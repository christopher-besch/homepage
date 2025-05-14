import React from 'react';
import { Link } from 'gatsby';

// from: https://mdawar.dev/blog/mdx-open-links-in-new-page
const MDXLink = ({ children, href }: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
    if (href == undefined)
        return <div>ERROR</div>;
    // is this an internal link?
    if (href.startsWith('/')) {
        return <Link to={href}>{children}</Link>;
    }

    // is this a link to a heading on the same page?
    const on_page = href.startsWith('#');
    return (
        <a href={href} target={on_page ? undefined : '_blank'}>
            {children}
        </a>
    );
}
export default MDXLink;
