const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
    const { data } = await graphql(`
query Articles {
  allMdx(filter: {frontmatter: {type: {eq: "article"}}}) {
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

    data.allMdx.nodes.forEach(node => {
        actions.createPage({
            path: `articles/${node.frontmatter.slug}`,
            component: path.resolve("./src/templates/article.tsx"),
            context: {
                slug: node.frontmatter.slug,
            },
        })

    });

};
