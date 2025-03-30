import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { globalHistory } from "@reach/router";

interface SEOProps {
    heading?: string;
    description?: string;
    banner?: string;
}
const SEO = (props: SEOProps) => {
    const data: Queries.SEOQuery = useStaticQuery(graphql`
query SEO {
  site {
    siteMetadata {
      origin
      default_origin
      cloudflare_token
    }
  }
}
    `);
    const title = props.heading ? `${props.heading}—Christopher Besch` : "Christopher Besch—Software Developer";
    const description = props.description;

    const url = globalHistory.location.href;
    const origin = data.site?.siteMetadata?.origin;
    const deploy_origin = data.site?.siteMetadata?.default_origin as string;
    const path = globalHistory.location.pathname;
    // replace origin with default one
    const canonical_url = `${deploy_origin}${path}`;

    const banner = props.banner ? `${origin}${props.banner}` : undefined;

    return (
        <>
            <meta charSet="utf-8" />
            <title>{title}</title>
            <link rel="canonical" href={canonical_url} />
            <link rel="shortcut icon" href="/favicon.png" />
            <meta
                property="og:url"
                content={url}
            />
            <meta
                property="og:title"
                content={title}
            />
            <meta
                property="twitter:title"
                content={title}
            />
            {description ? <meta
                property="og:description"
                content={description} /> : undefined}
            {description ? <meta
                property="twitter:description"
                content={description} /> : undefined}
            {banner ? <meta
                property="og:image"
                content={banner}
            /> : undefined}
            {banner ? <meta
                property="twitter:image"
                content={banner}
            /> : undefined}
            <meta
                name="twitter:card"
                content={banner ? "summary_large_image" : "summary"}
            />
            <meta
                name="twitter:site"
                content="@besch_chris"
            />
            <meta
                name="twitter:creator"
                content="@besch_chris"
            />

            <meta
                name="author"
                content="Christopher Besch"
            />
            <meta
                name="description"
                content={title}
            />

            {/* cloudflare analytics */}
            <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
                data-cf-beacon={JSON.stringify({ token: data.site?.siteMetadata?.cloudflare_token })}></script>

            {/* preloading fonts */}
            <link
                rel="preload"
                href="/fonts/LiberationSans-Regular-webfont.woff"
                as="font"
                type="font/woff"
                crossOrigin="anonymous"
            />
            <link
                rel="preload"
                href="/fonts/LiberationMono-Regular-webfont.woff"
                as="font"
                type="font/woff"
                crossOrigin="anonymous"
            />

            {/* Samsung Internet likes to be special: https://developer.samsung.com/internet/blog/en/2020/12/15/dark-mode-in-samsung-internet */}
            <meta name="color-scheme" content="light dark" />
        </>
    );
}
export default SEO;

