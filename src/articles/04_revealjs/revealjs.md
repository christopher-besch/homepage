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
import Iframe from "src/components/iframe";

import resource_loading from "./resource_loading.png";

reveal.js is an open source HTML presentation framework.
It can be recommended if you are proficient with web technologies and have a heart for programmatic approaches.
I used it for a couple of presentations as a PowerPoint replacement.
This article sums up my experiences, shows how the most important tasks can be achieved and then explains my custom method of using reveal.js.
If you're interested in bash, it also explains the automation scripts used.

### Table of Contents
```toc
exclude: Table of Contents
to-heading: 3
```

# What is reveal.js?
<Iframe present="2022_05_21_reveal_example/" fullscreen />

Use the blue arrows in the bottom right corner to jump between slides.
If you're using a vertical mobile device, consider turning it and reading this article in landscape mode&mdash;presentations aren't made for portrait orientation.
On desktop you can click on the presentation and then press `F` to enter fullscreen and `Esc` to exit.
This presenter behaves how a PowerPoint user would expect it.

The creation of such a presentation however isn't anything like PowerPoint.
Everything that is shown is defined in an `index.html` file, the exact layout of which will be described [later on](#template).

## Slides and Vertical Slides
You create slides with the `<section>` tag.
If you insert another `<section>` tag within this, you've created a vertical slide.
The default transition between horizontal slides is a horizontal swipe, while vertical slides get replaced with a vertical movement.
```html
<section>
    Hello World!
</section>

<section>
    <section>
        Vertical Slide 1
    </section>
    <section>
        Vertical Slide 2
    </section>
</section>

<section>
    <section>
        Only using a single vertical slide is also fine; this has the same effect as if you'd be using a
        plain horizontal slide
    </section>
</section>
```
<Iframe present="2022_05_21_reveal_example/#/1" fullscreen />

I never use plain horizontal slides.
Instead I use them to group multiple vertical slides into logical groups.
When there's a horizontal swipe, the viewer knows that I start talking about a new subtopic.

Press `Esc` while you're not in fullscreen.
Now you see the slide overview and you should be able to make out the individual horizontal slides as columns.
This overview serves as a quick access menu if you want to jump to a different slide without mashing your poor keyboard.

## Features
Since reaveal.js is an HTML framework, you can let all your WebDev skills shine and use whatever tricks you've already gotten used to.
If you've never worked with any web technologies, reveal.js is a great way of getting started.

## General Elements
You can use the `<h1>` tag for headings, `<h2>`, `<h3>` and so on are subheadings and subsubheadings.
Lists can be created with the `<ul>` and `<li>` tags as shown below.
```html
<section>
    <section>
        <h1>This is a heading</h1>
    </section>
    <section>
        <h2>This is a subheading</h2>
    </section>
    <section>
        <ul>
            <li>First Element</li>
            <li>Second Element</li>
        </ul>
    </section>
</section>
```
<Iframe present="2022_05_21_reveal_example/#/4" fullscreen />

# Template

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

The penultimate step is to copy the actual presentations into the `public` directory and create a table of contents `index.html`.
Such a table of contents won't be very pretty but since I always link directly to specific presentations, it's only purpose is for debugging.
And everyone knows that software developers don't deserve pretty interfaces.
```bash
echo "copying presentations..."
find . \
    -regex './[0-9][0-9][0-9][0-9]_[0-9][0-9]_[0-9][0-9]_[^/]+' \
    -exec cp -rv {} public \;

echo "creating table of contents page..."
find . \
    -regex './[0-9][0-9][0-9][0-9]_[0-9][0-9]_[0-9][0-9]_[^/]+' \
    -exec echo "<a href='{}'>{}<a><br />" \; > public/index.html
```

### Development Environment
Because no one wants to build everything over and over when they change a small detail, a few symlinks form a convenient dev environment.
This allows you to directly open your presentation `index.html` files as if they had already been copied into the `public` directory.
You can even use `live-server`, which can be installed with `yarn global add live-server`, to automatically reload the page when you change your presentation.
If you use VSCode, you can check out the [Live Server plugin](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
```bash
echo "creating symlinks for development..."
ln -svf public/dist dist
ln -svf public/plugin plugin
ln -svf public/dwn_vendor dwn_vendor
ln -svf public/index.html index.html
```

Just don't forget to compile right before publishing the `public` directory.

## Clean Script
If you intend to undo a build or start a clean one&mdash;for example when you've changed the version of a dependency&mdash;you can use the `clean.sh` script.
```bash
echo "deleting reveal.js..."
rm -rvf reveal || true

echo "deleting public dir..."
rm -rv public || true

echo "deleting development symlinks..."
rm -v dist || true
rm -v plugin || true
rm -v dwn_vendor || true
rm -v index.html || true
```

## Integrity Checks
Automated tests can really give you the confidence you need when standing in front of a crowd.
So far I have only included the most basic check there is, testing if all referred resources are actually accessible.
The `check.sh` script does just that.
```bash
python3 -m http.server 9329 > /dev/null 2>&1 & \
    to_kill=$! && \
    sleep 1 && \
    broken-link-checker \
    -or \
    --filter-level 3 \
    --input http://localhost:9329 \
    --user-agent 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0' || true && \
    kill $to_kill
```
This script launches a local web server and silences all output by dumping it into `/dev/null`.
The single `&` executes this command in the background.
Everything else is being executed in a separate process, which firstly sets the `to_kill` variable to the PID of the web server in the background.
Then we wait a moment for the web server to boot up and use the `broken-link-checker` program, which can be installed using `yarn global add broken-link-checker`.
In the end the web server gets shot down to avoid any zombie processes.

<!-- TODO: verify -->
# Directory Overview
Comments are in parenthesis.
```
.
├── 2022_03_07_termbaeume (one folder for each presentation)
│   ├── index.html
│   ├── ...
├── 2022_03_14_neue_formeln_messunsicherheiten
│   ├── index.html
│   ├── ...
├── dist -> public/dist
├── dwn_vendor -> public/dwn_vendor
├── plugin -> public/plugin
├── public (everything to be published)
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
├── reveal (reveal.js repo)
│   ├── ...
├── static (files that don't get compiled but are used by multiple presentations)
│   └── oceanicnext.css
├── theme (custom themes, written in SCSS and compiled alongside reveal.js)
│   ├── source
│   │   ├── custom_black.scss
│   │   └── custom_white.scss
│   └── template
│       └── custom_styles.scss
├── vendor (git subdirectories for plugins)
│   └── external_code
│       ├── ...
├── build.sh
├── check.sh
├── clean.sh
└── index.html -> public/index.html
```
<!-- tree --dirsfirst -L 3  | xclip -i -selection clipboard -->

