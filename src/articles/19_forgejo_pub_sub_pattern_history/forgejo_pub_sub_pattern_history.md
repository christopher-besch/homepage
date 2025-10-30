---
type: article
title: ""
description: "
"
banner: /social_banner/github_pages_hack.png
thumb: ../../../static/social_banner/github_pages_hack.png
title_banner: ../../images/photography/bravo_charlie.jpg
title_banner_horizontal_position: 100%
title_banner_vertical_position: 80%
slug: forgejo_pub_sub_pattern_history
date: 2025-11-29T00:00:00+00:00
listed: true
version: 1.0.0
---

I stood before a well and wondered how deep it would go.
All I could see was blackness.
Well, I didn't actually leave my cellar and instead stood before Forgejo's git history.
But still, with the 24 thousand commits Forgjeo's history felt just as opaque.<br />
Forgejo is a code forge like GitHub or GitLab.
Forgejo is a place to (collaboratively) develop software and is itself fully Open-Source.
I've already explained at length [why we benefit greatly from Open-Source](https://github.com/christopher-besch/homepage/blob/dev/articles/open_source).
What I'm interested in is Forgejo's publish-subscribe pattern.
It allows packages to publish messages grouped by topics.
Other packages subscribe to those topics and get called when a message for a topic of interest arrives.
`forgejo.org/services/notify.Notify` is the broker, which facilitating all this.
I've created a visualization of Forgejo's pub-sub pattern.
Packages are Forgejo-orange and topics Codeberg-blue.
Every arrow goes in the direction messages flow, from sender to receiver.

<Iframe src="https://christopher-besch.github.io/go_observer_pattern_visualizer/viewer" fullscreen />

The list on the right shows all commits in Forgejo's history that change something about the pub-sub pattern.
Select a commit see how the Forgejo looked like back then.
Once you've selected a commit you can use the arrow keys, too.

## Go AST, a lot of Bash and D3.js
How did I create this visualization?
Firstly, let's take a look at how Forgejo's pub-sub pattern works.
Every participating package defines a notifier struct like this:

