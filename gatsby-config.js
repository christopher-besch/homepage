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
        // load markdown
        {
            resolve: "gatsby-transformer-remark",
        },
        // image optimizations
        {
            resolve: "gatsby-transformer-sharp",
        },
        {
            resolve: "gatsby-plugin-sharp",
        },
        {
            resolve: "gatsby-plugin-image",
        },
    ],
    // can be loaded from page with GraphQL
    siteMetadata: {
        title: "Gatsby Test",
        description: "Web Dev Portfolio",
        copyright: "This website is copyright 2021 Web Worrior",
        contact: "me@example.com"
    },
}
