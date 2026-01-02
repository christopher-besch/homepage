---
title: "React without a Framework"
description: "
Reimplementing my homepage without a framework made me more flexible and independant.
I only rely on React, TypeScript and Node.js to generate a static HTML+CSS website.

Also, it has been a lot of fun!
"
banner: "./dirs.webp"
hero: "./hero.jpg"
hero_horizontal_position: 60
hero_vertical_position: 50
slug: no_framework_homepage
date: "2026-01-02"
tags: [software_dev, typescript, react, web, immich, umami, mdx]
listed: false
---

What is the best framework to build a homepage?
In 2021 I thought Gatsby and quickly regretted my choice.
The framework forced me to look for Gatsby-specific solutions to general web-problems.
After considering Next.js, Vue.js and the likes I chose to <s>create my own framework</s> use no framework whatsoever.
This is what I came up with:

<HalfImage full={true} src="dirs.webp" />

Because I write my [articles](/articles) in MarkDown and have a lot of content I need a templating system.
React integrates amazing templating into a powerful programming language.
However, I don't want any client-side JavaScript.
[renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream) comes to the rescue and converts any React component into static HTML.
I run that function for every route I want to create (e.g., for each article in a loop; [see `build.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/build.tsx)).
My code places that in `./deploy` while simply copying the CSS styles.
I wrote my code in TypeScript with JSX (`.tsx` file extension) and directly compile it with tsc.
That conveniently takes care of compiling the JSX syntax away for Node.js to directly evaluate.
And that's basicaly all: No bundler, no framework; pure React, TypeScript, HTML and CSS.
Take a look at my [homepage_template](https://codeberg.org/christopher-besch/homepage_template) as a starting point if you want to do the same.

### MarkDown
Well, actually there are a few more custom things:
Firstly, I use [MDX](https://mdxjs.com) to convert a MarkDown article into a React component (and then with renderToPipeableStream to HTML).
Funnily enough, my old Gatsby homepage used MDX, too.
The difference: When I want some new feature (e.g., Code Highlighting or LaTeX markup) I can use the massive [unified](https://unifiedjs.com) ecosystem directly and don't have to rely on outdated, undocumented Gatsby-plugins.

### Chris' AI Homepage Agentic AI AI AI xD
It's just image and sentence [embedding](https://en.wikipedia.org/wiki/Embedding_(machine_learning)), actually.
I use [transformer.js](https://huggingface.co/docs/transformers.js/index) to for any given article automatically find similar articles and do the same for [photos](/photography).
My CPU-only machine does that surprisingly fast.

### Immich
[Immich](https://immich.app) is an amazing tool to select, sort, rate and tag photos (among other).
Firstly, I upload and catalogue all my photos to Immich and use it's API from TypeScript to download the photos I want to publish into the `./cache` dir ([see `immich.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/immich.tsx)).
This keeps me from uploading my high-res images to the public Git repo, which I don't want to do.

### Image Conversion
Once my code downloaded my high-res photos from Immich, it uses [sharp](https://sharp.pixelplumbing.com) to convert them into roughly four web-friendly `.webp` files of different resolution.
Like this, a smartphone browser uses a smaller file than on a desktop, all without client-side JavaScript.
That's efficient!
I even bothered creating low quality image previews (LQIP) using [radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) ([see `convert_image.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/convert_image.tsx) and [my `Image` React component](https://github.com/christopher-besch/homepage/blob/main/src/components/image.tsx)).
Before an image has loaded, the browser shows a blurry gradient.

<HalfImage full={false} src="lqip.png" />

### Analytics
I use a self-hosted instance of [umami](https://umami.is) for analytics.
It works very well and because it runs on my own domain, ad blockers can't block the tracker script.
Additionally, I use it's [events feature](https://umami.is/docs/track-events) for likes and comments.
So, yes, a little bit of (non-essential) client-side JavaScript found its place on my homepage.
The analytics are surprisingly fun to look through and, e.g., see what happens when [manim.community](https://manim.community) temporarily links to one of my articles.

<HalfImage full={false} src="analytics.png" />

Those are all features you only add if you need them.
PDF articles, article readtime, RSS feed, MarkDown table-of-contents or footnotes — just find a small library or write it yourself.
Sometimes you can even let an LLM do it for you, reviews the code and maintain it forever.
But feel free to stick to the basics and don't use any more dependencies than in the [homepage_template](https://codeberg.org/christopher-besch/homepage_template).
That's the point of not using a framework:
You might still have a lot of dependencies but only those you truly need and don't create your entire homepage around them.
Once Gatsby kicked the bucked, I had to re-create my homepage.
Now if MDX goes, I'll just slot-in a different MarkDown compiler and are back on-track.

### Why not Parallel and Async?
For fun I put a lot of effort into doing as much as possible asynchronously and in parallel.
That's actually more difficult than it sounds.
I solved a big hurdle by switching from React's renderToStaticMarkup, which doesn't support async components, to renderToPipeableStream, which does.
Now I am satisfied to see all routes start generating at the same time and converting asynchronously.
My many-core computer really get's it's money worth like that.
Parallelization is an entirely other beast.
Yes, there are worker threads in Node.js but they can't directly read the main thread's constants.
In other programming languages you simply pass a function pointer to the threading library.
Then the new thread can access all variables of the main thread (sometimes with, sometimes without atomics or locks).
In Node.js, however, you pass the path to a JavaScript file, which Node.js will evaluate in another thread.
That honestly boggles my mind.
It's awful and throws type-safety.
However, it somehow works, but I had to create wrappers like these:

```ts
export async function embedSentencesOnPool(sentences: string[]): Promise<number[][]> {
    return embeddingPool.run(sentences, { name: "embedSentences" });
}
```

Among others I also had issues with
- creating directories asynchronously (For some reason this is racey in Node.js),
- creating directories in parallel (This one makes sense),
- worker threads not being able to add jobs to the worker pool's job queue,
- a ridiculous undefined behaviour bug in transformer.js (or rather onnxruntime).
  It sometimes segfaults when importing (not using, just importing) transformer.js in multiple threads (Why?).

### Conclusion
I really like my new homepage and feel confident I'll get to implement any new feature I may need.
The source code is [here](https://github.com/christopher-besch/homepage), of which some files are Open-Source.
My [homepage_template](https://codeberg.org/christopher-besch/homepage_template), however, is fully Open-Source.
Enjoy!
