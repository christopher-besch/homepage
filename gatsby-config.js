const path = require("path");

module.exports = {
    plugins: [
        // support TypeScript
        {
            resolve: "gatsby-plugin-typescript",
        },
        // define TypeScript config path
        {
            resolve: "gatsby-plugin-tsconfig-paths",
            options: {
                configFile: `${__dirname}/tsconfig.json`,
            },
        },
        // added explicitly to exclude GraphQL type files
        {
            resolve: "gatsby-plugin-page-creator",
            options: {
                path: path.join(__dirname, "src", "pages"),
                ignore: ["**/__generated__/*"],
            }
        },
        // load files from a dir
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`,
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "projects",
                path: `${__dirname}/src/projects`,
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
        // load markdown
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        // load images from markdown
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 8000,
                        },
                    },
                ]
            }
        },
        {
            resolve: "gatsby-plugin-fontawesome-css",
        },
    ],
    // can be loaded from page with GraphQL
    siteMetadata: {
        email: {
            name: "christopher.besch@manim.community",
            link: "mailto:christopher.besch@manim.community",
        },
        github: {
            name: "christopher-besch",
            link: "https://github.com/christopher-besch",
        },
        linkedin: {
            name: "christopher-besch",
            link: "https://www.linkedin.com/in/christopher-besch",
        },
        discord: {
            name: "Stromel#1046",
            link: "https://discord.com/users/455374552352948236",
        },
    },
}
