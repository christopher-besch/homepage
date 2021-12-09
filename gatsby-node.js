const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
    // TODO: ridiculousness to be removed with typescript
    const languages = ["python", "cpp", "typescript", "java"];

    languages.forEach(language => {
        actions.createPage({
            path: `projects/${language}`,
            component: path.resolve("./src/templates/projects_language.tsx"),
            context: {
                language: language,
            },
        })
    });

    // data.allMarkdownRemark.nodes.forEach(node => {
    //     actions.createPage({
    //         path: `project/${node.frontmatter.slug}`,
    //         component: path.resolve("./src/templates/project.tsx"),
    //         context: {
    //             slug: node.frontmatter.slug,
    //         },
    //     })

    // });

}
