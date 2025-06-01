import type { GatsbyConfig } from "gatsby";
// this doesn't work, somehow...
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
// const remarkMath = require('remark-math')
// const rehypeKatex = require('rehype-katex')

const config: GatsbyConfig = {
    siteMetadata: {
        email: {
            name: "mail@chris-besch.com",
            link: "mailto:mail@chris-besch.com",
        },
        pgp: {
            fingerprint: "9393 2AD1 1DCC 2CCB 4852 AE70 D610 18FF A38E 5AFA",
            name: "Christopher Besch mail@chris-besch.com-(0xD61018FFA38E5AFA)-public.asc",
            link: "/pgp_pub_key.asc",
        },
        privacy_email: {
            name: "privacy@chris-besch.com",
            link: "mailto:privacy@chris-besch.com",
        },
        github: {
            name: "christopher-besch",
            link: "https://github.com/christopher-besch",
        },
        codeberg: {
            name: "christopher-besch",
            link: "https://codeberg.org/christopher-besch",
        },
        linkedin: {
            name: "christopher-besch",
            link: "https://www.linkedin.com/in/christopher-besch",
        },
        twitter: {
            name: "@besch_chris",
            link: "https://twitter.com/besch_chris",
        },
        discord: {
            name: "Stromel#1046",
            link: "https://discord.com/users/455374552352948236",
        },
        source: "https://github.com/christopher-besch/homepage",
        // main address
        default_origin: "https://chris-besch.com",
        // address actually in use
        origin: process.env.DEPLOY_ORIGIN,
        // address of presentation site
        present_url: process.env.PRESENT_URL,
        cloudflare_token: process.env.DEPLOY_ORIGIN == "https://chris-besch.com" ?
            "df7b6d9ef2174b4d8211c493b0375719" : "6b8a141684454999a13a31003eb0725c",
    },
    graphqlTypegen: true,
    plugins: [
        // define TypeScript config path
        {
            resolve: "gatsby-plugin-tsconfig-paths",
            options: {
                configFile: `${__dirname}/tsconfig.json`,
            },
        },
        // styling
        {
            resolve:
                "gatsby-plugin-sass",
            options: {
                sassOptions: {
                    api: "modern",
                },
            },
        },
        // markdown
        {
            resolve: "gatsby-plugin-mdx",
            options: {
                extensions: [".md", ".mdx"],
                mdxOptions: {
                    // this doesn't work, somehow...
                    // remarkPlugins: [remarkMath],
                    // rehypePlugins: [rehypeKatex],
                },
                gatsbyRemarkPlugins: [
                    {
                        resolve: "gatsby-remark-katex",
                        options: {
                            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
                            strict: "ignore",
                        }
                    },
                    {
                        // load images from markdown
                        // TODO: remove, not actually needed
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 8000,
                        },
                    },
                    {
                        resolve: "gatsby-remark-autolink-headers",
                        options: {
                            isIconAfterHeader: false,
                        },
                    },
                    {
                        resolve: "gatsby-remark-table-of-contents",
                        options: {
                            tight: true,
                            ordered: false,
                            fromHeading: 1,
                            toHeading: 2,
                        },
                    },
                ]
            },
        },
        // {
        //     resolve: "gatsby-transformer-remark",
        //     options: {
        //         plugins: [
        //             {
        //                 resolve: "gatsby-remark-katex",
        //                 options: {
        //                     // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
        //                     strict: "ignore",
        //                 }
        //             }
        //         ],
        //     },
        // },
        // load files from a dir
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "thumbs",
                path: `${__dirname}/src/images/thumbs`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "photography",
                path: `${__dirname}/src/images/photography`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "talk_thumbs",
                path: `${__dirname}/src/images/talk_thumbs`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "projects",
                path: `${__dirname}/src/projects`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "articles",
                path: `${__dirname}/src/articles`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "talks",
                path: `${__dirname}/src/talks`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "static",
                path: `${__dirname}/static`,
            }
        },
        // image handling
        {
            resolve: "gatsby-transformer-sharp",
        },
        {
            resolve: "gatsby-plugin-sharp",
        },
        {
            resolve: "gatsby-plugin-image",
        },
        // set lang
        {
            resolve: 'gatsby-plugin-html-attributes',
            options: {
                lang: 'en-GB'
            }
        },
    ]
};

export default config;
