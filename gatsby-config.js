const path = require("path");

module.exports = {
    pathPrefix: "/homepage",
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
        // support sass
        {
            resolve: "gatsby-plugin-sass",
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
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "projects",
                path: `${__dirname}/src/articles`,
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
        // support custom header
        {
            resolve: "gatsby-plugin-react-helmet",
        },
    ],
    // can be loaded from page with GraphQL
    siteMetadata: {
        email: {
            name: "mail@chris-besch.com",
            link: "mailto:mail@chris-besch.com",
        },
        privacy_email: {
            name: "privacy@chris-besch.com",
            link: "mailto:privacy@chris-besch.com",
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
        source: "https://github.com/christopher-besch/homepage",
        address: "https://chris-besch.com",
    },
}
