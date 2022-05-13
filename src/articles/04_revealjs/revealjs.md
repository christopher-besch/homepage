---
type: article
title: "Title Name Here"
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

## Installation
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

<Spacer />

### My Approach
So I created a *slightly* different way of using reveal.js:
I'm using a single Git repository with a custom build script.
It clones reveal.js into one of many build directories, which aren't being tracked by Git (included in `.gitignore`).

Since I use custom themes, I copy them from the `theme` into the appropriate `reveal/css/theme/source` and `reveal/css/theme/template` directories.

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
- alternatives

