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
tags: [software_development, typescript, react, web, immich]
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
I've taken so many photos, I needed to get some structure into them.
[Immich](https://immich.app) is an amazing tool for that.
And it's API allows me to integrate my build code with it.
Now my high-res images are only on Immich and in the `./cache` dir, not in the Git repo.

### Image Conversion
Once my code downloaded my high-res photos from Immich, it uses [sharp](https://sharp.pixelplumbing.com) to convert them into roughly four web-friendly `.webp` files of different resolution.
Like this, a smartphone browser uses a smaller file than on a desktop, all without client-side JavaScript.
That's efficient!
I even bothered creating low quality image previews (LQIP) using [radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient) ([see `convert_image.tsx`](https://github.com/christopher-besch/homepage/blob/main/src/convert_image.tsx)).
Before an image has loaded, the browser shows a blurry gradient.

<HalfImage full={false} src="lqip.png" />

Those are all features you only need to add if you need them; feel free to stick to the basics and don't use any more dependencies than in the [homepage_template](https://codeberg.org/christopher-besch/homepage_template).
That's the point of not using a framework:
You might still have a lot of dependencies but you don't create your entire homepage around them.
Once Gatsby kicked the bucked, I had to re-create my homepage.
Now if MDX goes, I'll just slot-in a different MarkDown compiler and are back on-track.

### Why not Parallel and Async?
For fun I put a lot of effort into doing as much as possible asynchronously and in parallel.
That's actually more difficult than it sounds.
I solved a big hurdle by switching from React's renderToStaticMarkup, which doesn't support async components, to renderToPipeableStream, which does.
Now I am satisfied to see all routes start generating at the same time and converting asynchronously.
My many-core computer really get's it's money worth like that.
Parallelization is an entirely other beast.
Yes, there are worker threads in Node.js but they can't easily communicate with each other.
In other programming languages you pass a function pointer to a thread creation function.
In Node.js you instead pass the path to a file, which Node.js will evaluate in another thread.
That honestly let my jaw drop.
It's awful, throws type-safety down the drain but somehow works.
I had to create wrappers like these:

```ts
export async function embedSentencesOnPool(sentences: string[]): Promise<number[][]> {
    return embeddingPool.run(sentences, { name: "embedSentences" });
}
```

Among others I also had issues with
- async file access causing a race condition (no, plain JavaScript isn't immune to those) and
- a ridiculous undefined behaviour bug in transformer.js (or rather onnxruntime) that sometimes segfaults when importing (not using, just importing) transformer.js in multiple threads.

### Conclusion
I really like my new homepage and feel confident I'll get to implement any new feature I may need.
The source code is [here](https://github.com/christopher-besch/homepage), of which some files are Open-Source.
My [homepage_template](https://codeberg.org/christopher-besch/homepage_template), however, is fully Open-Source.
Enjoy!

- AI generated helper function rather than dependency
- umami
Perhaps it simply isn't for my use-case but I never felt that pay off.
