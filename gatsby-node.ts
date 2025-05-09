const path = require("path");

// TODO: fix types
exports.createPages = async ({ graphql, actions }: any) => {
    const { data }: { data: Queries.GatsbyNodeQuery } = await graphql(`
query GatsbyNode {
  allMdx(filter: {frontmatter: {type: {eq: "article"}}}) {
    nodes {
      id
      frontmatter {
        slug
      }
      internal {
        contentFilePath
      }
    }
  }
}
    `);

    const languages = ["python", "cpp", "typescript", "java", "rust", "c", "dart", "go"];

    languages.forEach(language => {
        actions.createPage({
            path: `projects/${language}`,
            component: path.resolve("./src/templates/projects_language.tsx"),
            context: {
                language: language,
            },
        })
    });

    const article_template = path.resolve("./src/templates/article.tsx");
    data.allMdx.nodes.forEach((node: any) => {
        actions.createPage({
            path: `articles/${node.frontmatter.slug}`,

            // only render markdown body
            // component: node.internal.contentFilePath,

            // only render layout
            // component: `${article_template}`,

            component: `${article_template}?__contentFilePath=${node.internal.contentFilePath}`,

            context: {
                id: node.id,
            },
        })
    });
};
