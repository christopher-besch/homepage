const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
    const { data } = await graphql(`
query Articles {
  allMarkdownRemark {
    nodes {
      frontmatter {
        slug
      }
    }
  }
}
    `);

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

    data.allMarkdownRemark.nodes.forEach(node => {
        actions.createPage({
            path: `articles/${node.frontmatter.slug}`,
            component: path.resolve("./src/templates/article.tsx"),
            context: {
                slug: node.frontmatter.slug,
            },
        })

    });

};
