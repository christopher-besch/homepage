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
See my [React without a Framework](https://chris-besch.com/articles/no_framework_homepage) article for an overview.
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

# Building
- `npm install`
- create `.env` file:
  ```
  export IMMICH_BASE_URL=https://photo.chris-besch.com/api
  export IMMICH_API_KEY=your_key
  ```
- `source .env`
- `npm run build`

# ToDo
- [ ] multi size favicon
- [ ] pretty rss icon in footer
- [ ] rethink about page
- [ ] prettier buttons
- [ ] analytics textanordnung???
- [ ] about text on landing page
- [ ] callsign
- [ ] redirect from callsign
- [ ] latest photos as well
- [ ] update bookmarks
- [ ] claimer that no ai

# Nope (or later)
- [ ] purchase image button
- [ ] no react on privacy policy, maybe?
- [ ] maybe add photo articles to photo page
- [ ] parallel embedding, immich download
- [ ] article image caption and label/reference
- [ ] article footnotes
- [ ] 404 page with send error field
- [ ] talks social banner
- [ ] card some tags as language icon
- [ ] better color scheme, different color for articles/projects/talks cards
- [ ] card style + tags in card
- [ ] animated snake everywhere
- [ ] crop media preview for photos to 2:1

# IndieWeb
- https://web.cobb.land
    Overview over the Good Web
- https://theindex.fyi/?category=curated_directories
    List of Curated Directories
- [ ] https://blogosphere.app/
    pending

    I love writing, hoping to create a resource.
    Therefore, most of my blog articles are about (preferably Open-Source) technology and my opinionated way of using it.
    But I also love photography and write about those experiences.
    Lastly, sometimes I get the courage to write more personal articles, on personal troubles, also.
    I strongly dislike LLMs; you won't find any slop here.
- [ ] https://blogroll.club/
    pending

    Articles on photography and technology (Linux, microcontrollers, web, ...).
- [ ] https://www.blogsareback.com/explore
    await CORS settings
- [ ] https://blogscroll.com/
- [ ] https://hnpwd.github.io/
- [ ] https://indieseek.xyz/
- [ ] https://collection.mataroa.blog/
- [ ] https://minifeed.net/welcome
- [x] https://personalsit.es/
    https://github.com/xdesro/personalsit.es/pull/994
- [ ] https://biglist.terraaeon.com/
- [ ] https://www.webjamboree.net/
- [ ] https://blogblog.es/
- [ ] https://blogs.hn/
- [ ] https://ooh.directory/
- [ ] https://blogroll.org
- [ ] https://blogofthe.day
- [ ] https://gossipsweb.net
- [ ] https://indieblog.page/
- [x] https://marginalia-search.com/explore
- [ ] https://smallweb.cc/
- [ ] https://www.warppoint.games/
