# My Homepage
[![Dev Build](https://github.com/christopher-besch/homepage/actions/workflows/build_dev.yml/badge.svg)](https://github.com/christopher-besch/homepage/actions/workflows/build_dev.yml)
[![Deploy Build](https://github.com/christopher-besch/homepage/actions/workflows/build_deploy.yml/badge.svg)](https://github.com/christopher-besch/homepage/actions/workflows/build_deploy.yml)

[![pages-build-deployment](https://github.com/christopher-besch/homepage/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/christopher-besch/homepage/actions/workflows/pages/pages-build-deployment)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d4019205-7938-4358-b65b-1c6f4e20ef8f/deploy-status)](https://app.netlify.com/sites/chris-besch/deploys)

- [Production Deployment](https://chris-besch.com)
- [Debug Build](https://dev.chris-besch.com)

This homepage is under Christopher Besch's copyright!
Even though it's source code is public it is not under an open-source license!
If you intend to use any of the code or content from it, you have to ask the copyright holder for permission.

Some files, however, already are Open-Source and are accompanied with an Open-Source license.
You may use those under the conditions layed out in the respective license.
The license closest to the source copyrighted material applies.

# Structure
The website doesn't have any client-side (i.e., in-brower) JavaScript except for some [umami](https://umami.is) analytics.

- `articles/`: One directory per article. One markdown file in that directory.
- `build/`: Where the TypeScript compiler places the commpiled JavaScript files. This code is build-code and to be run in Node.js and not on the browser. It runs React to create the static website.
- `cache/`: Where the downloaded full-res images
- `deploy/`: The final output directory that will be deployed to the static web server. Open this directory in `live-server` or `python3 -m http.server` for development.
- `models/`: Here are the transformer.js models for sentence and image embeddings.
- `projects/`: One directory per project. One markdown file in that directory.
- `resources/`: Resources can be loaded from the build code and processed however the build code feels like.
- `src/`: The TypeScript source code used for building the final website.
- `static/`: Files that are directly copied into `deploy/`.
- `styles/`: CSS files that are combined into bundles placed in `deploy/`.
- `talks/`: One directory per talk. One markdown file in that directory.

The steps are:
1. Compile TypeScript from `src/` into `build/`.
2. Run the compiled JavaScript in `build/` with Node.js.
3. Serve the output in `deploy/` on a static web server.

# Caching
This build systems caches a lot.
It caches the images loaded from immich and the embeddings.
It also caches cropped and resized images.
When things don't update properly, delete the cache.
