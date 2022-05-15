---
type: article
title: "Programmatic Presentations with reveal.js"
description: "

"
banner: /social_banner/revealjs.png
thumb: ../../../static/social_banner/revealjs.png
slug: revealjs
date: 2022-05-13T00:00:00+00:00
listed: true
version: 0.0.1
---
import AutoPlayVideo from "src/components/autoplay_video";
import HalfImage from "src/components/half_image";
import Spacer from "src/components/spacer";

import resource_loading from "./resource_loading.png";

reveal.js is an open source HTML presentation framework.
I used it for a couple of presentations, replacing PowerPoint for me.
This article sums up my experiences and gives templates and advice to get you started.
Generally reveal.js is something for you if you are proficient with web technologies and have a heart for programmatic approaches.

### Table of Contents
```toc
exclude: Table of Contents
to-heading: 3
```

# Installing and Compiling Like Me
When I went to the installation page on [revealjs.com](https://revealjs.com) I found the recommended method to not suit my taste in the slightest.
You are expected to clone the reveal.js repository, replace the provided example presentation with you own, compile and call it a day.
When you have multiple presentations you have to store the reveal.js source code multiple times and when you intend to use Git for version control, you have to create a fork of the reveal.js repo over and over again.
When searching for a workaround I realized that the compilation step doesn't actually depend on the actual presentation you are building.
This means that you can compile the reveal.js resources once and use them in multiple presentations.

<HalfImage src={resource_loading} />

Additionally my goals include high reliability&mdash;when I'm standing in front of an audience, my presentation **has** to work.
A tangent to this is the ability to present without an active internet connection.
If you're hosting your presentation locally, this might sound simple at first.
But it get's more complicated when you realize just how many typical web solutions load resources from content delivery networks (CDNs).
These CDNs might not be reachable at all time and are a big privacy concern.
Therefore I don't accept anything that doesn't get loaded from my own site.

So I created a *slightly* different way of using reveal.js:
I'm using a single Git repository for all my presentations, each in their own directory.
They have access to reveal.js with custom themes, whatever plugins I consider useful and static resources.
A custom build script `buils.sh` puts everything needed for hosting all presentations in the `public` directory.

<Spacer />

## Build Script

First of all it clones reveal.js into the build directory `reveal`, which isn't being tracked by Git (included in `.gitignore`).
After which it checks out a specific version of reveal.js.
```bash
echo "cloning reveal.js..."
git clone https://github.com/hakimel/reveal.js reveal || true
# change directory
pushd reveal
git checkout 4.3.1
```

Since I use custom themes, I copy them from the `theme` into the `reveal/css/theme/source` and `reveal/css/theme/template` directories.
```bash
echo "installing custom themes..."
cp -v ../theme/source/* ./css/theme/source
cp -v ../theme/template/* ./css/theme/template
```

Now the `reveal` directory contains everything required to compile reveal.js just like normal.
```bash
echo "installing yarn dependencies..."
rm -v package-lock.json || true
yarn install

echo "building reveal.js..."
yarn run build
popd
```

The `reveal/dist` and `reveal/plugin` directories contain all output files and get copied into the `public` folder.
```bash
echo "creating public dir..."
rm -rv public || true
mkdir -v public

echo "copying reveal output files..."
cp -rv reveal/{dist,plugin} public
```

This is also a good time to copy any static files, for example code highlighting themes.
```bash
echo "copying static files"
cp -vr static public/static
```

### Plugins
The `vendor` directory contains a few submodules, other git repositories (checked out at a specific commit) contained in a subdirectory.
These are plugins for reveal.js.
```bash
echo "copying vendor dependencies..."
cp -rv vendor public/vendor
```

Some plugins are precompiled and can't be loaded using submodules.
These plugins need to be downloaded and extracted by the build script.
```bash
echo "downloading precompiled dependencies..."
rm -rfv public/dwn_vendor
mkdir public/dwn_vendor
wget https://github.com/KaTeX/KaTeX/releases/download/v0.15.3/katex.tar.gz -O public/dwn_vendor/katex.tar.gz

echo "extracting precompiled dependencies..."
pushd public/dwn_vendor
tar xfv katex.tar.gz
rm -v katex.tar.gz
# katex needs weird dist directory
mv katex temp
mkdir katex
mv temp katex/dist
popd
```

The penultimate step is to copy the actual presentations into the `public` directory.
```bash
echo "copying presentations..."
find . -maxdepth 1 -mindepth 1 -type d -not -path "./.*" -not -path "./reveal" -not -path "./public" -not -path "./static" -not -path "./theme" -not -path "./vendor" -exec cp -rv {} public \;
```

<!-- TODO: verify -->
```
.
├── 2022_03_07_termbaeume
│   ├── index.html
│   ├── ...
├── 2022_03_14_neue_formeln_messunsicherheiten
│   ├── index.html
│   ├── ...
├── dist -> public/dist
├── dwn_vendor -> public/dwn_vendor
├── plugin -> public/plugin
├── public
│   ├── 2022_03_07_termbaeume
│   │   ├── ...
│   ├── 2022_03_14_neue_formeln_messunsicherheiten
│   │   ├── ...
│   ├── dist
│   │   ├── theme
│   │   ├── reset.css
│   │   ├── reveal.css
│   │   ├── reveal.esm.js
│   │   ├── reveal.esm.js.map
│   │   ├── reveal.js
│   │   └── reveal.js.map
│   ├── dwn_vendor
│   │   └── katex
│   ├── plugin
│   │   ├── ...
│   ├── static
│   │   ├── ...
│   ├── vendor
│   │   ├── ...
│   └── index.html
├── reveal
│   ├── ...
├── static
│   └── oceanicnext.css
├── theme
│   ├── source
│   │   ├── custom_black.scss
│   │   └── custom_white.scss
│   └── template
│       └── custom_styles.scss
├── vendor
│   ├── external_code
│   │   ├── ...
│   └── mathjax
│       ├── ...
├── build.sh
├── check_links.sh
├── index.html -> public/index.html
```
<!-- tree --dirsfirst -L 3  | xclip -i -selection clipboard -->

Directory overview:
- `reveal`: reveal.js repo
- `theme`: custom themes, written in SCSS and compiled alongside reveal.js

# Notes

- reveal.js as is
- my compilation method + problems
- all from same site, no CDN
- template
- my needs, decisions: interactivity not needed, simple, pretty, animated
- markdown or html
- PDF export doesn't work
- methods:
    - title page header
    - half_part, general alignment
    - lists
    - headings
    - animations
    - quotes
    - images (LaTeX with transparent background)
    - tables
    - equations (align, not align, drawbacks)
    - markings in equations
    - colouring
    - links
    - code
    - funky animations (animated stack)
- what doesn't work, why shouldn't use revealjs
- rerunning build.sh
- clean rerun
- alternatives