```go
// Define the notifier.
type actionsNotifier struct {
	notify_service.NullNotifier
}

// Ensure that this struct fulfills the Notifier interface.
var _ notify_service.Notifier = &actionsNotifier{}

// Declare functions for all topics the package is interested in.
func (n *actionsNotifier) NewIssue(/* --snip-- */) {
// --snip--

// Tell the broker there's a new notifier to be notified.
notify_service.RegisterNotifier(&actionsNotifier{})

// send a message to some topic
notify_service.PullReviewDismiss(ctx, doer, review, comment)
```
So what I had to do is find these places in Forgejo's source code and compile that data into a usable format.
I thought about doing this with grep and simple string matching but I figured something more robust wouldn't hurt.
Therefore, I used Go's abstract syntax tree (AST) directly.
A part of the Go compiler generates the AST and to my delight, there is the `go/ast` package to walk through the AST and `go/types` for type checking.
There even is the convenient `golang.org/x/tools/go/packages` package to tie it all together.
Take a look at my [parser main.go](https://codeberg.org/christopher-besch/go_pub_sub_visualizer/src/branch/main/parser/main.go) if you're interested in some details.
This file spits out a JSON.
For the pretty visualization I used [D3.js](https://d3js.org)'s force simulation.
It simulates repelling forces between all nodes and attracting forces between connected nodes.
Take a look at the [viewer source code](https://codeberg.org/christopher-besch/go_pub_sub_visualizer/src/branch/main/viewer) for more.

## The Well and the Light
Now that I had a way to extract this data for one state of Forgejo's code base a bigger thought appeared.
Why not do this for every commit in Forgejo's history?
How difficult could it be?
As you can see above, that did work out but not without hiccups.
So, I invite you to come on a little journey down Forgejo's history:
Let's throw a light down that well!

### *0,000m* 2025-10-27 ([346f87d](https://codeberg.org/forgejo/forgejo/commit/346f87d7a26d7c3678867961c74487e5b759cbf0))
I started in front of the well:
A few days a go I created [a script](https://codeberg.org/christopher-besch/go_pub_sub_visualizer/src/branch/main/auto_parser.sh) that creates the pub-sub data JSON, checks out the previous commit and repeats the process.
This is where I left it off, falling into the darkness below.
I didn't know if and when my script would encounter some hurdle and crash.

### *0,780m* 2025-06-17 ([16dbc0e](https://codeberg.org/forgejo/forgejo/commit/16dbc0efd350cdc15760c2e40346c1e9fbb0bd01))
This was my first hiccup; my Go script crashed.
Apparently this commit removed a type of token that my script didn't expect (a SelectorExpr with a Selector that doesn't map to any object).
So, all older commits than this crashe my script.
I added a nil check and sent my script back to the races.
```go
pkg.TypesInfo.Uses[f.Sel] != nil
```

### *1,225m* 2025-03-27 ([2457f5f](https://codeberg.org/forgejo/forgejo/commit/2457f5ff2293f69e6de5cc7d608dd210f6b8e27a))
And I encountered another hiccup; in March Forgejo changed the Go module path from `code.gitea.io/gitea` to `forgejo.org`.
After all, Forgejo is a fork of Gitea.
I adjusted my Go script and made the viewer remove the `forgejo.org` and `code.gitea.io/gitea` prefixes.

### *7,568m* 2023-09-05 ([540bf9f](https://codeberg.org/forgejo/forgejo/commit/540bf9fa6d0d86297c9d575640798b718767bd9f))
And whush, I just dropped through to before the Forgejo fork.
Here the Gitea developers changed the pub-sub broker package from `code.gitea.io/gitea/modules/notification/base.Notifier` to `code.gitea.io/gitea/services/notify.Notifier`.
Adjust the script and continue.

### *10,956m* 2022-03-16 ([ed1d95c](https://codeberg.org/forgejo/forgejo/commit/ed1d95c55dfa91d1c9a486bfb8e00375d4038e29))
My script crashed here below this commit, which upgrades from `go1.17` to `go1.18`.
Apparently `golang.org/x/tools/go/packages` requires `go mod tidy` to run on a `go1.17` project.
I adjusted my script accordingly and let it run for the night.
When I woke up the next morning I noticed that my Nextcloud instance was down.
After quickly logging into my server I realized it entirely ran out of disk space, whups.
The `~/go` directory grew so large with Forgejos's many old dependencies it completely crippled my server.
Running my script in a Docker container didn't help here.

### *12,264m* 2021-06-23 ([17030ce](https://codeberg.org/forgejo/forgejo/commit/17030ced75059ec21f6fb1945a751c3ebef29a32))
Here a problem occurred when I re-ran my script with older versions of Go (more info on that below).
Somehow `go1.14` failed to `go1.14 mod tidy` below this commit.
Though my up-to-date `go1.25.3` did work so my script now uses the new Go version whenever the old one fails.

### ~*15,946m* 2019-09-12 ([3f5cdfe](https://codeberg.org/forgejo/forgejo/commit/3f5cdfe35905730ced41397c6ccd50df3804b5ec))
I forgot 
TODO
```bash
2312  vit bisect start
git bisect start
git bisect old d77176912bccf1dc0ad93366df55f00fee23b498
git bisect new forgejo
cat go.mod | grep -P '^go ' | cut -d ' ' -f2
# 1.20
git bisect new
# --snip--
```

### *16,625m* 2019-03-27 ([d578b71](https://codeberg.org/forgejo/forgejo/commit/d578b71d61ee8131e8abf7f538b93d8c6cc6fe6d))
This commit moves the code base from `code.gitea.io/git` to `code.gitea.io/gitea`.
Uff, okay, I added another rename option.

### *16,940m* 2019-01-13 ([beab2df](https://codeberg.org/forgejo/forgejo/commit/beab2df1227f9b7e556aa5716d94feb3a3e2088e))
And another rename.
This commit moves the broker struct from `modules/notification/base/base.go` to `modules/notification/base/notifier.go`.

### *16,141m* 2019-07-25 ([5efd363](https://codeberg.org/forgejo/forgejo/commit/5efd3630bc21d4b0ba6ff492d16d4c7e2814dd1f))
Things get pretty icky down here:
There's a problem with the xorm dependency.
This commit updates to xorm `v0.7.4` but the old `v0.7.3-0.20190620151208-f1b4f8368459` fails with `go mod tidy`.
I don't know why but my fix is as hacky as it is simple:
```bash
sed -i 's#github.com/go-xorm/xorm v0.7.3-0.20190620151208-f1b4f8368459#github.com/go-xorm/xorm v0.7.3#' go.mod
```

Btw, this is the old xorm repo before it got moved to a Gitea server.
I'm glad the old repo is only archived and not deleted.
Otherwise, I'd have to do more work here.<br />
Come to think of it, there are a lot of old dependency versions we rarely care about.
If they are lost, we won't be able to build old versions of our software.
That might be a real trouble if we want to reproduce some problem with outdated software.

### *16,624m* 2019-03-27 ([d771769](https://codeberg.org/forgejo/forgejo/commit/d77176912bccf1dc0ad93366df55f00fee23b498))
We are so far below the surface we don't even have a `go.mod` file anymore.
Gitea used `Gopkg.lock` before this commit.
```bash
if [ ! -f go.mod ]; then
    go mod init
fi
```

### *17,177m* 2018-10-18 ([ea619b3](https://codeberg.org/forgejo/forgejo/commit/ea619b39b2f2a3c1fb5ad28ebd4a269b2f822111))
Here, my script threw its final error: Empty output.<br />
There's no more pub-sub pattern to look for below this.
This commit is where the pub-sub pattern was created.
This commit is the bottom of the well our light just hit.
This is the end of our pub-sub journey.
Alas, we could still check how much rock there is below the well.

### *23,913m* 2014-02-11 ([475e347](https://codeberg.org/forgejo/forgejo/commit/475e3471b4e8da8776fe7e66a3390c8a30c19f08))
And this is it, the very first commit in Forgejo's history.
We are so far back, the isn't named Forgejo or Gitea anymore, down here the project goes by the name Gogs.
Now there really isn't any deeper to go.

## What the Visualization Shows
Firstly, there used to be a topic no package ever sent a message to, `NotifyPullRevieweDismiss`.
It was removed [in June](https://codeberg.org/forgejo/forgejo/commit/d17aa98262480c17051c66353ac4ec300ab8033c) and we can see that in the visualization.<br />
Then there's my contribution to Forgejo: the `ActionRunNowDone` topic.
The visualization shows how I implemented the topic without any sending packages at first.
In a second commit I attach the `services/mailer` and in a third `services/webhook` package.<br />
Lastly, I found some very strange behaviour from December 2022 to September 2023.
[c53f802](https://codeberg.org/forgejo/forgejo/commit/c53f802778c1951e0804507eec995bca37f1b09b) removed the `Notify` prefix from all topics.
On the very next day [a89b399](https://codeberg.org/forgejo/forgejo/commit/a89b399faa275c28d0ffe9759d492636f67d6da0) reverted that.
This goes back and forth a lot, which explains the jarring visualization around this time.
In the end [540bf9f](https://codeberg.org/forgejo/forgejo/commit/540bf9fa6d0d86297c9d575640798b718767bd9f) removed the `Notify` prefix for the last time.
Maybe this is a broken bit in the Forgejo git history?<br />
As of [9524b8c](https://codeberg.org/forgejo/forgejo/commit/9524b8c3702e204d9f942090acb39a3549c80ca8) there's still some dead code.
The `Run` topic is never sent a message to and no one listens to the `DeleteIssue` topic.
One could automate a check like this, maybe in CI.

## Conclusion
This really felt like diving into the abyss.
I never knew what would be below and when my script failed the next time.
It also gave me chills, working with such large code bases, with such history every day.
There is so much knowledge 

TZ=UTC0 git show --no-patch --date=local '--format=%ci' 346f87d7a26d7c3678867961c74487e5b759cbf0 && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' 2457f5ff2293f69e6de5cc7d608dd210f6b8e27a && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' 540bf9fa6d0d86297c9d575640798b718767bd9f && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' ed1d95c55dfa91d1c9a486bfb8e00375d4038e29 && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' 17030ced75059ec21f6fb1945a751c3ebef29a32 && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' d578b71d61ee8131e8abf7f538b93d8c6cc6fe6d && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' beab2df1227f9b7e556aa5716d94feb3a3e2088e && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' 5efd3630bc21d4b0ba6ff492d16d4c7e2814dd1f && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' d77176912bccf1dc0ad93366df55f00fee23b498 && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' ea619b39b2f2a3c1fb5ad28ebd4a269b2f822111 && \
TZ=UTC0 git show --no-patch --date=local '--format=%ci' 475e3471b4e8da8776fe7e66a3390c8a30c19f08


TZ=UTC0 git show --no-patch --date=local '--format=%ci' 16dbc0efd350cdc15760c2e40346c1e9fbb0bd01
git rev-list --count 16dbc0efd350cdc15760c2e40346c1e9fbb0bd01..346f87d7a26d7c3678867961c74487e5b759cbf0

2025-10-27 08:34:00 +0100
2025-03-27 19:40:14 +0000
2023-09-05 18:37:47 +0000
2022-03-16 00:08:31 -0400
2021-06-23 00:14:22 -0400
2019-03-27 17:33:00 +0800
2019-01-13 16:42:55 +0200
2019-07-25 00:39:14 +0300
2019-03-27 19:15:23 +0800
2018-10-18 19:23:05 +0800


### somewhere are go1.12

This process took a few days and just like the light falling into the abyss, I didn't know what comes next.

