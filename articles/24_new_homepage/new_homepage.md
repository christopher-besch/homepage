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
date: "2026-01-03"
tags: [software_dev, typescript, react, web, immich, umami, mdx]
listed: true
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
I run that function for every route I want to create (e.g., for each article in a loop; see [`build.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/build.tsx)).
My code places the output HTML in `./deploy` while simply copying the CSS styles.
I wrote my code in TypeScript with JSX (`.tsx` file extension) and directly compile it with tsc.
That conveniently takes care of compiling away the JSX syntax for Node.js to directly evaluate.
And that's basicaly all: No bundler, no framework; pure React, TypeScript, HTML and CSS.
Take a look at my [homepage_template](https://codeberg.org/christopher-besch/homepage_template) as a starting point if you want to do the same.

### MarkDown
Though, you can already do a lot with only those technologies, I need some more:
Firstly, I use [MDX](https://mdxjs.com) to convert a MarkDown article into a React component (and then with renderToPipeableStream to HTML).
Funnily enough, my old Gatsby homepage used MDX, too.
The difference:
Now I can directly use the massive [unified](https://unifiedjs.com) ecosystem whenever I want some new feature (e.g., Code Highlighting or LaTeX markup) and don't have to rely on outdated, undocumented Gatsby-plugins.

### Chris' AI Homepage Agentic AI genAI AI xD
It's just image and sentence [embedding](https://en.wikipedia.org/wiki/Embedding_(machine_learning)) with [transformer.js](https://huggingface.co/docs/transformers.js/index), actually.
[`embedding_worker.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/worker/embedding_worker.tsx) and [`embedding.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/embedding.tsx) take care of finding similar articles and [photos](/photography).
transformer.js runs surprisingly fast on my CPU-only machine, too.
Now every article and photo on my homepage has a *Similar Articles* / *Similar Photos* section.

### Immich
[Immich](https://immich.app) is an amazing tool to (among other) select, sort, rate and tag photos.
Firstly, I upload and catalogue all my photos to Immich.
Then [`immich.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/immich.tsx) uses the Immich API to download the photos I want to publish into the `./cache` dir.
This keeps me from uploading my high-res images to the public Git repo, which I don't want to do.
I actually really like this workflow; I code in the terminal and catalogue in a pretty web UI.

### Image Conversion
<HalfImage full={false} src="lqip.png" />

Once my code downloaded my high-res photos from Immich, it uses [sharp](https://sharp.pixelplumbing.com) to convert them into roughly four web-friendly `.webp` files of different resolution.
Like this, a smartphone browser uses a smaller file than a desktop browser; all without client-side JavaScript.
That's efficient!
I even bothered creating low quality image previews (LQIP) using [radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) (see [`convert_image.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/convert_image.tsx) and [my `Image` React component](https://github.com/christopher-besch/homepage/blob/main/src/components/image.tsx)).
Before an image has loaded, the browser shows a blurry gradient instead of blank whiteness.

### Analytics
I use a self-hosted instance of [umami](https://umami.is) for analytics.
It works very well and because it runs on my own domain, ad blockers can't block the tracker script.
Additionally, I use it's [event feature](https://umami.is/docs/track-events) for likes and comments.
So, yes, a little bit of (non-essential) client-side JavaScript found its place on my homepage.
The analytics are surprisingly fun to look through and, e.g., see what happens when [manim.community](https://manim.community) temporarily links to one of my articles.

<HalfImage full={true} src="analytics.png" />

As you can see, those are individual, self-contained features.
If you don't care about Immich, just don't add its integration.
And there's so much more you could add, e.g., PDF articles, article readtime, RSS feed, MarkDown table-of-contents or footnotes — just find a small library or write it yourself.
Sometimes you can even let an LLM do the writing and only review and maintain the code yourself.
I do that for small helper functions.
Though, feel free to stick to the basics and don't use any more dependencies than in the [homepage_template](https://codeberg.org/christopher-besch/homepage_template).
That's the point of not using a framework:
You might still have a lot of dependencies but only those you truly need.
Most importantly, you don't create your entire homepage around them:
Once Gatsby kicked the bucked, I had to re-create my whole homepage.
Now if, e.g., MDX goes, I'll just slot-in a different MarkDown compiler and am back on-track.

### Why not Parallel and Async?
For fun I put a lot of effort into doing as much as possible asynchronously and in parallel.
That's actually more difficult than it sounds.
For example, I solved a big hurdle by switching from React's renderToStaticMarkup, which doesn't support async components, to renderToPipeableStream, which does.
Now I am satisfied to see all routes start generating at the same time and converting asynchronously.

Parallelization is an entirely other beast giving my many-core computer it's money worth.
I'm used to parallelization in rust, C++, Java, etc.; does Node.js support it, too?
Yes, there are worker threads in Node.js but they can't directly read the main thread's constants.
In other programming languages you simply pass a function pointer to the threading library.
Then the new thread can access all variables of the main thread (sometimes with, sometimes without atomics or locks).
In Node.js, however, you pass the path to a JavaScript file, which Node.js will evaluate in another thread.
That honestly boggles my mind.
It's awful, throws type-safety down the drain and makes worker interactions so difficult.
However, it somehow works once I created wrappers like these:

```ts
export async function embedSentencesOnPool(sentences: string[]): Promise<number[][]> {
    return embeddingPool.run(sentences, { name: "embedSentences" });
}
```

Among others I also had issues with
- creating directories asynchronously (for some reason this is racey in Node.js),
- creating directories in parallel (this one makes sense),
- worker threads not being able to add work to the ([piscina](https://piscinajs.dev)'s) job queue,
- a ridiculous undefined behaviour bug in transformer.js (or rather onnxruntime).
  It sometimes segfaults when importing (not using, just importing) transformer.js in multiple threads (Just why?).

### Conclusion
I really like my new homepage and am confident implementing new features will be easy.
The source code is [here](https://github.com/christopher-besch/homepage), of which some files are Open-Source.
My [homepage_template](https://codeberg.org/christopher-besch/homepage_template), however, is fully Open-Source.
Enjoy!
